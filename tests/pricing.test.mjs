import assert from 'node:assert/strict'
import test from 'node:test'
import { describeOfferPrice, formatUsd } from '../utils/pricing.ts'
import { mapApiServiceOffers } from '../utils/publicContent.ts'
import { PRICING_FALLBACK_OFFERS, PRICING_TERMS } from '../data/pricing.ts'

const apiOffer = (overrides = {}) => ({
  slug: 'code-review',
  title: 'Revisión de código',
  summary: 'Informe de hallazgos',
  includes: ['Un repositorio'],
  duration: 'Entrega en 7 días hábiles',
  priceFromUsd: 250,
  ...overrides
})

test('formatUsd usa dólares enteros con separador de miles', () => {
  assert.equal(formatUsd(90), 'USD 90')
  assert.equal(formatUsd(250), 'USD 250')
  assert.equal(formatUsd(1200), 'USD 1.200')
  assert.equal(formatUsd(1234567), 'USD 1.234.567')
})

test('describeOfferPrice: sin precio, solo normal o con lanzamiento', () => {
  assert.deepEqual(describeOfferPrice({}), { label: 'Precio según el alcance' })
  assert.deepEqual(describeOfferPrice({ priceFromUsd: 250 }), {
    regular: 'USD 250',
    label: 'Desde USD 250'
  })
  const launch = describeOfferPrice({
    priceFromUsd: 250,
    launchPriceFromUsd: 160,
    launchNote: 'Primeros 3 clientes'
  })
  assert.equal(launch.regular, 'USD 250')
  assert.equal(launch.launch, 'USD 160')
  assert.match(launch.label, /lanzamiento desde USD 160 \(Primeros 3 clientes\); precio normal desde USD 250/)
})

test('describeOfferPrice ignora un lanzamiento que no sea menor que el normal', () => {
  const same = describeOfferPrice({ priceFromUsd: 100, launchPriceFromUsd: 100 })
  assert.equal(same.launch, undefined)
  assert.equal(same.label, 'Desde USD 100')
})

test('mapApiServiceOffers convierte la respuesta de la API', () => {
  const [offer] = mapApiServiceOffers([apiOffer({ launchPriceFromUsd: 160, launchNote: 'Primeros 3' })])
  assert.equal(offer.id, 'code-review')
  assert.equal(offer.priceFromUsd, 250)
  assert.equal(offer.launchPriceFromUsd, 160)
  assert.equal(offer.launchNote, 'Primeros 3')
  assert.deepEqual(offer.includes, ['Un repositorio'])
})

test('mapApiServiceOffers omite la nota y el lanzamiento si no hay precio de lanzamiento', () => {
  const [offer] = mapApiServiceOffers([apiOffer({ launchNote: 'Huérfana' })])
  assert.equal(offer.launchPriceFromUsd, undefined)
  assert.equal(offer.launchNote, undefined)
})

test('mapApiServiceOffers descarta un lanzamiento mayor o igual al normal', () => {
  const [offer] = mapApiServiceOffers([apiOffer({ launchPriceFromUsd: 250, launchNote: 'x' })])
  assert.equal(offer.launchPriceFromUsd, undefined)
  assert.equal(offer.launchNote, undefined)
})

test('mapApiServiceOffers descarta elementos inválidos y respuestas que no son una lista', () => {
  const offers = mapApiServiceOffers([
    apiOffer(),
    null,
    { slug: 'sin-precio', title: 'x', summary: 'y' },
    apiOffer({ slug: 'precio-malo', priceFromUsd: -5 }),
    apiOffer({ slug: 'decimal', priceFromUsd: 10.5 }),
    apiOffer({ slug: 'sin-titulo', title: undefined })
  ])
  assert.deepEqual(
    offers.map(offer => offer.slug),
    ['code-review']
  )
  assert.deepEqual(mapApiServiceOffers(null), [])
  assert.deepEqual(mapApiServiceOffers({ error: true }), [])
})

test('el respaldo del código trae las ofertas SIN precio y sin lanzamiento', () => {
  assert.ok(PRICING_FALLBACK_OFFERS.length >= 4)
  for (const offer of PRICING_FALLBACK_OFFERS) {
    assert.equal(offer.priceFromUsd, undefined, offer.slug)
    assert.equal(offer.launchPriceFromUsd, undefined, offer.slug)
    assert.ok(offer.title && offer.summary && offer.includes.length > 0, offer.slug)
  }
  assert.equal(new Set(PRICING_FALLBACK_OFFERS.map(offer => offer.slug)).size, PRICING_FALLBACK_OFFERS.length)
})

test('las condiciones de cobro no llevan montos en el código', () => {
  assert.ok(PRICING_TERMS.length > 0)
  for (const term of PRICING_TERMS) assert.ok(!/USD\s*\d|\$\s*\d/.test(term.text), term.title)
})
