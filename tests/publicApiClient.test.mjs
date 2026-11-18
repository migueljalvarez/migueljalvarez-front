import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test, { after, before } from 'node:test'
import { createPublicApiClient, normalizeBaseUrl } from '../server/utils/publicApiClient.ts'

let server
let baseUrl
const seen = []

before(async () => {
  server = createServer((request, response) => {
    seen.push({ url: request.url, headers: request.headers })
    if (request.url === '/ok') {
      response.setHeader('content-type', 'application/json')
      response.end(JSON.stringify([{ slug: 'demo' }]))
    } else if (request.url === '/boom') {
      response.statusCode = 500
      response.end('error')
    } else if (request.url === '/notfound') {
      response.statusCode = 404
      response.end('{}')
    } else if (request.url === '/invalid') {
      response.end('esto no es json')
    } else if (request.url === '/slow') {
      setTimeout(() => response.end('[]'), 1000)
    } else {
      response.statusCode = 404
      response.end()
    }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(() => {
  server.closeAllConnections?.()
  server.close()
})

test('devuelve el JSON cuando la API responde', async () => {
  const client = createPublicApiClient({ baseUrl })
  assert.equal(client.configured, true)
  assert.deepEqual(await client.get('/ok'), [{ slug: 'demo' }])
})

test('sin URL configurada devuelve null sin hacer ninguna petición', async () => {
  const before = seen.length
  const client = createPublicApiClient({ baseUrl: '' })
  assert.equal(client.configured, false)
  assert.equal(await client.get('/ok'), null)
  assert.equal(seen.length, before)
})

test('una URL no http(s) se trata como sin API', async () => {
  for (const value of ['ftp://servidor', 'javascript:alert(1)', 'no-es-una-url', '   ']) {
    assert.equal(createPublicApiClient({ baseUrl: value }).configured, false, value)
  }
  assert.equal(normalizeBaseUrl('http://localhost:4000///'), 'http://localhost:4000')
})

test('un error HTTP, un 404 o un JSON inválido devuelven null y avisan', async () => {
  const errors = []
  const client = createPublicApiClient({
    baseUrl,
    onError: (path, reason) => errors.push([path, reason])
  })
  assert.equal(await client.get('/boom'), null)
  assert.equal(await client.get('/notfound'), null)
  assert.equal(await client.get('/invalid'), null)
  assert.deepEqual(
    errors.map(([path]) => path),
    ['/boom', '/notfound', '/invalid']
  )
  assert.equal(errors[0][1], 'HTTP 500')
})

test('si la API tarda más del tiempo máximo devuelve null (el sitio no se queda esperando)', async () => {
  const started = Date.now()
  const client = createPublicApiClient({ baseUrl, timeoutMs: 100 })
  assert.equal(await client.get('/slow'), null)
  assert.ok(Date.now() - started < 800, 'debe cortar mucho antes de que responda el servidor')
})

test('si la API no es alcanzable devuelve null', async () => {
  const client = createPublicApiClient({ baseUrl: 'http://127.0.0.1:1', timeoutMs: 500 })
  assert.equal(await client.get('/ok'), null)
})

test('envía las cabeceras fijas (credenciales de servicio) y pide JSON', async () => {
  const client = createPublicApiClient({
    baseUrl,
    headers: { 'CF-Access-Client-Id': 'id-de-prueba' }
  })
  await client.get('/ok')
  const last = seen.at(-1)
  assert.equal(last.headers['cf-access-client-id'], 'id-de-prueba')
  assert.equal(last.headers.accept, 'application/json')
})
