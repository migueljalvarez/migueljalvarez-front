import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  columnsFor,
  filterPortfolioCards,
  galleryColumns,
  hasBothProjectTypes,
  showFillerCard,
  splitFeatured
} from '../utils/portfolioList.ts'
import { mapApiPortfolioEntry, toPortfolioCardProject } from '../utils/publicContent.ts'

const card = (slug, extra = {}) => ({ id: slug, slug, type: 'product', status: 'published', ...extra })

test('el destacado va primero y en grande; el resto conserva el orden de la API', () => {
  const { featured, rest } = splitFeatured([
    card('a', { featured: true }),
    card('b', { featured: true }),
    card('c')
  ])
  assert.equal(featured.slug, 'a')
  assert.deepEqual(rest.map(item => item.slug), ['b', 'c'])
  assert.equal(splitFeatured([card('a'), card('b')]).featured, null)
  assert.equal(splitFeatured([card('a'), card('b')]).rest.length, 2)
  assert.equal(splitFeatured([]).featured, null)
})

test('la tarjeta de relleno aparece con menos de 3 proyectos publicados y desaparece con el 3.º', () => {
  const published = slug => card(slug)
  const dev = slug => card(slug, { status: 'in-development' })
  assert.equal(showFillerCard([]), true)
  assert.equal(showFillerCard([published('a'), dev('b')]), true) // Mi Comodoro + Mi Despensa en desarrollo
  assert.equal(showFillerCard([published('a'), published('b')]), true)
  assert.equal(showFillerCard([published('a'), published('b'), published('c')]), false)
  // Los proyectos en desarrollo no cuentan como publicados.
  assert.equal(showFillerCard([published('a'), published('b'), dev('c')]), true)
})

test('los filtros solo existen si hay al menos un proyecto de cada tipo', () => {
  assert.equal(hasBothProjectTypes([card('a'), card('b')]), false)
  assert.equal(hasBothProjectTypes([card('a'), card('b', { type: 'client' })]), true)
  const all = [card('a'), card('b', { type: 'client' }), card('c')]
  assert.deepEqual(filterPortfolioCards(all, 'client').map(item => item.slug), ['b'])
  assert.equal(filterPortfolioCards(all, 'all').length, 3)
})

test('columnas de la ficha: se reparten según lo que existe', () => {
  assert.deepEqual([0, 1, 2, 3, 6].map(count => columnsFor(count)), [1, 1, 2, 3, 3])
  assert.deepEqual([1, 2, 3, 6].map(galleryColumns), [2, 2, 3, 3])
})

test('el campo destacado de la API llega a la tarjeta (no se descarta al mapear)', () => {
  const entry = {
    slug: 'mi-comodoro',
    title: 'Mi Comodoro',
    type: 'product',
    status: 'published',
    description: 'x',
    highlights: [],
    scope: [],
    technologies: [],
    coverImage: '/projects/mi-comodoro/cover.webp',
    featured: true,
    tags: [],
    gallery: []
  }
  assert.equal(toPortfolioCardProject(mapApiPortfolioEntry(entry)).featured, true)
  assert.equal(toPortfolioCardProject(mapApiPortfolioEntry({ ...entry, featured: false })).featured, false)
})

test('el listado y la ficha usan los componentes nuevos y la home conserva el suyo', () => {
  assert.match(readFileSync('pages/portfolio/index.vue', 'utf8'), /PortfolioList/)
  assert.match(readFileSync('pages/portfolio/[slug].vue', 'utf8'), /ProjectDetail/)
  // La home sigue con PortfolioSection y ProjectCard (el rediseño es solo de /portafolio y la ficha).
  assert.match(readFileSync('pages/index.vue', 'utf8'), /Portfolio/)
  const detail = readFileSync('components/templates/ProjectDetail/ProjectDetail.vue', 'utf8')
  for (const part of ['ProjectStory', 'ProjectHighlights', 'ProjectScope', 'ProjectGallery'])
    assert.match(detail, new RegExp(part))
})

test('cada sección de la ficha se omite entera cuando no tiene datos', () => {
  const guards = {
    'components/organisms/ProjectStory/ProjectStory.vue': /v-if="steps\.length"/,
    'components/organisms/ProjectHighlights/ProjectHighlights.vue': /v-if="items\.length"/,
    'components/organisms/ProjectScope/ProjectScope.vue': /v-if="items\.length"/,
    'components/organisms/ProjectGallery/ProjectGallery.vue': /v-if="images\.length"/
  }
  for (const [file, pattern] of Object.entries(guards))
    assert.match(readFileSync(file, 'utf8'), pattern, file)
})
