import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test, { after, before } from 'node:test'
import { createPublicApiClient } from '../server/utils/publicApiClient.ts'
import {
  INVALID_LINK_MESSAGE,
  TOO_MANY_MESSAGE,
  isValidTestimonialToken,
  openTestimonialForm,
  submitTestimonial
} from '../server/utils/testimonialPublic.ts'
import {
  emptyTestimonialForm,
  phaseFromStatus,
  testimonialSubmissionSchema,
  validateTestimonialForm
} from '../utils/testimonialSubmission.ts'

const TOKEN = 'A'.repeat(43)
const submission = (over = {}) => ({
  answer: 'Trabajar con Miguel fue muy fácil y claro.',
  consentPublish: true,
  ...over
})

const fakeClient = replies => {
  const calls = []
  const next = () => replies.shift() ?? { ok: false, status: 0, data: null }
  return {
    calls,
    getResult: async (path, headers) => {
      calls.push({ method: 'GET', path, headers })
      return next()
    },
    post: async (path, body, headers) => {
      calls.push({ method: 'POST', path, body, headers })
      return next()
    }
  }
}

test('el token debe tener 43 caracteres base64url', () => {
  assert.equal(isValidTestimonialToken(TOKEN), true)
  for (const bad of [
    '',
    'abc',
    `${TOKEN}A`,
    `${'A'.repeat(42)}/`,
    `../${'A'.repeat(40)}`,
    null,
    42
  ]) {
    assert.equal(isValidTestimonialToken(bad), false)
  }
})

test('abrir: un token mal formado da el 404 genérico sin llamar a la API', async () => {
  const client = fakeClient([])
  const result = await openTestimonialForm(client, '../admin/session', '1.2.3.4')
  assert.deepEqual(result, { ok: false, status: 404, message: INVALID_LINK_MESSAGE })
  assert.equal(client.calls.length, 0)
})

test('abrir: devuelve solo los datos mínimos y reenvía la IP real', async () => {
  const client = fakeClient([
    {
      ok: true,
      status: 200,
      data: {
        clientName: 'Ana',
        projectName: 'Tienda',
        message: 'Gracias',
        expiresAt: '2026-12-01T00:00:00.000Z',
        email: 'ana@correo.co',
        id: 'secreto',
        token: 'no'
      }
    }
  ])
  const result = await openTestimonialForm(client, TOKEN, '203.0.113.7')
  assert.deepEqual(result, {
    ok: true,
    data: {
      clientName: 'Ana',
      projectName: 'Tienda',
      message: 'Gracias',
      expiresAt: '2026-12-01T00:00:00.000Z'
    }
  })
  assert.equal(client.calls[0].path, `/api/testimonials/requests/${TOKEN}`)
  assert.equal(client.calls[0].headers['x-client-ip'], '203.0.113.7')
})

test('abrir: 404, 400 y 4xx comparten el mensaje genérico; 429 y caídas se distinguen', async () => {
  for (const status of [404, 400, 410, 403]) {
    const result = await openTestimonialForm(
      fakeClient([{ ok: false, status, data: { message: 'detalle interno' } }]),
      TOKEN,
      'ip'
    )
    assert.equal(result.ok, false)
    assert.equal(result.message, INVALID_LINK_MESSAGE)
    assert.equal(result.status, 404)
  }
  const limited = await openTestimonialForm(
    fakeClient([{ ok: false, status: 429, data: null }]),
    TOKEN,
    'ip'
  )
  assert.deepEqual(limited, { ok: false, status: 429, message: TOO_MANY_MESSAGE })

  for (const status of [0, 500, 502]) {
    const down = await openTestimonialForm(
      fakeClient([{ ok: false, status, data: null }]),
      TOKEN,
      'ip'
    )
    assert.equal(down.status, 503)
  }
})

test('enviar: reenvía el testimonio con la IP real y responde sin datos', async () => {
  const client = fakeClient([{ ok: true, status: 204, data: null }])
  const parsed = testimonialSubmissionSchema.parse(
    submission({ authorName: '', authorRole: ' CEO ' })
  )
  const result = await submitTestimonial(client, TOKEN, parsed, '203.0.113.7')
  assert.deepEqual(result, { ok: true, data: null })
  assert.equal(client.calls[0].path, `/api/testimonials/requests/${TOKEN}`)
  // `undefined` no viaja en el JSON: se compara lo que realmente se enviaría.
  assert.deepEqual(JSON.parse(JSON.stringify(client.calls[0].body)), {
    answer: 'Trabajar con Miguel fue muy fácil y claro.',
    authorRole: 'CEO',
    consentPublish: true
  })
  assert.equal(client.calls[0].headers['x-client-ip'], '203.0.113.7')
})

test('enviar: enlace usado o vencido y límite de intentos', async () => {
  const parsed = testimonialSubmissionSchema.parse(submission())
  const used = await submitTestimonial(
    fakeClient([{ ok: false, status: 404, data: null }]),
    TOKEN,
    parsed,
    'ip'
  )
  assert.deepEqual(used, { ok: false, status: 404, message: INVALID_LINK_MESSAGE })
  const limited = await submitTestimonial(
    fakeClient([{ ok: false, status: 429, data: null }]),
    TOKEN,
    parsed,
    'ip'
  )
  assert.equal(limited.status, 429)
  const bad = await submitTestimonial(fakeClient([]), 'corto', parsed, 'ip')
  assert.equal(bad.status, 404)
})

test('el esquema exige 10-3000 caracteres, texto plano y consentimiento explícito', () => {
  assert.equal(testimonialSubmissionSchema.safeParse(submission()).success, true)
  assert.equal(
    testimonialSubmissionSchema.safeParse(submission({ answer: 'corto' })).success,
    false
  )
  assert.equal(
    testimonialSubmissionSchema.safeParse(submission({ answer: 'x'.repeat(3001) })).success,
    false
  )
  assert.equal(
    testimonialSubmissionSchema.safeParse(submission({ answer: 'hola <b>mundo</b> ok' })).success,
    false
  )
  assert.equal(
    testimonialSubmissionSchema.safeParse(submission({ consentPublish: false })).success,
    false
  )
  assert.equal(
    testimonialSubmissionSchema.safeParse({ answer: submission().answer }).success,
    false
  )
  assert.equal(
    testimonialSubmissionSchema.safeParse(submission({ authorRole: 'x'.repeat(121) })).success,
    false
  )
  assert.equal(
    testimonialSubmissionSchema.safeParse(submission({ authorName: 'x'.repeat(101) })).success,
    false
  )
  // Los campos extra se descartan (nunca llegan a la API).
  assert.equal('isAdmin' in testimonialSubmissionSchema.parse(submission({ isAdmin: true })), false)
})

test('el formulario público valida y devuelve el primer error por campo', () => {
  const empty = validateTestimonialForm(emptyTestimonialForm())
  assert.equal(empty.ok, false)
  assert.ok(empty.errors.answer)
  assert.match(empty.errors.consentPublish, /autorizar/)

  const ok = validateTestimonialForm({
    ...emptyTestimonialForm(),
    answer: 'Un testimonio suficientemente largo.',
    consentPublish: true
  })
  assert.equal(ok.ok, true)
  assert.equal(ok.data.authorName, undefined)
})

test('la fase de la página sale del estado HTTP', () => {
  assert.equal(phaseFromStatus(404), 'invalid')
  assert.equal(phaseFromStatus(429), 'limited')
  assert.equal(phaseFromStatus(503), 'unavailable')
  assert.equal(phaseFromStatus(undefined), 'unavailable')
})

// --- Cliente HTTP real: getResult conserva el estado y las cabeceras por llamada -----------------

let server
let baseUrl
const received = []

before(async () => {
  server = createServer((request, response) => {
    received.push({ url: request.url, headers: request.headers })
    response.setHeader('content-type', 'application/json')
    response.statusCode = request.url === '/missing' ? 404 : 200
    response.end(JSON.stringify({ ok: request.url !== '/missing' }))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})
after(() => server.close())

test('getResult devuelve estado y datos, y envía las cabeceras de la llamada', async () => {
  const client = createPublicApiClient({ baseUrl, headers: { 'x-fijo': '1' } })
  const ok = await client.getResult('/found', { 'x-client-ip': '9.9.9.9' })
  assert.deepEqual([ok.ok, ok.status, ok.data], [true, 200, { ok: true }])
  assert.equal(received.at(-1).headers['x-client-ip'], '9.9.9.9')
  assert.equal(received.at(-1).headers['x-fijo'], '1')

  const missing = await client.getResult('/missing')
  assert.deepEqual([missing.ok, missing.status], [false, 404])

  const none = await createPublicApiClient({ baseUrl: '' }).getResult('/x')
  assert.deepEqual(none, { ok: false, status: 0, data: null })
})
