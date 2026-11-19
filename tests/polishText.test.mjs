import assert from 'node:assert/strict'
import test from 'node:test'
import { cityWithCountry } from '../utils/legalHolder.ts'
import { withFinalPeriod } from '../utils/text.ts'

test('cityWithCountry añade el país una sola vez', () => {
  assert.equal(cityWithCountry('Medellín'), 'Medellín, Colombia')
  assert.equal(cityWithCountry('Medellín, Colombia'), 'Medellín, Colombia')
  assert.equal(cityWithCountry(' Bogotá, colombia '), 'Bogotá, colombia')
})

test('withFinalPeriod cierra el texto sin duplicar signos', () => {
  assert.equal(withFinalPeriod('Aplicación financiera'), 'Aplicación financiera.')
  assert.equal(withFinalPeriod('Ya termina bien.'), 'Ya termina bien.')
  assert.equal(withFinalPeriod('¿Y esto?'), '¿Y esto?')
  assert.equal(withFinalPeriod('  '), '')
  assert.equal(withFinalPeriod(undefined), '')
})
