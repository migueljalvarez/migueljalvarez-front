import assert from 'node:assert/strict'
import test from 'node:test'
import {
  EMPTY_LEGAL_HOLDER,
  isLegalHolderComplete,
  legalHolderSentence,
  legalIdText,
  normalizeLegalHolder
} from '../utils/legalHolder.ts'

// Datos ficticios solo para la prueba.
const full = {
  name: 'Titular De Prueba',
  idType: 'CC',
  idNumber: '0000000000',
  email: 'titular@example.com',
  city: 'Ciudad Prueba'
}

test('sin datos: vacío, incompleto y sin frase', () => {
  const holder = normalizeLegalHolder(undefined)
  assert.deepEqual(holder, EMPTY_LEGAL_HOLDER)
  assert.equal(isLegalHolderComplete(holder), false)
  assert.equal(legalHolderSentence(holder), '')
  assert.equal(legalIdText(holder), '')
})

test('completo: frase con C.C. y correo/ciudad disponibles', () => {
  const holder = normalizeLegalHolder(full)
  assert.equal(isLegalHolderComplete(holder), true)
  assert.equal(
    legalHolderSentence(holder),
    'Este sitio web es operado por Titular De Prueba, identificado con C.C. 0000000000.'
  )
})

test('NIT se escribe como NIT', () => {
  const holder = normalizeLegalHolder({ ...full, idType: 'nit', idNumber: '900000000-0' })
  assert.equal(legalIdText(holder), 'NIT 900000000-0')
})

test('acepta "C.C." y recorta espacios', () => {
  const holder = normalizeLegalHolder({ ...full, idType: ' c.c. ', name: '  Titular De Prueba ' })
  assert.equal(holder.idType, 'CC')
  assert.equal(holder.name, 'Titular De Prueba')
})

test('tipo de documento inválido se descarta y no se imprime el documento', () => {
  const holder = normalizeLegalHolder({ ...full, idType: 'PASAPORTE' })
  assert.equal(holder.idType, '')
  assert.equal(isLegalHolderComplete(holder), false)
  assert.equal(legalHolderSentence(holder), 'Este sitio web es operado por Titular De Prueba.')
})

test('solo nombre: frase sin documento; sin nombre: nada, aunque haya documento', () => {
  assert.equal(
    legalHolderSentence(normalizeLegalHolder({ name: 'Titular De Prueba' })),
    'Este sitio web es operado por Titular De Prueba.'
  )
  assert.equal(legalHolderSentence(normalizeLegalHolder({ idType: 'CC', idNumber: '1' })), '')
})

test('nunca imprime undefined, null ni marcadores', () => {
  for (const raw of [null, {}, { name: null, idType: 5, idNumber: undefined }, full]) {
    const holder = normalizeLegalHolder(raw)
    const text = legalHolderSentence(holder) + legalIdText(holder)
    assert.doesNotMatch(text, /undefined|null|\[|\]/)
  }
})
