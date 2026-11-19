import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildCreatePayload,
  buildUpdatePayload,
  canPublish,
  emptyPortfolioForm,
  errorOf,
  formFromRecord,
  formToCardProject,
  hasPortfolioChanges,
  moveItem,
  normalizeList,
  planGalleryChanges,
  portfolioStateBadge,
  publicPortfolioPath,
  publishRequirements,
  suggestSlug,
  validatePortfolioForm
} from '../utils/admin/portfolio.ts'

const valid = (over = {}) => ({
  ...emptyPortfolioForm(),
  title: 'Mi Despensa',
  slug: 'mi-despensa',
  description: 'Control de compras del hogar.',
  ...over
})

const record = (over = {}) => ({
  id: 'e1',
  projectId: null,
  slug: 'mi-app',
  title: 'Mi App',
  kind: 'product',
  status: 'published',
  description: 'Descripción',
  role: '',
  year: '2026',
  duration: '',
  problem: '',
  decision: '',
  result: '',
  highlights: [],
  scope: [],
  technologies: ['Nuxt'],
  audience: 'Hogares',
  tags: ['Web'],
  coverPath: '/projects/mi-app/cover.webp',
  ogPath: '',
  url: '',
  featured: false,
  sortOrder: 10,
  isPublished: false,
  publishedAt: null,
  mediaCount: 0,
  createdAt: '2026-11-01T10:00:00.000Z',
  updatedAt: '2026-11-02T10:00:00.000Z',
  media: [],
  ...over
})

test('el slug se sugiere sin acentos ni símbolos y con guiones', () => {
  assert.equal(suggestSlug('Mi Comodoro'), 'mi-comodoro')
  assert.equal(suggestSlug('  Panadería "El Trigo" & Cía.  '), 'panaderia-el-trigo-cia')
  assert.equal(suggestSlug('Ñandú — año 2026'), 'nandu-ano-2026')
  assert.equal(suggestSlug('***'), '')
})

test('el slug sugerido respeta el máximo de 80 y no termina en guion', () => {
  const slug = suggestSlug(`${'a'.repeat(79)} b`)
  assert.ok(slug.length <= 80)
  assert.ok(!slug.endsWith('-'))
})

test('normalizar listas recorta, quita vacíos y repetidos sin distinguir mayúsculas', () => {
  assert.deepEqual(normalizeList([' Web ', '', 'web', 'App', '  ', 'WEB']), ['Web', 'App'])
})

test('un formulario correcto no tiene errores', () => {
  const result = validatePortfolioForm(valid())
  assert.equal(result.valid, true)
  assert.deepEqual(result.errors, {})
})

test('título, slug y descripción son obligatorios', () => {
  const { errors } = validatePortfolioForm(valid({ title: ' ', slug: '', description: '' }))
  assert.ok(errors.title)
  assert.ok(errors.slug)
  assert.ok(errors.description)
})

test('el slug solo admite minúsculas, números y guiones, máximo 80', () => {
  for (const slug of [
    'Mi-App',
    'mi app',
    'mi_app',
    '-mi',
    'mi-',
    'mi--app',
    'ñandú',
    'a'.repeat(81)
  ]) {
    assert.ok(validatePortfolioForm(valid({ slug })).errors.slug, slug)
  }
  assert.equal(validatePortfolioForm(valid({ slug: 'a'.repeat(80) })).errors.slug, undefined)
})

test('límites de longitud como el DTO', () => {
  const over = (field, n) => validatePortfolioForm(valid({ [field]: 'x'.repeat(n) })).errors[field]
  assert.ok(over('title', 121))
  assert.equal(over('title', 120), undefined)
  assert.ok(over('description', 401))
  assert.ok(over('audience', 161))
  assert.ok(over('role', 121))
  assert.ok(over('year', 21))
  assert.ok(over('duration', 61))
  for (const field of ['problem', 'decision', 'result']) {
    assert.ok(over(field, 1501), field)
    assert.equal(over(field, 1500), undefined, field)
  }
})

test('etiquetas: máximo 4 de 40 caracteres', () => {
  assert.ok(
    errorOf(validatePortfolioForm(valid({ tags: ['a', 'b', 'c', 'd', 'e'] })).errors, 'tags')
  )
  assert.ok(errorOf(validatePortfolioForm(valid({ tags: ['x'.repeat(41)] })).errors, 'tags'))
  assert.equal(
    errorOf(validatePortfolioForm(valid({ tags: ['a', 'b', 'c', 'd'] })).errors, 'tags'),
    undefined
  )
})

test('alcance y tecnologías: máximo 12 de 120 caracteres', () => {
  const twelve = Array.from({ length: 12 }, (_, i) => `item ${i}`)
  assert.equal(
    errorOf(validatePortfolioForm(valid({ scope: twelve, technologies: twelve })).errors, 'scope'),
    undefined
  )
  assert.ok(errorOf(validatePortfolioForm(valid({ scope: [...twelve, 'otro'] })).errors, 'scope'))
  assert.ok(
    errorOf(
      validatePortfolioForm(valid({ technologies: ['x'.repeat(121)] })).errors,
      'technologies'
    )
  )
})

test('cifras: máximo 6, valor ≤40 y etiqueta ≤120, ambos obligatorios', () => {
  const six = Array.from({ length: 6 }, () => ({ value: '30 %', label: 'menos tiempo' }))
  assert.equal(validatePortfolioForm(valid({ highlights: six })).valid, true)
  assert.ok(
    errorOf(validatePortfolioForm(valid({ highlights: [...six, six[0]] })).errors, 'highlights')
  )
  const bad = validatePortfolioForm(valid({ highlights: [{ value: '30 %', label: '' }] }))
  assert.ok(bad.errors['highlights.0.label'])
  assert.equal(bad.errors['highlights.0.value'], undefined)
  assert.ok(
    validatePortfolioForm(valid({ highlights: [{ value: 'x'.repeat(41), label: 'a' }] })).errors[
      'highlights.0.value'
    ]
  )
})

test('una fila de cifra totalmente vacía se descarta al normalizar', () => {
  const result = validatePortfolioForm(valid({ highlights: [{ value: ' ', label: '' }] }))
  assert.equal(result.valid, true)
  assert.deepEqual(result.values.highlights, [])
})

test('rutas de imagen: absolutas, sin puntos extra y con extensión permitida', () => {
  for (const coverPath of [
    'projects/a/cover.webp',
    '/projects/a/cover.gif',
    '/projects/../cover.webp',
    '/projects/a b/cover.webp',
    '/projects/a/cover.v2.webp',
    'http://x.co/a.webp',
    'https://x.co/a.webp?x=1',
    'https://x.co/a b.webp'
  ]) {
    assert.ok(validatePortfolioForm(valid({ coverPath })).errors.coverPath, coverPath)
  }
  for (const coverPath of [
    '',
    '/projects/a/cover.webp',
    '/projects/a/og.jpg',
    '/a/b_c-d.PNG'.replace('PNG', 'png'),
    'https://pub-abc.r2.dev/projects/0b6f1c2e-3d4a-4b5c-8d6e-7f8091a2b3c4.webp'
  ]) {
    assert.equal(validatePortfolioForm(valid({ coverPath })).errors.coverPath, undefined, coverPath)
  }
})

test('publicar exige portada', () => {
  const sinPortada = validatePortfolioForm(valid({ isPublished: true }))
  assert.equal(sinPortada.valid, false)
  assert.match(sinPortada.errors.coverPath, /portada/)
  const conPortada = validatePortfolioForm(
    valid({ isPublished: true, coverPath: '/projects/a/cover.webp' })
  )
  assert.equal(conPortada.valid, true)
})

test('requisitos de publicación', () => {
  assert.equal(canPublish(valid()), false)
  assert.deepEqual(
    publishRequirements(valid()).map(r => [r.id, r.met]),
    [
      ['cover', false],
      ['description', true]
    ]
  )
  assert.equal(canPublish(valid({ coverPath: '/projects/a/cover.webp' })), true)
  assert.equal(canPublish(valid({ coverPath: '/projects/a/cover.webp', description: ' ' })), false)
})

test('galería: máximo 6, ruta y alt obligatorios, pie ≤200', () => {
  const img = (n, over = {}) => ({
    path: `/projects/a/0${n}.webp`,
    alt: `Vista ${n}`,
    caption: '',
    ...over
  })
  const seven = Array.from({ length: 7 }, (_, i) => img(i))
  assert.ok(errorOf(validatePortfolioForm(valid({ gallery: seven })).errors, 'gallery'))
  const sin = validatePortfolioForm(
    valid({ gallery: [img(1, { alt: ' ' }), img(2, { path: '' })] })
  )
  assert.ok(sin.errors['gallery.0.alt'])
  assert.ok(sin.errors['gallery.1.path'])
  assert.ok(
    validatePortfolioForm(valid({ gallery: [img(1, { caption: 'x'.repeat(201) })] })).errors[
      'gallery.0.caption'
    ]
  )
  assert.equal(validatePortfolioForm(valid({ gallery: [img(1)] })).valid, true)
})

test('el orden es un entero de 0 a 9999', () => {
  for (const sortOrder of ['-1', '1.5', 'a', '10000', '']) {
    assert.ok(validatePortfolioForm(valid({ sortOrder })).errors.sortOrder, sortOrder)
  }
  for (const sortOrder of ['0', '9999', ' 25 ']) {
    assert.equal(validatePortfolioForm(valid({ sortOrder })).errors.sortOrder, undefined, sortOrder)
  }
})

test('la URL pública, si existe, empieza por https://', () => {
  assert.ok(validatePortfolioForm(valid({ url: 'http://x.co' })).errors.url)
  assert.equal(validatePortfolioForm(valid({ url: 'https://x.co' })).errors.url, undefined)
  assert.equal(validatePortfolioForm(valid({ url: '' })).errors.url, undefined)
})

test('errorOf devuelve el primer error de un campo o de sus elementos', () => {
  assert.equal(errorOf({ 'tags.1': 'a', 'tags.0': 'b' }, 'tags'), 'a')
  assert.equal(errorOf({ tags: 'x' }, 'tags'), 'x')
  assert.equal(errorOf({ tagsExtra: 'x' }, 'tags'), undefined)
})

test('crear envía todos los campos normalizados y nunca isPublished', () => {
  const payload = buildCreatePayload(
    valid({ title: '  Mi Despensa ', sortOrder: '30', tags: [' Web ', 'web'] })
  )
  assert.equal(payload.title, 'Mi Despensa')
  assert.equal(payload.sortOrder, 30)
  assert.deepEqual(payload.tags, ['Web'])
  assert.equal('isPublished' in payload, false)
  assert.equal('gallery' in payload, false)
})

test('actualizar envía solo lo modificado', () => {
  const saved = formFromRecord(record())
  assert.deepEqual(buildUpdatePayload(saved, { ...saved }), {})
  assert.deepEqual(buildUpdatePayload(saved, { ...saved, title: 'Otro', featured: true }), {
    title: 'Otro',
    featured: true
  })
  assert.deepEqual(buildUpdatePayload(saved, { ...saved, isPublished: true }), {
    isPublished: true
  })
  assert.deepEqual(buildUpdatePayload(saved, { ...saved, sortOrder: '20' }), { sortOrder: 20 })
})

test('espacios o repetidos sin efecto real no cuentan como cambio', () => {
  const saved = formFromRecord(record())
  const current = { ...saved, title: 'Mi App  ', tags: ['Web', 'web', ''] }
  assert.deepEqual(buildUpdatePayload(saved, current), {})
  assert.equal(hasPortfolioChanges(saved, current), false)
})

test('los cambios de galería cuentan como cambios sin guardar pero no viajan en el PATCH', () => {
  const saved = formFromRecord(record())
  const current = { ...saved, gallery: [{ path: '/a/b.webp', alt: 'x', caption: '' }] }
  assert.equal(hasPortfolioChanges(saved, current), true)
  assert.deepEqual(buildUpdatePayload(saved, current), {})
})

test('plan de galería: crear, actualizar, quitar y reordenar', () => {
  const saved = [
    { id: 'm1', path: '/p/1.webp', alt: 'Uno', caption: '', sortOrder: 0 },
    { id: 'm2', path: '/p/2.webp', alt: 'Dos', caption: '', sortOrder: 1 },
    { id: 'm3', path: '/p/3.webp', alt: 'Tres', caption: '', sortOrder: 2 }
  ]
  const plan = planGalleryChanges(saved, [
    { id: 'm3', path: '/p/3.webp', alt: 'Tres', caption: '' },
    { id: 'm1', path: '/p/1.webp', alt: 'Uno editado', caption: '' },
    { path: '/p/4.webp', alt: 'Cuatro', caption: ' pie ' }
  ])
  assert.deepEqual(plan.remove, ['m2'])
  assert.deepEqual(plan.update, [
    { id: 'm3', changes: { sortOrder: 0 } },
    { id: 'm1', changes: { alt: 'Uno editado', sortOrder: 1 } }
  ])
  assert.deepEqual(plan.create, [
    { index: 2, body: { path: '/p/4.webp', alt: 'Cuatro', caption: 'pie', sortOrder: 2 } }
  ])
})

test('sin cambios en la galería no hay operaciones', () => {
  const saved = [{ id: 'm1', path: '/p/1.webp', alt: 'Uno', caption: '', sortOrder: 0 }]
  const plan = planGalleryChanges(saved, [{ id: 'm1', path: '/p/1.webp', alt: 'Uno', caption: '' }])
  assert.deepEqual(plan, { remove: [], update: [], create: [] })
})

test('reordenar: mover mantiene la lista y respeta los bordes', () => {
  assert.deepEqual(moveItem(['a', 'b', 'c'], 0, 1), ['b', 'a', 'c'])
  assert.deepEqual(moveItem(['a', 'b', 'c'], 0, -1), ['a', 'b', 'c'])
  assert.deepEqual(moveItem(['a', 'b', 'c'], 2, 3), ['a', 'b', 'c'])
})

test('formFromRecord ordena la galería por sortOrder', () => {
  const form = formFromRecord(
    record({
      media: [
        { id: 'b', path: '/p/b.webp', alt: 'B', caption: '', sortOrder: 5 },
        { id: 'a', path: '/p/a.webp', alt: 'A', caption: '', sortOrder: 1 }
      ]
    })
  )
  assert.deepEqual(
    form.gallery.map(item => item.id),
    ['a', 'b']
  )
  assert.equal(form.sortOrder, '10')
})

test('estado visible con texto y dirección pública', () => {
  assert.deepEqual(portfolioStateBadge({ isPublished: false, status: 'published' }), {
    label: 'Borrador',
    tone: 'neutral'
  })
  assert.equal(portfolioStateBadge({ isPublished: true, status: 'published' }).label, 'Publicado')
  assert.equal(
    portfolioStateBadge({ isPublished: true, status: 'in-development' }).label,
    'En desarrollo'
  )
  assert.equal(
    publicPortfolioPath({ isPublished: true, status: 'published', slug: 'a' }),
    '/portafolio/a'
  )
  assert.equal(publicPortfolioPath({ isPublished: true, status: 'in-development', slug: 'a' }), '')
  assert.equal(publicPortfolioPath({ isPublished: false, status: 'published', slug: 'a' }), '')
})

test('la tarjeta de vista previa sale de los valores del formulario', () => {
  const card = formToCardProject(
    valid({
      kind: 'product',
      tags: ['Hogar', 'Web'],
      audience: 'Familias',
      coverPath: '/projects/mi-despensa/cover.webp'
    })
  )
  assert.equal(card.title, 'Mi Despensa')
  assert.equal(card.type, 'product')
  assert.deepEqual(card.tags, ['Hogar', 'Web'])
  assert.equal(card.audience, 'Familias')
  assert.equal(card.image, '/projects/mi-despensa/cover.webp')
  assert.equal(card.href, '/portafolio/mi-despensa')
  const dev = formToCardProject(valid({ status: 'in-development' }))
  assert.equal(dev.href, '')
  assert.equal(dev.status, 'in-development')
})
