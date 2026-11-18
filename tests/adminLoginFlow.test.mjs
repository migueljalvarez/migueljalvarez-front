import assert from 'node:assert/strict'
import test from 'node:test'
import {
  PENDING_SESSION_MS,
  isPendingExpired,
  loginErrorMessage,
  normalizeRecoveryInput,
  normalizeTotpInput,
  validateCredentials,
  validateSecondFactor
} from '../utils/admin/loginFlow.ts'

test('el código TOTP solo conserva dígitos y se corta en 6', () => {
  assert.equal(normalizeTotpInput('12a3 45-6789'), '123456')
  assert.equal(normalizeTotpInput(''), '')
})

test('el código de recuperación se formatea XXXXX-XXXXX en mayúsculas', () => {
  assert.equal(normalizeRecoveryInput('abcde'), 'ABCDE')
  assert.equal(normalizeRecoveryInput('abcde1'), 'ABCDE-1')
  assert.equal(normalizeRecoveryInput('abcde-12345'), 'ABCDE-12345')
  assert.equal(normalizeRecoveryInput('abcde-123456789'), 'ABCDE-12345')
  assert.equal(normalizeRecoveryInput('zz ab-cde'), 'ABCDE')
  assert.equal(normalizeRecoveryInput('ABCDE-'), 'ABCDE')
})

test('valida el formato de cada tipo de código con el mismo criterio de la API', () => {
  assert.equal(validateSecondFactor('totp', '123456'), '')
  assert.notEqual(validateSecondFactor('totp', '12345'), '')
  assert.notEqual(validateSecondFactor('totp', ''), '')
  assert.equal(validateSecondFactor('recovery', 'ABCDE-12345'), '')
  assert.notEqual(validateSecondFactor('recovery', 'ABCDE-1234'), '')
  assert.notEqual(validateSecondFactor('recovery', ''), '')
})

test('exige correo válido y contraseña antes de llamar a la API', () => {
  assert.deepEqual(validateCredentials('a@b.co', 'x'), {})
  assert.ok(validateCredentials('', 'x').email)
  assert.ok(validateCredentials('no-es-correo', 'x').email)
  assert.ok(validateCredentials('a@b.co', '').password)
})

test('la sesión pendiente vence a los 5 minutos', () => {
  const start = 1_000_000
  assert.equal(isPendingExpired(start, start + PENDING_SESSION_MS - 1), false)
  assert.equal(isPendingExpired(start, start + PENDING_SESSION_MS), true)
})

test('los mensajes distinguen credenciales, código, límite y API desconectada', () => {
  assert.match(loginErrorMessage({ step: 'password', status: 401 }), /correo o la contraseña/)
  assert.match(loginErrorMessage({ step: 'code', status: 401 }), /código no es correcto/)
  assert.match(loginErrorMessage({ step: 'code', status: 401, expired: true }), /5 minutos/)
  assert.match(loginErrorMessage({ step: 'password', status: 429 }), /Demasiados intentos/)
  for (const status of [0, 502, 503, 504]) {
    assert.match(loginErrorMessage({ step: 'password', status }), /no está conectado a la API/)
  }
  assert.match(loginErrorMessage({ step: 'code', status: 500 }), /No pudimos iniciar sesión/)
})
