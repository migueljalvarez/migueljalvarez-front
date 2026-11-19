import assert from 'node:assert/strict'
import test from 'node:test'
import {
  NO_CONSENT_MESSAGE,
  buildListQuery,
  buildReviewPayload,
  canRenew,
  canReview,
  emptyRequestForm,
  expiryInfo,
  pageInfo,
  prefillFromClient,
  publicText,
  reviewFormFromRecord,
  testimonialStatusBadge,
  validateRequestForm
} from '../utils/admin/testimonials.ts'

const record = (over = {}) => ({
  id: 't1',
  clientId: null,
  clientName: 'Ana Pérez',
  email: 'ana@correo.co',
  projectName: 'Tienda',
  message: '',
  status: 'respondida',
  expiresAt: '2026-12-02T15:00:00.000Z',
  sentAt: '2026-11-18T15:00:00.000Z',
  openedAt: null,
  answeredAt: '2026-11-19T15:00:00.000Z',
  answer: 'Trabajar con Miguel fue muy fácil.',
  publishedText: null,
  authorRole: '',
  authorCompany: '',
  consentPublish: true,
  createdAt: '2026-11-18T15:00:00.000Z',
  updatedAt: '2026-11-19T15:00:00.000Z',
  ...over
})

test('el listado pide limit/offset y el estado solo si hay filtro', () => {
  assert.deepEqual(buildListQuery('all', 1), { limit: 20, offset: 0 })
  assert.deepEqual(buildListQuery('respondida', 3), { limit: 20, offset: 40, status: 'respondida' })
  assert.deepEqual(buildListQuery('all', 0), { limit: 20, offset: 0 })
})

test('pageInfo calcula el rango mostrado y los límites', () => {
  assert.deepEqual(pageInfo(0, 1), {
    page: 1,
    pages: 1,
    from: 0,
    to: 0,
    hasPrev: false,
    hasNext: false
  })
  const info = pageInfo(45, 3)
  assert.equal(info.from, 41)
  assert.equal(info.to, 45)
  assert.equal(info.hasNext, false)
  assert.equal(info.hasPrev, true)
  assert.equal(pageInfo(45, 99).page, 3)
})

test('cada estado tiene etiqueta de texto', () => {
  for (const status of ['enviada', 'abierta', 'respondida', 'aprobada', 'rechazada', 'expirada']) {
    assert.ok(testimonialStatusBadge(status).label.length > 2)
  }
  assert.equal(testimonialStatusBadge('respondida').label, 'Respondida')
})

test('renovar solo si no hay respuesta; revisar solo si la hay', () => {
  for (const status of ['enviada', 'abierta', 'expirada']) {
    assert.equal(canRenew({ status }), true)
    assert.equal(canReview({ status }), false)
  }
  for (const status of ['respondida', 'aprobada', 'rechazada']) {
    assert.equal(canRenew({ status }), false)
    assert.equal(canReview({ status }), true)
  }
})

test('expiryInfo deja claro cuándo el enlace venció y no aplica a las respondidas', () => {
  const now = new Date('2026-11-20T12:00:00.000Z')
  const pending = expiryInfo({ status: 'enviada', expiresAt: '2026-11-23T12:00:00.000Z' }, now)
  assert.equal(pending.expired, false)
  assert.match(pending.label, /^Vence el .* \(quedan 3 días\)$/)

  const lastDay = expiryInfo({ status: 'abierta', expiresAt: '2026-11-20T20:00:00.000Z' }, now)
  assert.match(lastDay.label, /vence hoy o mañana/)

  const expired = expiryInfo({ status: 'expirada', expiresAt: '2026-11-10T12:00:00.000Z' }, now)
  assert.equal(expired.expired, true)
  assert.match(expired.label, /^Expiró el /)

  // Una solicitud sin respuesta cuyo plazo pasó también se muestra como vencida.
  assert.equal(
    expiryInfo({ status: 'enviada', expiresAt: '2026-11-01T12:00:00.000Z' }, now).expired,
    true
  )
  assert.equal(
    expiryInfo({ status: 'respondida', expiresAt: '2026-11-01T12:00:00.000Z' }, now),
    null
  )
})

test('el formulario de solicitud exige nombre y correo, y limita la vigencia a 1-60 días', () => {
  assert.equal(emptyRequestForm().expiresInDays, '14')

  const empty = validateRequestForm(emptyRequestForm())
  assert.equal(empty.ok, false)
  assert.ok(empty.errors.clientName)
  assert.ok(empty.errors.email)

  const base = { ...emptyRequestForm(), clientName: 'Ana', email: 'ana@correo.co' }
  assert.equal(
    validateRequestForm({ ...base, email: 'no-es-correo' }).errors.email.length > 0,
    true
  )
  assert.ok(validateRequestForm({ ...base, expiresInDays: '0' }).errors.expiresInDays)
  assert.ok(validateRequestForm({ ...base, expiresInDays: '61' }).errors.expiresInDays)
  assert.ok(validateRequestForm({ ...base, expiresInDays: 'abc' }).errors.expiresInDays)
  assert.ok(validateRequestForm({ ...base, message: 'x'.repeat(1001) }).errors.message)
})

test('el cuerpo de la solicitud omite los opcionales vacíos y convierte los días a número', () => {
  const minimal = validateRequestForm({
    ...emptyRequestForm(),
    clientName: '  Ana  ',
    email: ' ana@correo.co '
  })
  assert.equal(minimal.ok, true)
  assert.deepEqual(minimal.data, {
    mode: 'create',
    clientName: 'Ana',
    email: 'ana@correo.co',
    expiresInDays: 14
  })

  const full = validateRequestForm({
    clientId: '0b6b2c3e-5a46-4c4e-9d44-1f1f3b2d9a10',
    clientName: 'Ana',
    email: 'ana@correo.co',
    projectName: 'Tienda',
    message: 'Gracias por todo',
    expiresInDays: '30'
  })
  assert.equal(full.data.expiresInDays, 30)
  assert.equal(full.data.clientId, '0b6b2c3e-5a46-4c4e-9d44-1f1f3b2d9a10')
  assert.equal(full.data.projectName, 'Tienda')
})

test('elegir un cliente precarga nombre y correo; quitarlo limpia', () => {
  assert.deepEqual(prefillFromClient({ id: 'c1', name: 'Tienda S.A.S.', email: 'a@b.co' }), {
    clientId: 'c1',
    clientName: 'Tienda S.A.S.',
    email: 'a@b.co'
  })
  assert.deepEqual(prefillFromClient(undefined), { clientId: '', clientName: '', email: '' })
})

test('aprobar exige consentimiento y texto; rechazar solo envía la decisión', () => {
  const values = reviewFormFromRecord(record())
  assert.equal(values.publishedText, 'Trabajar con Miguel fue muy fácil.')

  assert.deepEqual(buildReviewPayload('reject', values, record()), {
    ok: true,
    errors: {},
    data: { decision: 'reject' }
  })

  const noConsent = buildReviewPayload('approve', values, record({ consentPublish: false }))
  assert.equal(noConsent.ok, false)
  assert.equal(noConsent.errors._, NO_CONSENT_MESSAGE)
  // Rechazar siempre se puede, aun sin consentimiento.
  assert.equal(buildReviewPayload('reject', values, record({ consentPublish: false })).ok, true)

  assert.ok(
    buildReviewPayload('approve', { ...values, publishedText: '  ' }, record()).errors.publishedText
  )
  assert.ok(
    buildReviewPayload('approve', { ...values, publishedText: 'a <b> c' }, record()).errors
      .publishedText
  )
  assert.ok(
    buildReviewPayload('approve', { ...values, authorRole: 'x'.repeat(121) }, record()).errors
      .authorRole
  )
  assert.ok(
    buildReviewPayload('approve', { ...values, publishedText: 'x'.repeat(3001) }, record()).errors
      .publishedText
  )
})

test('al aprobar sin editar se envía vacío (publicar el original); editado, el texto nuevo', () => {
  const original = record()
  const same = buildReviewPayload(
    'approve',
    { ...reviewFormFromRecord(original), authorRole: ' Gerente ', authorCompany: 'Tienda' },
    original
  )
  assert.deepEqual(same.data, {
    decision: 'approve',
    publishedText: '',
    authorRole: 'Gerente',
    authorCompany: 'Tienda'
  })

  const edited = buildReviewPayload(
    'approve',
    { ...reviewFormFromRecord(original), publishedText: 'Trabajar con Miguel fue fácil.' },
    original
  )
  assert.equal(edited.data.publishedText, 'Trabajar con Miguel fue fácil.')
})

test('el formulario de revisión parte del texto editado si existe', () => {
  const edited = record({ status: 'aprobada', publishedText: 'Versión editada', authorRole: 'CEO' })
  const values = reviewFormFromRecord(edited)
  assert.equal(values.publishedText, 'Versión editada')
  assert.equal(values.authorRole, 'CEO')
  assert.equal(publicText(edited), 'Versión editada')
  assert.equal(publicText(record()), 'Trabajar con Miguel fue muy fácil.')
})
