import assert from 'node:assert/strict'
import test from 'node:test'
import { checkApi, createApiHealthMonitor, needsHealthCheck } from '../server/utils/apiHealth.ts'
import { maintenanceHtml } from '../server/utils/maintenancePage.ts'

const respond = (status, calls) => async url => {
  calls.push(String(url))
  return { ok: status >= 200 && status < 300, status }
}

test('sin API configurada se considera disponible y no hace peticiones', async () => {
  const calls = []
  assert.equal(await checkApi({ baseUrl: '', fetchImpl: respond(500, calls) }), true)
  assert.equal(calls.length, 0)
})

test('API que responde 200 en /api/health está arriba', async () => {
  const calls = []
  assert.equal(
    await checkApi({ baseUrl: 'http://api.test/', fetchImpl: respond(200, calls) }),
    true
  )
  assert.deepEqual(calls, ['http://api.test/api/health'])
})

test('API caída se reintenta una vez y se da por caída', async () => {
  const calls = []
  assert.equal(
    await checkApi({ baseUrl: 'http://api.test', fetchImpl: respond(503, calls) }),
    false
  )
  assert.equal(calls.length, 2)
})

test('error de red cuenta como caída; una recuperación en el reintento cuenta como arriba', async () => {
  const boom = async () => {
    throw new Error('red')
  }
  assert.equal(await checkApi({ baseUrl: 'http://api.test', fetchImpl: boom }), false)
  let n = 0
  const flaky = async () => {
    if (n++ === 0) throw new Error('red')
    return { ok: true, status: 200 }
  }
  assert.equal(await checkApi({ baseUrl: 'http://api.test', fetchImpl: flaky }), true)
})

test('el monitor guarda el resultado y comparte la comprobación en curso', async () => {
  let t = 0
  let checks = 0
  const monitor = createApiHealthMonitor({
    check: async () => {
      checks++
      return true
    },
    now: () => t
  })
  await Promise.all([monitor.isUp(), monitor.isUp(), monitor.isUp()])
  assert.equal(checks, 1)
  t = 14_000
  await monitor.isUp()
  assert.equal(checks, 1)
  t = 16_000
  await monitor.isUp()
  assert.equal(checks, 2)
})

test('una caída se vuelve a comprobar antes que un estado sano', async () => {
  let t = 0
  let up = false
  let checks = 0
  const monitor = createApiHealthMonitor({
    check: async () => {
      checks++
      return up
    },
    now: () => t
  })
  assert.equal(await monitor.isUp(), false)
  t = 6_000
  up = true
  assert.equal(await monitor.isUp(), true)
  assert.equal(checks, 2)
})

test('solo las páginas HTML pasan por la comprobación', () => {
  const html = 'text/html,application/xhtml+xml'
  assert.equal(needsHealthCheck('GET', '/', html), true)
  assert.equal(needsHealthCheck('GET', '/portafolio/mi-comodoro', html), true)
  assert.equal(needsHealthCheck('GET', '/admin', html), true)
  assert.equal(needsHealthCheck('POST', '/', html), false)
  assert.equal(needsHealthCheck('GET', '/api/portfolio', html), false)
  assert.equal(needsHealthCheck('GET', '/_nuxt/entry.js', '*/*'), false)
  assert.equal(needsHealthCheck('GET', '/logo.webp', html), false)
  assert.equal(needsHealthCheck('GET', '/robots.txt', html), false)
  assert.equal(needsHealthCheck('GET', '/', 'application/json'), false)
})

test('la página de mantenimiento es autocontenida, en español y sin indexar', () => {
  const html = maintenanceHtml()
  assert.match(html, /lang="es"/)
  assert.match(html, /noindex/)
  assert.match(html, /<h1/)
  assert.doesNotMatch(html, /https?:\/\//)
})
