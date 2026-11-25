import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { callDespensa, failureFromStatus, normalizeDespensaBase } from '../server/utils/despensa.ts'
import { simulatedFeedback } from '../server/utils/despensaMock.ts'
import { despensaCounters, despensaOffset, despensaPaging } from '../utils/admin/despensa.ts'
import { parseFeedbackPage, parseFeedbackQuery, parsePing } from '../utils/despensa.ts'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const KEY = 'llave-de-prueba-0123456789'
const BASE = 'https://api.ejemplo.test'

const reply = (status, body) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }))

test('la dirección acepta el servidor o la base completa y rechaza lo inseguro', () => {
  assert.equal(normalizeDespensaBase(BASE), `${BASE}/api/v1/admin`)
  assert.equal(normalizeDespensaBase(`${BASE}/api/v1/admin/`), `${BASE}/api/v1/admin`)
  assert.equal(normalizeDespensaBase('http://localhost:3000'), 'http://localhost:3000/api/v1/admin')
  assert.equal(normalizeDespensaBase('http://api.ejemplo.test'), null) // http fuera de localhost
  assert.equal(normalizeDespensaBase('https://usuario:clave@api.ejemplo.test'), null)
  assert.equal(normalizeDespensaBase('no es una url'), null)
  assert.equal(normalizeDespensaBase(''), null)
})

test('filtro y paginación: los límites del contrato', () => {
  assert.deepEqual(parseFeedbackQuery({}), { limit: 20, offset: 0 })
  assert.deepEqual(parseFeedbackQuery({ kind: 'problema', limit: '50', offset: '40' }), {
    kind: 'problema',
    limit: 50,
    offset: 40
  })
  assert.deepEqual(parseFeedbackQuery({ kind: '' }), { limit: 20, offset: 0 })
  for (const bad of [
    { kind: 'otra' },
    { limit: '0' },
    { limit: '101' },
    { limit: 'x' },
    { offset: '-1' },
    { offset: '99999999999' }
  ])
    assert.equal(parseFeedbackQuery(bad), null, JSON.stringify(bad))
})

test('la respuesta de la API se valida y lo raro se descarta', () => {
  const good = {
    items: [
      { id: 'a', kind: 'idea', message: 'Hola', appVersion: '1.0.0', platform: 'ios', userRef: null, createdAt: '2026-11-25T14:00:00.000Z' }
    ],
    total: 1,
    porTipo: { idea: 1, raro: 'x' },
    limit: 20,
    offset: 0
  }
  const page = parseFeedbackPage(good)
  assert.equal(page.items.length, 1)
  assert.deepEqual(page.porTipo, { idea: 1 }) // el valor que no es número se ignora
  assert.equal(parseFeedbackPage({ ...good, total: 'uno' }), null)
  assert.equal(parseFeedbackPage({ ...good, items: [{ id: 'a' }] }), null)
  assert.equal(parseFeedbackPage(null), null)
  assert.deepEqual(parsePing({ ok: true, hora: '2026-11-25T14:01:55.532Z' }), { ok: true, hora: '2026-11-25T14:01:55.532Z' })
  assert.equal(parsePing({ ok: false }), null)
})

test('la llamada envía la llave en la cabecera, no sigue redirecciones y desenvuelve la respuesta', async () => {
  let seen
  const fetchImpl = (url, init) => {
    seen = { url: String(url), init }
    return reply(200, { success: true, data: { ok: true, hora: 'ahora' } })
  }
  const result = await callDespensa({ baseUrl: BASE, adminKey: KEY, fetchImpl }, '/ping')
  assert.deepEqual(result, { ok: true, data: { ok: true, hora: 'ahora' } })
  assert.equal(seen.url, `${BASE}/api/v1/admin/ping`)
  assert.equal(seen.init.headers['x-admin-key'], KEY)
  assert.equal(seen.init.redirect, 'error')
  assert.equal(seen.init.method, 'GET')

  await callDespensa({ baseUrl: BASE, adminKey: KEY, fetchImpl }, '/feedback', { kind: 'idea', limit: 20, offset: 0 })
  assert.equal(seen.url, `${BASE}/api/v1/admin/feedback?kind=idea&limit=20&offset=0`)
})

test('los errores de Mi Despensa salen con un mensaje claro, sin la llave y sin 401', async () => {
  const cases = { 401: 'key', 403: 'key', 404: 'off', 429: 'rate', 400: 'bad', 500: 'down' }
  for (const [status, code] of Object.entries(cases)) {
    const result = await callDespensa(
      { baseUrl: BASE, adminKey: KEY, fetchImpl: () => reply(Number(status), { success: false }) },
      '/ping'
    )
    assert.equal(result.ok, false)
    assert.equal(result.code, code, status)
    assert.notEqual(result.httpStatus, 401) // el panel lo tomaría por sesión vencida
    assert.equal(JSON.stringify(result).includes(KEY), false)
  }
  assert.equal(failureFromStatus(401).httpStatus, 502)
  assert.equal(failureFromStatus(429).httpStatus, 429)

  const sinConexion = await callDespensa(
    { baseUrl: BASE, adminKey: KEY, fetchImpl: () => Promise.reject(new Error(`falló ${BASE} con ${KEY}`)) },
    '/ping'
  )
  assert.equal(sinConexion.code, 'down')
  assert.equal(JSON.stringify(sinConexion).includes(KEY), false) // el detalle del error nunca se devuelve
  assert.equal((await callDespensa({ baseUrl: '', adminKey: KEY }, '/ping')).code, 'config')
  assert.equal((await callDespensa({ baseUrl: BASE, adminKey: '' }, '/ping')).code, 'config')
  assert.equal(
    (await callDespensa({ baseUrl: BASE, adminKey: KEY, fetchImpl: () => reply(200, { success: false }) }, '/ping')).code,
    'down'
  )
})

test('los datos simulados cumplen el contrato (filtro, total sin filtro y paginación)', () => {
  const all = simulatedFeedback({ limit: 20, offset: 0 })
  assert.equal(all.total, 23)
  assert.equal(all.items.length, 20)
  assert.equal(all.porTipo.idea + all.porTipo.problema + all.porTipo.otro, 23)
  assert.ok(parseFeedbackPage(all))
  const filtered = simulatedFeedback({ kind: 'problema', limit: 20, offset: 0 })
  assert.equal(filtered.total, filtered.porTipo.problema)
  assert.ok(filtered.items.every(item => item.kind === 'problema'))
  assert.deepEqual(filtered.porTipo, all.porTipo) // los contadores no dependen del filtro
  assert.equal(simulatedFeedback({ limit: 20, offset: 20 }).items.length, 3)
})

test('contadores y paginación del panel', () => {
  const counters = despensaCounters({ idea: 3, problema: 2, otro: 1, raro: 4 })
  assert.equal(counters.total, 10)
  assert.equal(counters.items.find(item => item.kind === 'otro').count, 5) // un tipo desconocido cuenta como «Otros»
  assert.equal(despensaOffset(1), 0)
  assert.equal(despensaOffset(3), 40)
  assert.deepEqual(despensaPaging(45, 3), { page: 3, pages: 3, from: 41, to: 45, hasPrev: true, hasNext: false })
})

test('la llave solo existe en el servidor: nunca en el código del navegador ni en el build', () => {
  const clientDirs = ['components', 'pages', 'composables', 'layouts', 'plugins', 'utils']
  const walk = dir =>
    readdirSync(join(root, dir), { withFileTypes: true }).flatMap(entry =>
      entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
    )
  for (const file of clientDirs.flatMap(walk)) {
    const text = readFileSync(join(root, file), 'utf8')
    assert.equal(/MI_DESPENSA_ADMIN_KEY|miDespensaAdminKey|x-admin-key/.test(text), false, file)
  }
  // runtimeConfig privado y vacío: el valor se provee en ejecución, no se hornea.
  const config = readFileSync(join(root, 'nuxt.config.ts'), 'utf8')
  assert.match(config, /miDespensaAdminKey: ''/)
  assert.doesNotMatch(config.replace(/\/\/.*$/gm, ''), /process\.env\.[A-Z_]*DESPENSA/)
})

test('los datos simulados no llegan al build de producción', () => {
  const outputDir = join(root, '.output')
  if (!existsSync(outputDir)) return // sin build no hay nada que comprobar (los otros tests de .output hacen igual)
  const walk = dir =>
    readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      if (entry.isSymbolicLink() || entry.name === 'node_modules') return []
      const path = join(dir, entry.name)
      return entry.isDirectory() ? walk(path) : [path]
    })
  const offenders = walk(outputDir)
    .filter(file => /\.(m?js|json|html)$/.test(file) && !file.endsWith('.map'))
    .filter(file => readFileSync(file, 'utf8').includes('(SIMULADO)'))
  assert.deepEqual(offenders, [])
})
