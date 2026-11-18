import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test, { after, before } from 'node:test'
import { createPublicApiClient } from '../server/utils/publicApiClient.ts'

let server
let baseUrl
const received = []

before(async () => {
  server = createServer((request, response) => {
    let raw = ''
    request.on('data', chunk => (raw += chunk))
    request.on('end', () => {
      received.push({
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: raw
      })
      response.setHeader('content-type', 'application/json')
      if (request.url === '/created') {
        response.statusCode = 201
        response.end(JSON.stringify({ id: 'abc' }))
      } else if (request.url === '/existing') {
        response.statusCode = 200
        response.end(JSON.stringify({ id: 'abc' }))
      } else if (request.url === '/rejected') {
        response.statusCode = 400
        response.end(JSON.stringify({ message: 'dato inválido' }))
      } else if (request.url === '/boom') {
        response.statusCode = 503
        response.end('no es json')
      } else if (request.url === '/slow') {
        setTimeout(() => response.end('{}'), 1000)
      } else {
        response.statusCode = 404
        response.end('{}')
      }
    })
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(() => {
  server.closeAllConnections?.()
  server.close()
})

test('POST envía el cuerpo como JSON con las cabeceras fijas y las de la petición', async () => {
  const client = createPublicApiClient({ baseUrl, headers: { 'CF-Access-Client-Id': 'id-fijo' } })
  const result = await client.post('/created', { hola: 'mundo' }, { 'x-intake-key': 'clave' })
  assert.deepEqual(result, { ok: true, status: 201, data: { id: 'abc' } })

  const last = received.at(-1)
  assert.equal(last.method, 'POST')
  assert.equal(last.headers['content-type'], 'application/json')
  assert.equal(last.headers['cf-access-client-id'], 'id-fijo')
  assert.equal(last.headers['x-intake-key'], 'clave')
  assert.deepEqual(JSON.parse(last.body), { hola: 'mundo' })
})

test('POST distingue 200, 4xx y 5xx por el estado, sin lanzar', async () => {
  const client = createPublicApiClient({ baseUrl })
  assert.equal((await client.post('/existing', {})).status, 200)
  const rejected = await client.post('/rejected', {})
  assert.deepEqual(rejected, { ok: false, status: 400, data: { message: 'dato inválido' } })
  const boom = await client.post('/boom', {})
  assert.equal(boom.status, 503)
  assert.equal(boom.data, null, 'un cuerpo que no es JSON no rompe el cliente')
})

test('POST devuelve estado 0 si no hay API, hay tiempo agotado o no es alcanzable', async () => {
  assert.deepEqual(await createPublicApiClient({ baseUrl: '' }).post('/x', {}), {
    ok: false,
    status: 0,
    data: null
  })
  const slow = await createPublicApiClient({ baseUrl, timeoutMs: 100 }).post('/slow', {})
  assert.equal(slow.status, 0)
  const unreachable = await createPublicApiClient({
    baseUrl: 'http://127.0.0.1:1',
    timeoutMs: 300
  }).post('/x', {})
  assert.equal(unreachable.status, 0)
})

test('POST sin API configurada no hace ninguna petición', async () => {
  const before = received.length
  await createPublicApiClient({ baseUrl: '   ' }).post('/created', {})
  assert.equal(received.length, before)
})
