import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test, { after, before } from 'node:test'
import {
  extractSessionCookie,
  isMultipartType,
  isSafeSegments,
  proxyAdminRequest
} from '../server/utils/adminProxy.ts'

let server
let baseUrl
const received = []

before(async () => {
  server = createServer((request, response) => {
    const chunks = []
    request.on('data', chunk => chunks.push(chunk))
    request.on('end', () => {
      const bytes = Buffer.concat(chunks)
      received.push({
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: bytes.toString('utf8'),
        bytes
      })
      if (request.url.startsWith('/api/admin/login/totp')) {
        response.statusCode = 204
        response.setHeader('set-cookie', [
          'admin_session=nueva; HttpOnly; Path=/',
          'otra=cosa; Path=/'
        ])
        response.end()
      } else if (request.url.startsWith('/api/admin/redirect')) {
        response.statusCode = 302
        response.setHeader('location', 'http://otro-sitio.test/')
        response.end()
      } else if (request.url.startsWith('/api/admin/slow')) {
        setTimeout(() => response.end('{}'), 1000)
      } else {
        response.statusCode = 200
        response.setHeader('content-type', 'application/json')
        response.end(JSON.stringify({ ok: true }))
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

const base = { clientIp: '203.0.113.7' }

test('reenvía método, ruta bajo /api/admin, query y cuerpo JSON', async () => {
  const result = await proxyAdminRequest(
    { baseUrl },
    {
      ...base,
      method: 'PATCH',
      segments: ['leads', 'abc-123'],
      query: { status: 'nuevo', tag: ['a', 'b'], vacio: undefined },
      body: '{"status":"contactado"}'
    }
  )
  assert.equal(result.status, 200)
  assert.deepEqual(JSON.parse(result.body), { ok: true })
  assert.equal(result.contentType, 'application/json')

  const last = received.at(-1)
  assert.equal(last.method, 'PATCH')
  assert.equal(last.url, '/api/admin/leads/abc-123?status=nuevo&tag=a&tag=b')
  assert.equal(last.headers['content-type'], 'application/json')
  assert.equal(last.body, '{"status":"contactado"}')
})

test('solo viaja la cookie admin_session y la IP real del visitante', async () => {
  await proxyAdminRequest(
    { baseUrl },
    {
      ...base,
      method: 'GET',
      segments: ['session'],
      cookie: 'analytics=123; admin_session=token-secreto; otra=valor',
      userAgent: 'Mozilla/5.0 prueba'
    }
  )
  const last = received.at(-1)
  assert.equal(last.headers.cookie, 'admin_session=token-secreto')
  assert.equal(last.headers['x-client-ip'], '203.0.113.7')
  assert.equal(last.headers['user-agent'], 'Mozilla/5.0 prueba')
})

test('sin cookie de sesión no envía ninguna cookie', async () => {
  await proxyAdminRequest(
    { baseUrl },
    { ...base, method: 'GET', segments: ['session'], cookie: 'solo=otra' }
  )
  assert.equal(received.at(-1).headers.cookie, undefined)
})

test('devuelve las cookies que fija la API (login) y el 204 sin cuerpo', async () => {
  const result = await proxyAdminRequest(
    { baseUrl },
    { ...base, method: 'POST', segments: ['login', 'totp'], body: '{"code":"123456"}' }
  )
  assert.equal(result.status, 204)
  assert.equal(result.body, '')
  assert.equal(result.setCookies.length, 2)
  assert.match(result.setCookies[0], /^admin_session=nueva; HttpOnly/)
})

test('agrega las cabeceras fijas (credenciales de Cloudflare Access)', async () => {
  await proxyAdminRequest(
    { baseUrl, headers: { 'CF-Access-Client-Id': 'id-servicio' } },
    { ...base, method: 'GET', segments: ['session'] }
  )
  assert.equal(received.at(-1).headers['cf-access-client-id'], 'id-servicio')
})

test('rechaza rutas que podrían salirse de /api/admin (sin hacer ninguna petición)', async () => {
  const before = received.length
  for (const segments of [
    ['..', 'health'],
    ['leads', '..', '..', 'health'],
    ['a/b'],
    ['%2e%2e'],
    ['x y'],
    ['http://otro.test'],
    ['leads', ''],
    []
  ]) {
    const result = await proxyAdminRequest({ baseUrl }, { ...base, method: 'GET', segments })
    assert.equal(result.status, 404, JSON.stringify(segments))
  }
  assert.equal(received.length, before)
  assert.equal(isSafeSegments(['leads', '3f2a-uuid', 'notes']), true)
})

test('solo acepta los métodos que usa el panel', async () => {
  for (const method of ['OPTIONS', 'TRACE', 'CONNECT', 'HEAD']) {
    const result = await proxyAdminRequest({ baseUrl }, { ...base, method, segments: ['session'] })
    assert.equal(result.status, 405, method)
  }
  for (const method of ['get', 'POST', 'put', 'PATCH', 'DELETE']) {
    const result = await proxyAdminRequest({ baseUrl }, { ...base, method, segments: ['session'] })
    assert.equal(result.status, 200, method)
  }
})

test('no sigue redirecciones de la API (no puede llevar la sesión a otro sitio)', async () => {
  const result = await proxyAdminRequest(
    { baseUrl },
    { ...base, method: 'GET', segments: ['redirect'] }
  )
  assert.equal(result.status, 302)
  assert.equal(received.filter(item => item.url.includes('otro-sitio')).length, 0)
})

test('sin API configurada, con la API caída o con tiempo agotado responde 503 controlado', async () => {
  const unconfigured = await proxyAdminRequest(
    { baseUrl: '' },
    { ...base, method: 'GET', segments: ['session'] }
  )
  assert.equal(unconfigured.status, 503)
  assert.match(JSON.parse(unconfigured.body).message, /no está conectado/)

  const down = await proxyAdminRequest(
    { baseUrl: 'http://127.0.0.1:1', timeoutMs: 300 },
    { ...base, method: 'GET', segments: ['session'] }
  )
  assert.equal(down.status, 503)
  assert.deepEqual(Object.keys(JSON.parse(down.body)).sort(), [
    'message',
    'statusCode',
    'statusMessage'
  ])

  const slow = await proxyAdminRequest(
    { baseUrl, timeoutMs: 100 },
    { ...base, method: 'GET', segments: ['slow'] }
  )
  assert.equal(slow.status, 503)
})

test('extrae la cookie de sesión de una cabecera con varias cookies', () => {
  assert.equal(extractSessionCookie('admin_session=abc'), 'abc')
  assert.equal(extractSessionCookie('a=1; admin_session=abc; b=2'), 'abc')
  assert.equal(extractSessionCookie('admin_session=abc=def'), 'abc=def')
  assert.equal(extractSessionCookie('fake_admin_session=abc'), undefined)
  assert.equal(extractSessionCookie('admin_session='), undefined)
  assert.equal(extractSessionCookie(undefined), undefined)
})

const BOUNDARY = '----formboundary7MA4YWxkTrZu0gW'
const MULTIPART = `multipart/form-data; boundary=${BOUNDARY}`

// Cuerpo multipart con un "archivo" que contiene los 256 valores de byte (lo que un decodificado
// como texto UTF-8 corrompería).
const CRLF = '\r\n'
const multipartBody = () => {
  const file = Buffer.from(Array.from({ length: 1024 }, (_, i) => i % 256))
  const head = [
    `--${BOUNDARY}`,
    'Content-Disposition: form-data; name="folder"',
    '',
    'about',
    `--${BOUNDARY}`,
    'Content-Disposition: form-data; name="file"; filename="a.png"',
    'Content-Type: image/png',
    '',
    ''
  ].join(CRLF)
  return {
    file,
    body: Buffer.concat([Buffer.from(head), file, Buffer.from(`${CRLF}--${BOUNDARY}--${CRLF}`)])
  }
}

test('multipart hacia media: reenvía los bytes intactos y la frontera original', async () => {
  const { file, body } = multipartBody()
  const result = await proxyAdminRequest(
    { baseUrl },
    { ...base, method: 'POST', segments: ['media'], body, contentType: MULTIPART }
  )
  assert.equal(result.status, 200)
  const last = received.at(-1)
  assert.equal(last.url, '/api/admin/media')
  assert.equal(last.headers['content-type'], MULTIPART)
  assert.ok(last.bytes.equals(body), 'el cuerpo debe llegar byte a byte')
  assert.ok(last.bytes.includes(file))
})

test('multipart solo se acepta por POST hacia media (sin hacer ninguna petición)', async () => {
  const before = received.length
  const { body } = multipartBody()
  for (const [method, segments] of [
    ['POST', ['leads']],
    ['POST', ['about', 'images']],
    ['PUT', ['media']],
    ['PATCH', ['media']]
  ]) {
    const result = await proxyAdminRequest(
      { baseUrl },
      { ...base, method, segments, body, contentType: MULTIPART }
    )
    assert.equal(result.status, 415, `${method} ${segments.join('/')}`)
  }
  assert.equal(received.length, before)
})

test('otros tipos de contenido no se reenvían: el cuerpo sigue siendo JSON', async () => {
  await proxyAdminRequest(
    { baseUrl },
    { ...base, method: 'POST', segments: ['leads'], body: '{"a":1}', contentType: 'text/plain' }
  )
  assert.equal(received.at(-1).headers['content-type'], 'application/json')
  for (const contentType of ['multipart/form-data', 'multipart/mixed; boundary=x', undefined]) {
    assert.equal(isMultipartType(contentType), false, String(contentType))
  }
  assert.equal(isMultipartType(MULTIPART), true)
  assert.equal(isMultipartType('multipart/form-data; boundary=a b'), false)
})

test('eliminar una imagen por clave viaja en la query y sin cuerpo', async () => {
  const key = 'about/0b6f1c2e-3d4a-4b5c-8d6e-7f8091a2b3c4.webp'
  const result = await proxyAdminRequest(
    { baseUrl },
    { ...base, method: 'DELETE', segments: ['media'], query: { key } }
  )
  assert.equal(result.status, 200)
  assert.equal(received.at(-1).method, 'DELETE')
  assert.equal(received.at(-1).url, `/api/admin/media?key=${encodeURIComponent(key)}`)
  assert.equal(received.at(-1).headers['content-type'], undefined)
})

test('analítica: /api/admin/analytics/clicks pasa por el proxy con el rango como consulta', async () => {
  const result = await proxyAdminRequest(
    { baseUrl },
    { ...base, method: 'GET', segments: ['analytics', 'clicks'], query: { range: '7d' } }
  )
  assert.equal(result.status, 200)
  assert.equal(received.at(-1).url, '/api/admin/analytics/clicks?range=7d')
  assert.equal(isSafeSegments(['analytics', 'clicks']), true)
})
