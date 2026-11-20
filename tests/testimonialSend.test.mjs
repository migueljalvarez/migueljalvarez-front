import assert from 'node:assert/strict'
import test from 'node:test'
import { createRateLimiter } from '../server/utils/rateLimit.ts'
import {
  buildTestimonialEmail,
  buildTestimonialLink,
  decideSendResult,
  escapeHtml
} from '../server/utils/testimonialMail.ts'
import { isAllowedOrigin } from '../server/utils/testimonialOrigin.ts'
import { runTestimonialSend, sendRequestSchema } from '../server/utils/testimonialSend.ts'

const TOKEN = 'Zy9_-'.repeat(8) + 'abc' // 43 caracteres
assert.equal(TOKEN.length, 43)
const BASE = 'https://migueljalvarez.com'
const ID = '0b6b2c3e-5a46-4c4e-9d44-1f1f3b2d9a10'

const apiRecord = (over = {}) => ({
  id: ID,
  clientName: 'Ana <Pérez>',
  email: 'ana@correo.co',
  projectName: 'Tienda "Sol"',
  message: 'Gracias\npor todo',
  status: 'enviada',
  expiresAt: '2026-12-02T15:00:00.000Z',
  token: TOKEN,
  ...over
})

/** API falsa: responde según el método y la ruta; registra las llamadas. */
const makeDeps = (routes, over = {}) => {
  const calls = []
  const mails = []
  return {
    calls,
    mails,
    deps: {
      baseUrl: BASE,
      isLimited: () => false,
      call: async (method, segments, body) => {
        calls.push({ method, path: segments.join('/'), body })
        const reply = routes[`${method} ${segments.join('/')}`] ?? routes[`${method} *`]
        return reply ?? { status: 503, data: null }
      },
      sendMail: async (to, email) => {
        mails.push({ to, email })
        return 'sent'
      },
      ...over
    }
  }
}

const SESSION_OK = { 'GET session': { status: 200, data: { email: 'admin@x.co' } } }
const create = { mode: 'create', clientName: 'Ana', email: 'ana@correo.co' }

test('el enlace sale de la URL pública configurada y exige un token válido', () => {
  assert.equal(buildTestimonialLink(BASE, TOKEN), `${BASE}/testimonio/${TOKEN}`)
  assert.equal(buildTestimonialLink(`${BASE}///`, TOKEN), `${BASE}/testimonio/${TOKEN}`)
  assert.equal(buildTestimonialLink('', TOKEN), null)
  assert.equal(buildTestimonialLink('javascript:alert(1)', TOKEN), null)
  assert.equal(buildTestimonialLink(BASE, 'corto'), null)
  assert.equal(buildTestimonialLink(BASE, `${'A'.repeat(42)}/`), null)
})

test('el correo escapa el HTML, trae texto plano y no lleva pixeles de seguimiento', () => {
  const link = `${BASE}/testimonio/${TOKEN}`
  const email = buildTestimonialEmail({
    clientName: 'Ana <script>x</script> Pérez',
    projectName: 'Tienda "Sol"',
    message: 'Hola <b>Ana</b>\ngracias',
    link,
    expiresAt: '2026-12-02T15:00:00.000Z'
  })
  assert.equal(email.html.includes('<script>'), false)
  assert.equal(email.html.includes('<b>Ana</b>'), false)
  assert.match(email.html, /&lt;b&gt;Ana&lt;\/b&gt;<br>gracias/)
  assert.match(email.html, /Tienda &quot;Sol&quot;/)
  // La única imagen es el logo del propio sitio: sin el token ni parámetros de seguimiento.
  const images = [...email.html.matchAll(/<img[^>]*src="([^"]+)"/gi)].map(m => m[1])
  assert.deepEqual(images, [`${BASE}/email-logo.png`])
  assert.equal(email.html.includes(`${TOKEN}.png`), false)
  assert.ok(email.html.includes(`href="${link}"`))
  assert.ok(email.text.includes(link))
  assert.match(email.text, /Tienda "Sol"/)
  assert.match(email.text, /2 de diciembre de 2026/)
  assert.match(email.text, /Un abrazo,\nMiguel$/)
})

test('el asunto va en una sola línea aunque el nombre traiga saltos', () => {
  const email = buildTestimonialEmail({
    clientName: 'Ana\r\nBcc: otro@x.co',
    link: `${BASE}/testimonio/${TOKEN}`,
    expiresAt: ''
  })
  assert.equal(/[\r\n]/.test(email.subject), false)
  assert.match(email.subject, /^Ana, /)
  // Sin proyecto ni fecha el correo sigue siendo coherente.
  assert.equal(email.text.includes('undefined'), false)
})

test('escapeHtml cubre los cinco caracteres peligrosos', () => {
  assert.equal(
    escapeHtml(`<a href="x">'&'</a>`),
    '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;'
  )
})

test('el resultado nunca lleva el token en la solicitud y solo da el enlace si el correo no salió', () => {
  const link = `${BASE}/testimonio/${TOKEN}`
  const sent = decideSendResult({
    request: apiRecord(),
    link,
    mail: 'sent',
    email: 'ana@correo.co'
  })
  assert.equal('token' in sent.request, false)
  assert.equal('link' in sent, false)
  assert.equal(JSON.stringify(sent).includes(TOKEN), false)

  for (const mail of ['failed', 'not-configured']) {
    const result = decideSendResult({ request: apiRecord(), link, mail, email: 'ana@correo.co' })
    assert.equal('token' in result.request, false)
    assert.equal(result.link, link)
    assert.ok(result.notice.length > 20)
  }
})

test('crear: sesión válida, token de la API, correo enviado y respuesta sin token', async () => {
  const { deps, calls, mails } = makeDeps({
    ...SESSION_OK,
    'POST testimonials': { status: 201, data: apiRecord() }
  })
  const result = await runTestimonialSend(deps, sendRequestSchema.parse(create))
  assert.equal(result.ok, true)
  assert.equal(result.body.mail, 'sent')
  assert.equal(JSON.stringify(result.body).includes(TOKEN), false)
  assert.deepEqual(
    calls.map(call => `${call.method} ${call.path}`),
    ['GET session', 'POST testimonials']
  )
  assert.equal(calls[1].body.mode, undefined)
  assert.equal(mails[0].to, 'ana@correo.co')
  assert.ok(mails[0].email.text.includes(`${BASE}/testimonio/${TOKEN}`))
})

test('sin sesión no se crea nada ni se envía correo', async () => {
  for (const status of [401, 403]) {
    const { deps, calls, mails } = makeDeps({ 'GET session': { status, data: null } })
    const result = await runTestimonialSend(deps, sendRequestSchema.parse(create))
    assert.deepEqual([result.ok, result.status], [false, 401])
    assert.equal(calls.length, 1)
    assert.equal(mails.length, 0)
  }
  const down = makeDeps({})
  assert.equal((await runTestimonialSend(down.deps, sendRequestSchema.parse(create))).status, 503)
})

test('el límite de envíos se aplica después de validar la sesión', async () => {
  const unauth = makeDeps(
    { 'GET session': { status: 401, data: null } },
    { isLimited: () => assert.fail('no debe contar') }
  )
  await runTestimonialSend(unauth.deps, sendRequestSchema.parse(create))

  const limited = makeDeps({ ...SESSION_OK }, { isLimited: () => true })
  const result = await runTestimonialSend(limited.deps, sendRequestSchema.parse(create))
  assert.deepEqual([result.ok, result.status], [false, 429])
  assert.equal(limited.calls.length, 1)
})

test('si el correo falla o lanza, se devuelve el enlace una vez y no se pierde el token', async () => {
  for (const sendMail of [
    async () => 'failed',
    async () => {
      throw new Error('boom')
    },
    async () => 'not-configured'
  ]) {
    const { deps } = makeDeps(
      { ...SESSION_OK, 'POST testimonials': { status: 201, data: apiRecord() } },
      { sendMail }
    )
    const result = await runTestimonialSend(deps, sendRequestSchema.parse(create))
    assert.equal(result.ok, true)
    assert.equal(result.body.link, `${BASE}/testimonio/${TOKEN}`)
    assert.equal('token' in result.body.request, false)
  }
})

test('sin URL pública válida falla antes de generar el token', async () => {
  const { deps, calls } = makeDeps({ ...SESSION_OK }, { baseUrl: '' })
  const result = await runTestimonialSend(deps, sendRequestSchema.parse(create))
  assert.deepEqual([result.ok, result.status], [false, 500])
  assert.equal(calls.length, 0)
})

test('los errores de la API se traducen (400, 409 y caída)', async () => {
  const cases = [
    [{ status: 400, data: { message: ['email inválido', 'otro'] } }, 400, 'email inválido · otro'],
    [{ status: 409, data: { message: 'El cliente no existe' } }, 409, 'El cliente no existe'],
    [{ status: 500, data: null }, 503, undefined]
  ]
  for (const [reply, status, message] of cases) {
    const { deps, mails } = makeDeps({ ...SESSION_OK, 'POST testimonials': reply })
    const result = await runTestimonialSend(deps, sendRequestSchema.parse(create))
    assert.deepEqual([result.ok, result.status], [false, status])
    if (message) assert.equal(result.message, message)
    assert.equal(mails.length, 0)
  }
})

test('renovar: lee la solicitud, renueva y reenvía; 409 si ya fue respondida', async () => {
  const { deps, calls, mails } = makeDeps({
    ...SESSION_OK,
    [`GET testimonials/${ID}`]: { status: 200, data: apiRecord() },
    [`POST testimonials/${ID}/renew`]: { status: 200, data: apiRecord({ status: 'enviada' }) }
  })
  const result = await runTestimonialSend(
    deps,
    sendRequestSchema.parse({ mode: 'renew', id: ID, expiresInDays: 7 })
  )
  assert.equal(result.ok, true)
  assert.deepEqual(calls.at(-1).body, { expiresInDays: 7 })
  assert.equal(mails.length, 1)
  assert.equal(JSON.stringify(result.body).includes(TOKEN), false)

  const answered = makeDeps({
    ...SESSION_OK,
    [`GET testimonials/${ID}`]: { status: 200, data: apiRecord() },
    [`POST testimonials/${ID}/renew`]: { status: 409, data: { message: 'Ya fue respondida' } }
  })
  const conflict = await runTestimonialSend(answered.deps, { mode: 'renew', id: ID })
  assert.deepEqual(
    [conflict.ok, conflict.status, conflict.message],
    [false, 409, 'Ya fue respondida']
  )
  assert.equal(answered.mails.length, 0)

  const gone = makeDeps({ ...SESSION_OK, [`GET testimonials/${ID}`]: { status: 404, data: null } })
  assert.equal((await runTestimonialSend(gone.deps, { mode: 'renew', id: ID })).status, 404)
})

test('el esquema de envío valida el modo, los ids y la vigencia', () => {
  assert.equal(sendRequestSchema.safeParse(create).success, true)
  assert.equal(sendRequestSchema.safeParse({ mode: 'renew', id: 'no-uuid' }).success, false)
  assert.equal(sendRequestSchema.safeParse({ ...create, email: 'x' }).success, false)
  assert.equal(sendRequestSchema.safeParse({ ...create, expiresInDays: 61 }).success, false)
  assert.equal(sendRequestSchema.safeParse({ ...create, clientId: 'x' }).success, false)
  assert.equal(sendRequestSchema.safeParse({ clientName: 'Ana', email: 'a@b.co' }).success, false)
  const parsed = sendRequestSchema.parse({ ...create, projectName: '', message: '' })
  assert.equal(parsed.projectName, undefined)
  assert.equal(parsed.message, undefined)
})

test('el límite en memoria bloquea al pasar el máximo y se libera con la ventana', () => {
  const limiter = createRateLimiter({ max: 2, windowMs: 1000 })
  assert.equal(limiter.isLimited('a', 0), false)
  assert.equal(limiter.isLimited('a', 10), false)
  assert.equal(limiter.isLimited('a', 20), true)
  assert.equal(limiter.isLimited('b', 20), false)
  assert.equal(limiter.isLimited('a', 1500), false)
})

test('Origin: ausente o del propio sitio sí; otro sitio no', () => {
  const allowed = ['http://localhost:3333', `${BASE}/`]
  assert.equal(isAllowedOrigin(undefined, allowed), true)
  assert.equal(isAllowedOrigin('http://localhost:3333', allowed), true)
  assert.equal(isAllowedOrigin(BASE, allowed), true)
  assert.equal(isAllowedOrigin('https://malo.example', allowed), false)
  assert.equal(isAllowedOrigin('null', allowed), false)
})
