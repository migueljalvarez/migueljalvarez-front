import assert from 'node:assert/strict'
import test from 'node:test'
import { AdminApiError, toAdminApiError } from '../utils/adminApiError.ts'

const fetchError = (statusCode, message) => ({ statusCode, data: { message } })

test('en validaciones y conflictos muestra el mensaje específico de la API', () => {
  for (const status of [400, 409, 422]) {
    const error = toAdminApiError(fetchError(status, 'El deadline no puede ser anterior al inicio'))
    assert.equal(error.message, 'El deadline no puede ser anterior al inicio')
    assert.equal(error.status, status)
  }
})

test('une los mensajes de validación cuando la API devuelve varios', () => {
  const error = toAdminApiError(fetchError(400, ['Correo no válido', 'Nombre requerido']))
  assert.equal(error.message, 'Correo no válido · Nombre requerido')
})

test('un 400 sin mensaje usa el texto genérico en lugar de quedar vacío', () => {
  assert.equal(
    toAdminApiError({ statusCode: 400, data: null }).message,
    'Algo salió mal. Inténtalo de nuevo.'
  )
})

test('mensajes genéricos y comprensibles por estado', () => {
  assert.match(toAdminApiError({ statusCode: 401 }).message, /sesión terminó/)
  assert.match(toAdminApiError({ statusCode: 403 }).message, /permiso/)
  assert.match(toAdminApiError({ statusCode: 404 }).message, /No encontramos/)
  assert.match(toAdminApiError({ statusCode: 429 }).message, /Demasiados intentos/)
  assert.match(toAdminApiError({ statusCode: 503 }).message, /no puede conectarse/)
})

test('un 5xx nunca muestra detalles internos de la API', () => {
  const error = toAdminApiError(fetchError(500, 'password authentication failed for user "dev"'))
  assert.equal(error.message, 'Algo salió mal. Inténtalo de nuevo.')
  assert.doesNotMatch(error.message, /password/)
})

test('sin respuesta (red caída) se trata como servicio no disponible', () => {
  const error = toAdminApiError(new Error('fetch failed'))
  assert.equal(error.status, 0)
  assert.match(error.message, /no puede conectarse/)
})

test('acepta el estado en `status` además de `statusCode` y conserva un AdminApiError', () => {
  assert.equal(toAdminApiError({ status: 404 }).status, 404)
  const original = new AdminApiError(409, 'Ya existe')
  assert.equal(toAdminApiError(original), original)
})
