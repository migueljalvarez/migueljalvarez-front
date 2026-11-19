import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ABOUT_LIMITS,
  aboutPublishRequirements,
  buildAboutPayload,
  buildAboutSteps,
  emptyAboutForm,
  formFromAboutRecord,
  formToAboutContent,
  hasAboutChanges,
  makeDefaultImage,
  moveImage,
  removeImageAt,
  validateAboutForm
} from '../utils/admin/about.ts'

const image = (n, over = {}) => ({
  id: `id-${n}`,
  path: `/about/foto-${n}.webp`,
  alt: `Foto ${n}`,
  width: null,
  height: null,
  sortOrder: n,
  isDefault: n === 1,
  createdAt: '2026-11-01T00:00:00Z',
  ...over
})

const record = (over = {}) => ({
  eyebrow: 'Sobre mí',
  heading: 'Título',
  intro: 'Presentación',
  quote: '',
  howIWork: '',
  beyondWork: '',
  location: '',
  workMode: '',
  availability: '',
  stats: [],
  tools: [],
  ctaLabel: '',
  ctaHref: '',
  isPublished: false,
  updatedAt: null,
  images: [image(1)],
  ...over
})

const form = (over = {}) => ({ ...formFromAboutRecord(record()), ...over })

test('un formulario vacío necesita título y presentación', () => {
  const result = validateAboutForm(emptyAboutForm())
  assert.equal(result.valid, false)
  assert.ok(result.errors.heading)
  assert.ok(result.errors.intro)
})

test('un formulario mínimo es válido y el sobre-título vacío vuelve al valor por defecto', () => {
  const result = validateAboutForm(form({ eyebrow: '  ' }))
  assert.equal(result.valid, true)
  assert.equal(result.values.eyebrow, 'Sobre mí')
})

test('respeta los límites de la API', () => {
  const long = n => 'a'.repeat(n + 1)
  const result = validateAboutForm(
    form({
      heading: long(ABOUT_LIMITS.heading),
      intro: long(ABOUT_LIMITS.intro),
      quote: long(ABOUT_LIMITS.quote),
      howIWork: long(ABOUT_LIMITS.howIWork),
      location: long(ABOUT_LIMITS.location),
      availability: long(ABOUT_LIMITS.availability),
      tools: [long(ABOUT_LIMITS.tool)],
      stats: [{ value: long(ABOUT_LIMITS.statValue), label: long(ABOUT_LIMITS.statLabel) }]
    })
  )
  for (const key of [
    'heading',
    'intro',
    'quote',
    'howIWork',
    'location',
    'availability',
    'tools.0',
    'stats.0.value',
    'stats.0.label'
  ]) {
    assert.ok(result.errors[key], `debería fallar ${key}`)
  }
})

test('máximo 4 cifras, 12 herramientas y 4 imágenes', () => {
  const stats = Array.from({ length: 5 }, (_, n) => ({ value: `${n}`, label: 'x' }))
  const tools = Array.from({ length: 13 }, (_, n) => `t${n}`)
  const images = [1, 2, 3, 4, 5].map(n => image(n))
  const result = validateAboutForm(
    form({ stats, tools, images: formFromAboutRecord(record({ images })).images })
  )
  assert.ok(result.errors.stats)
  assert.ok(result.errors.tools)
  assert.ok(result.errors.images)
})

test('el botón exige etiqueta y enlace juntos, y un enlace seguro', () => {
  assert.ok(validateAboutForm(form({ ctaLabel: 'Escríbeme' })).errors.ctaHref)
  assert.ok(validateAboutForm(form({ ctaHref: '/#contacto' })).errors.ctaLabel)
  assert.ok(
    validateAboutForm(form({ ctaLabel: 'Ir', ctaHref: 'http://inseguro.example' })).errors.ctaHref
  )
  assert.ok(validateAboutForm(form({ ctaLabel: 'Ir', ctaHref: '//otro.example' })).errors.ctaHref)
  assert.equal(validateAboutForm(form({ ctaLabel: 'Ir', ctaHref: '/#contacto' })).valid, true)
  assert.equal(
    validateAboutForm(form({ ctaLabel: 'Ir', ctaHref: 'https://wa.me/573000000000' })).valid,
    true
  )
})

test('la ruta de la imagen debe ser /about/<slug>.<ext>, con alt y sin repetir', () => {
  const bad = ['/ma.webp', '/about/Foto.webp', '/about/a b.webp', '/about/a.gif', 'about/a.webp']
  for (const path of bad) {
    const result = validateAboutForm(form({ images: [{ path, alt: 'x', isDefault: true }] }))
    assert.ok(result.errors['images.0.path'], path)
  }
  const noAlt = validateAboutForm(
    form({ images: [{ path: '/about/ok.webp', alt: ' ', isDefault: true }] })
  )
  assert.ok(noAlt.errors['images.0.alt'])
  const repeated = validateAboutForm(
    form({
      images: [
        { path: '/about/ok.webp', alt: 'a', isDefault: true },
        { path: '/about/ok.webp', alt: 'b', isDefault: false }
      ]
    })
  )
  assert.ok(repeated.errors['images.1.path'])
})

test('publicar sin imágenes es un error y los requisitos lo dicen', () => {
  const values = form({ isPublished: true, images: [] })
  assert.ok(validateAboutForm(values).errors.isPublished)
  const requirements = aboutPublishRequirements(values)
  assert.equal(requirements.find(item => item.id === 'image').met, false)
  assert.equal(
    aboutPublishRequirements(form()).every(item => item.met),
    true
  )
})

test('el PUT omite los opcionales vacíos y recorta espacios', () => {
  const payload = buildAboutPayload(
    form({ heading: ' Hola ', quote: '  ', location: 'Medellín', ctaLabel: '', ctaHref: '' })
  )
  assert.equal(payload.heading, 'Hola')
  assert.equal('quote' in payload, false)
  assert.equal('ctaLabel' in payload, false)
  assert.equal(payload.location, 'Medellín')
  assert.equal('images' in payload, false)
})

test('detecta cambios y los ignora si solo hay espacios', () => {
  const saved = form()
  assert.equal(hasAboutChanges(saved, form({ heading: 'Título ' })), false)
  assert.equal(hasAboutChanges(saved, form({ heading: 'Otro' })), true)
})

test('la predeterminada pasa al principio y al quitarla la primera restante lo es', () => {
  const images = formFromAboutRecord(record({ images: [image(1), image(2), image(3)] })).images
  const moved = makeDefaultImage(images, 2)
  assert.deepEqual(
    moved.map(item => [item.id, item.isDefault]),
    [
      ['id-3', true],
      ['id-1', false],
      ['id-2', false]
    ]
  )
  const removed = removeImageAt(moved, 0)
  assert.deepEqual(
    removed.map(item => [item.id, item.isDefault]),
    [
      ['id-1', true],
      ['id-2', false]
    ]
  )
  assert.deepEqual(
    moveImage(images, 1, 0).map(item => item.id),
    ['id-1', 'id-2', 'id-3']
  )
  assert.deepEqual(
    moveImage(images, 2, 1).map(item => item.id),
    ['id-1', 'id-3', 'id-2']
  )
})

test('sin cambios no hay pasos', () => {
  assert.deepEqual(buildAboutSteps(form(), form()), [])
})

test('pasos: publicar añade primero las imágenes y guarda el contenido al final', () => {
  const saved = formFromAboutRecord(record({ images: [] }))
  const current = {
    ...saved,
    isPublished: true,
    images: [{ path: '/about/nueva.webp', alt: 'Nueva', isDefault: true }]
  }
  const steps = buildAboutSteps(saved, current)
  assert.deepEqual(
    steps.map(step => step.kind),
    ['add-image', 'save-content']
  )
  assert.deepEqual(steps[0].body, {
    path: '/about/nueva.webp',
    alt: 'Nueva',
    sortOrder: 0,
    isDefault: true
  })
})

test('pasos: despublicar va primero para poder quitar todas las imágenes', () => {
  const saved = formFromAboutRecord(record({ isPublished: true }))
  const current = { ...saved, isPublished: false, images: [] }
  assert.deepEqual(
    buildAboutSteps(saved, current).map(step => step.kind),
    ['save-content', 'remove-image']
  )
})

test('pasos: reemplazar la única imagen publicada añade antes de quitar', () => {
  const saved = formFromAboutRecord(record({ isPublished: true }))
  const current = {
    ...saved,
    images: [{ path: '/about/otra.webp', alt: 'Otra', isDefault: true }]
  }
  assert.deepEqual(
    buildAboutSteps(saved, current).map(step => step.kind),
    ['add-image', 'remove-image']
  )
})

test('pasos: con 4 imágenes, para añadir una primero se quita otra', () => {
  const four = formFromAboutRecord(record({ images: [image(1), image(2), image(3), image(4)] }))
  const current = {
    ...four,
    images: [
      ...four.images.slice(0, 3),
      { path: '/about/quinta.webp', alt: 'Quinta', isDefault: false }
    ]
  }
  assert.deepEqual(
    buildAboutSteps(four, current).map(step => step.kind),
    ['remove-image', 'add-image']
  )
})

test('pasos: cambiar alt, orden y predeterminada solo toca lo que cambió', () => {
  const saved = formFromAboutRecord(record({ images: [image(1), image(2), image(3)] }))
  const current = {
    ...saved,
    images: makeDefaultImage(
      saved.images.map(item => (item.id === 'id-2' ? { ...item, alt: 'Nuevo alt' } : item)),
      2
    )
  }
  const steps = buildAboutSteps(saved, current)
  const byId = Object.fromEntries(steps.map(step => [step.id, step.changes]))
  assert.deepEqual(byId['id-3'], { sortOrder: 0, isDefault: true })
  assert.deepEqual(byId['id-1'], { sortOrder: 1 })
  assert.deepEqual(byId['id-2'], { alt: 'Nuevo alt', sortOrder: 2 })
})

test('la vista previa usa solo imágenes válidas, máximo 3, y omite lo vacío', () => {
  const images = [1, 2, 3, 4].map(n => ({
    path: `/about/f-${n}.webp`,
    alt: `F${n}`,
    isDefault: n === 1
  }))
  images.push({ path: 'mal', alt: 'x', isDefault: false })
  const content = formToAboutContent(
    form({ images, stats: [{ value: '1', label: '' }], ctaLabel: 'Ir', ctaHref: '/#contacto' })
  )
  assert.equal(content.images.length, 3)
  assert.deepEqual(content.stats, [])
  assert.equal(content.quote, undefined)
  assert.deepEqual(content.cta, { label: 'Ir', href: '/#contacto' })
})

test('about: las cifras del respaldo caben en los límites del panel (se pueden guardar)', async () => {
  const { ABOUT_FALLBACK } = await import('../constants/common/index.ts')
  assert.ok(ABOUT_FALLBACK.stats.length <= ABOUT_LIMITS.stats)
  for (const { value, label } of ABOUT_FALLBACK.stats) {
    assert.ok(value.length <= ABOUT_LIMITS.statValue, `cifra demasiado larga: ${value}`)
    assert.ok(label.length <= ABOUT_LIMITS.statLabel, `etiqueta demasiado larga: ${label}`)
  }
})
