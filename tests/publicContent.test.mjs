import assert from 'node:assert/strict'
import test from 'node:test'
import {
  mapApiPolicy,
  mapApiPortfolioEntry,
  mapApiSocialLink,
  toHomeCardProjects,
  toPortfolioCardProject
} from '../utils/publicContent.ts'

const entry = (overrides = {}) => ({
  slug: 'mi-app',
  title: 'Mi App',
  type: 'product',
  status: 'published',
  description: 'Descripción corta',
  highlights: [],
  scope: [],
  technologies: ['Nuxt'],
  coverImage: '/projects/mi-app/cover.webp',
  featured: false,
  tags: ['Aplicación', 'Finanzas'],
  audience: 'personas que ahorran',
  gallery: [],
  ...overrides
})

test('convierte la ficha de la API al tipo del sitio', () => {
  const item = mapApiPortfolioEntry(
    entry({ ogImage: '/og.jpg', role: 'Diseño y desarrollo', url: 'https://mi-app.co' })
  )
  assert.deepEqual(
    { id: item.id, slug: item.slug, type: item.type, portfolioType: item.portfolioType },
    { id: 'mi-app', slug: 'mi-app', type: 'product', portfolioType: 'Producto propio' }
  )
  assert.equal(item.urlImage, '/projects/mi-app/cover.webp')
  assert.equal(item.ogImage, '/og.jpg')
  assert.equal(item.role, 'Diseño y desarrollo')
  assert.deepEqual(item.tags, ['Aplicación', 'Finanzas'])
})

test('la etiqueta de tipo distingue productos propios de trabajos de clientes', () => {
  assert.equal(mapApiPortfolioEntry(entry({ type: 'client' })).portfolioType, 'Cliente')
})

test('las listas vacías se omiten para que la ficha no muestre secciones sin contenido', () => {
  const item = mapApiPortfolioEntry(entry())
  assert.equal(item.highlights, undefined)
  assert.equal(item.scope, undefined)
  assert.equal(item.gallery, undefined)
  const full = mapApiPortfolioEntry(
    entry({
      highlights: [{ value: '3x', label: 'más rápido' }],
      scope: ['Diseño'],
      gallery: [{ src: '/a.webp', alt: 'Pantalla' }]
    })
  )
  assert.equal(full.highlights.length, 1)
  assert.equal(full.scope.length, 1)
  assert.equal(full.gallery.length, 1)
})

test('la tarjeta enlaza a la ficha, salvo en los proyectos en desarrollo', () => {
  const published = toPortfolioCardProject(mapApiPortfolioEntry(entry()))
  assert.equal(published.href, '/portafolio/mi-app')
  assert.equal(published.type, 'product')
  assert.deepEqual(published.tags, ['Aplicación', 'Finanzas'])
  assert.equal(published.audience, 'personas que ahorran')
  assert.equal(published.image, '/projects/mi-app/cover.webp')

  const inDevelopment = toPortfolioCardProject(
    mapApiPortfolioEntry(entry({ status: 'in-development' }))
  )
  assert.equal(inDevelopment.href, '')
  assert.equal(
    toPortfolioCardProject(mapApiPortfolioEntry(entry({ type: 'client' }))).type,
    'client'
  )
})

test('una ficha sin etiquetas ni público objetivo no rompe la tarjeta', () => {
  const card = toPortfolioCardProject(
    mapApiPortfolioEntry(entry({ tags: [], audience: undefined }))
  )
  assert.deepEqual(card.tags, [])
  assert.equal(card.audience, '')
})

test('la home muestra las primeras 5 tarjetas y solo la primera es destacada', () => {
  const items = Array.from({ length: 8 }, (_, index) =>
    mapApiPortfolioEntry(entry({ slug: `p-${index}`, title: `P${index}` }))
  )
  const cards = toHomeCardProjects(items)
  assert.equal(cards.length, 5)
  assert.deepEqual(
    cards.map(card => Boolean(card.primary)),
    [true, false, false, false, false]
  )
})

test('las tarjetas de ejemplo conservan su marca', () => {
  const card = toPortfolioCardProject({ ...mapApiPortfolioEntry(entry()), sample: true })
  assert.equal(card.sample, true)
  assert.equal(toPortfolioCardProject(mapApiPortfolioEntry(entry())).sample, undefined)
})

test('convierte las redes sociales de la API', () => {
  assert.deepEqual(
    mapApiSocialLink({ name: 'GitHub', url: 'https://github.com/x', icon: 'simple-icons:github' }),
    { name: 'GitHub', link: 'https://github.com/x', icon: 'simple-icons:github' }
  )
})

test('las políticas reciben un id estable para la clave de lista, sin acentos ni símbolos', () => {
  const block = mapApiPolicy({ title: '¿Después del lanzamiento?', body: 'Soporte acordado' }, 1)
  assert.equal(block.id, '1-despues-del-lanzamiento')
  assert.equal(block.body, 'Soporte acordado')
  // Dos políticas con el mismo título no colisionan.
  assert.notEqual(
    mapApiPolicy({ title: 'Igual', body: 'a' }, 0).id,
    mapApiPolicy({ title: 'Igual', body: 'b' }, 1).id
  )
})
