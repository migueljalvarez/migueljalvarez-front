import assert from 'node:assert/strict'
import test from 'node:test'
import { consentRecord, contactSchema } from '../server/utils/contactSchema.ts'

test('la constancia de autorización lleva la versión de la política y la fecha del envío', () => {
  const record = consentRecord('2026-01-15', new Date('2026-02-01T10:30:00Z'))
  assert.match(record, /Ley 1581/)
  assert.ok(record.includes('Política vigente: 2026-01-15.'))
  assert.ok(record.includes('Enviado: 2026-02-01T10:30:00.000Z.'))
})

const valid = {
  name: 'Ana Prueba',
  email: 'ana@prueba.test',
  subject: 'consulta',
  message: 'Necesito una web para mi negocio',
  consent: true
}

test('acepta un mensaje válido con consentimiento', () => {
  assert.equal(contactSchema.safeParse(valid).success, true)
})

test('sin consentimiento no se acepta (Ley 1581: autorización previa y expresa)', () => {
  for (const consent of [false, undefined, 'true', 1, null]) {
    const result = contactSchema.safeParse({ ...valid, consent })
    assert.equal(result.success, false, `consent=${String(consent)}`)
  }
  const { consent: _omitted, ...withoutConsent } = valid
  assert.equal(contactSchema.safeParse(withoutConsent).success, false)
})

test('recorta espacios y valida correo, asunto y longitudes', () => {
  const trimmed = contactSchema.parse({ ...valid, name: '  Ana  ', message: '  hola  ' })
  assert.equal(trimmed.name, 'Ana')
  assert.equal(trimmed.message, 'hola')

  for (const bad of [
    { email: 'no-es-correo' },
    { subject: 'otro-asunto' },
    { name: '' },
    { message: '' },
    { name: 'x'.repeat(101) },
    { message: 'x'.repeat(5001) }
  ]) {
    assert.equal(contactSchema.safeParse({ ...valid, ...bad }).success, false, JSON.stringify(bad))
  }
})

test('el honeypot es opcional y se conserva para detectar bots', () => {
  assert.equal(contactSchema.parse(valid).website, undefined)
  assert.equal(contactSchema.parse({ ...valid, website: 'http://spam' }).website, 'http://spam')
})

test('ignora campos que el navegador no debe decidir (p. ej. la versión de la política)', () => {
  const parsed = contactSchema.parse({ ...valid, consentPolicyVersion: 'manipulada' })
  assert.equal('consentPolicyVersion' in parsed, false)
})
