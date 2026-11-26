import assert from 'node:assert/strict'
import test from 'node:test'
import {
  includesFromText,
  nextOfferOrder,
  offerFormDefaults,
  offerFormSchema,
  slugifyOfferTitle
} from '../utils/admin/serviceOffers.ts'

const values = (overrides = {}) => ({
  title: 'Revisión de código',
  slug: 'code-review',
  summary: 'Informe de hallazgos',
  includes: 'Un repositorio\nInforme priorizado',
  duration: '',
  priceFromUsd: '250',
  launchPriceFromUsd: '',
  launchEnabled: false,
  launchNote: '',
  sortOrder: '20',
  isPublished: false,
  ...overrides
})
const errorKeys = result => (result.success ? [] : result.error.issues.map(issue => String(issue.path[0])))

test('slugifyOfferTitle quita tildes y símbolos y respeta el máximo', () => {
  assert.equal(slugifyOfferTitle('Diagnóstico «¿Rehacer o mejorar?»'), 'diagnostico-rehacer-o-mejorar')
  assert.equal(slugifyOfferTitle('  Sesión  de consultoría '), 'sesion-de-consultoria')
  assert.ok(slugifyOfferTitle('a'.repeat(100)).length <= 60)
})

test('includesFromText separa por líneas y descarta las vacías', () => {
  assert.deepEqual(includesFromText(' uno \r\n\n dos\n   \n'), ['uno', 'dos'])
  assert.deepEqual(includesFromText(''), [])
})

test('el formulario válido sale con números, arreglo y null', () => {
  const parsed = offerFormSchema.parse(values())
  assert.equal(parsed.priceFromUsd, 250)
  assert.equal(parsed.launchPriceFromUsd, null)
  assert.equal(parsed.sortOrder, 20)
  assert.deepEqual(parsed.includes, ['Un repositorio', 'Informe priorizado'])
  assert.equal(parsed.isPublished, false)
})

test('el precio debe ser un entero positivo de dólares', () => {
  for (const bad of ['', '0', '12,5', '1.200', '-3', 'USD 5', '99999999']) {
    assert.ok(errorKeys(offerFormSchema.safeParse(values({ priceFromUsd: bad }))).includes('priceFromUsd'), bad)
  }
  assert.ok(offerFormSchema.safeParse(values({ priceFromUsd: '1000000' })).success)
  assert.ok(!offerFormSchema.safeParse(values({ priceFromUsd: '1000001' })).success)
})

test('el precio de lanzamiento debe ser menor que el normal', () => {
  const ok = offerFormSchema.parse(values({ launchPriceFromUsd: '160' }))
  assert.equal(ok.launchPriceFromUsd, 160)
  for (const bad of ['250', '300']) {
    const result = offerFormSchema.safeParse(values({ launchPriceFromUsd: bad }))
    assert.deepEqual(errorKeys(result), ['launchPriceFromUsd'], bad)
  }
})

test('activar el lanzamiento exige su precio', () => {
  const result = offerFormSchema.safeParse(values({ launchEnabled: true }))
  assert.deepEqual(errorKeys(result), ['launchPriceFromUsd'])
  assert.ok(offerFormSchema.safeParse(values({ launchEnabled: true, launchPriceFromUsd: '160' })).success)
})

test('valida la dirección, los límites de texto y las líneas de «qué incluye»', () => {
  assert.ok(errorKeys(offerFormSchema.safeParse(values({ slug: 'Mala Dirección' }))).includes('slug'))
  assert.ok(errorKeys(offerFormSchema.safeParse(values({ title: '' }))).includes('title'))
  assert.ok(errorKeys(offerFormSchema.safeParse(values({ summary: 'x'.repeat(301) }))).includes('summary'))
  assert.ok(errorKeys(offerFormSchema.safeParse(values({ launchNote: 'x'.repeat(81) }))).includes('launchNote'))
  const nine = Array.from({ length: 9 }, (_, i) => `Punto ${i}`).join('\n')
  assert.ok(errorKeys(offerFormSchema.safeParse(values({ includes: nine }))).includes('includes'))
  assert.ok(errorKeys(offerFormSchema.safeParse(values({ includes: 'x'.repeat(161) }))).includes('includes'))
  assert.ok(offerFormSchema.safeParse(values({ includes: '' })).success)
})

test('el orden es un entero de 0 a 9999 y el siguiente va de 10 en 10', () => {
  assert.ok(errorKeys(offerFormSchema.safeParse(values({ sortOrder: '-1' }))).includes('sortOrder'))
  assert.ok(errorKeys(offerFormSchema.safeParse(values({ sortOrder: '12345' }))).includes('sortOrder'))
  assert.equal(nextOfferOrder([]), 0)
  assert.equal(nextOfferOrder([{ sortOrder: 0 }, { sortOrder: 30 }]), 40)
  assert.equal(nextOfferOrder([{ sortOrder: 9995 }]), 9999)
})

test('offerFormDefaults prepara el formulario para crear y para editar', () => {
  const blank = offerFormDefaults(null, 40)
  assert.equal(blank.sortOrder, '40')
  assert.equal(blank.isPublished, false)
  assert.equal(blank.launchPriceFromUsd, '')
  const record = {
    id: '1',
    slug: 'code-review',
    title: 'Revisión',
    summary: 'x',
    includes: ['uno', 'dos'],
    duration: '7 días',
    priceFromUsd: 250,
    launchPriceFromUsd: 160,
    launchEnabled: true,
    launchNote: 'Primeros 3',
    sortOrder: 20,
    isPublished: true,
    createdAt: '',
    updatedAt: ''
  }
  const edit = offerFormDefaults(record, 99)
  assert.equal(edit.includes, 'uno\ndos')
  assert.equal(edit.priceFromUsd, '250')
  assert.equal(edit.launchPriceFromUsd, '160')
  assert.equal(edit.sortOrder, '20')
  assert.ok(offerFormSchema.safeParse(edit).success)
})
