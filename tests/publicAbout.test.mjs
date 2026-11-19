import assert from 'node:assert/strict'
import test from 'node:test'
import { ABOUT_MAX_IMAGES, mapApiAbout } from '../utils/publicContent.ts'

const api = (overrides = {}) => ({
  eyebrow: 'Sobre mí',
  heading: 'Un poco más sobre mí',
  intro: 'Hola, soy Miguel.',
  stats: [],
  tools: [],
  images: [{ src: '/about/miguel.webp', alt: 'Miguel trabajando' }],
  ...overrides
})

test('about: convierte la respuesta mínima y omite lo opcional vacío', () => {
  const about = mapApiAbout(api())
  assert.equal(about.heading, 'Un poco más sobre mí')
  assert.equal(about.quote, undefined)
  assert.equal(about.cta, undefined)
  assert.deepEqual(about.stats, [])
  assert.deepEqual(about.images, [{ src: '/about/miguel.webp', alt: 'Miguel trabajando' }])
})

test('about: conserva textos, cifras, herramientas y el botón', () => {
  const about = mapApiAbout(
    api({
      quote: ' Una cita ',
      location: 'Medellín, Colombia',
      workMode: 'Remoto',
      availability: 'Cupos para dos proyectos',
      stats: [{ value: '10+', label: 'años' }],
      tools: ['Nuxt', 'NestJS'],
      cta: { label: 'Escríbeme', href: 'https://wa.me/573000000000' }
    })
  )
  assert.equal(about.quote, 'Una cita')
  assert.equal(about.workMode, 'Remoto')
  assert.deepEqual(about.stats, [{ value: '10+', label: 'años' }])
  assert.deepEqual(about.tools, ['Nuxt', 'NestJS'])
  assert.deepEqual(about.cta, { label: 'Escríbeme', href: 'https://wa.me/573000000000' })
})

test('about: muestra como máximo 4 imágenes y respeta el orden', () => {
  const images = [1, 2, 3, 4, 5].map(n => ({
    src: `/about/foto-${n}.webp`,
    alt: `Foto ${n}`,
    width: 1200,
    height: 1500
  }))
  const about = mapApiAbout(api({ images }))
  assert.equal(ABOUT_MAX_IMAGES, 4)
  assert.deepEqual(
    about.images.map(item => item.src),
    ['/about/foto-1.webp', '/about/foto-2.webp', '/about/foto-3.webp', '/about/foto-4.webp']
  )
  assert.equal(about.images[0].width, 1200)
})

test('about: cargo, frase, nombre e intereses; vacíos se omiten (sin mezclar con el respaldo)', () => {
  const empty = mapApiAbout(api({ role: ' ', tagline: '', interests: [] }))
  assert.equal(empty.role, undefined)
  assert.equal(empty.tagline, undefined)
  assert.equal(empty.name, undefined)
  assert.equal(empty.interests, undefined)
  const full = mapApiAbout(
    api({
      role: ' Ingeniero ',
      tagline: 'Frase',
      name: 'Miguel',
      interests: [' Café ', '', 3, 'a', 'b', 'c', 'd', 'e', 'f']
    })
  )
  assert.equal(full.role, 'Ingeniero')
  assert.equal(full.tagline, 'Frase')
  assert.equal(full.name, 'Miguel')
  assert.deepEqual(full.interests, ['Café', 'a', 'b', 'c', 'd', 'e'])
  assert.equal(mapApiAbout(api({ interests: 'Café' })).interests, undefined)
})

test('about: width y height solo van en pareja', () => {
  const about = mapApiAbout(api({ images: [{ src: '/about/a.webp', alt: 'A', width: 100 }] }))
  assert.equal('width' in about.images[0], false)
})

test('about: sin imágenes válidas, sin título o con forma rara devuelve null (respaldo)', () => {
  assert.equal(mapApiAbout(null), null)
  assert.equal(mapApiAbout('x'), null)
  assert.equal(mapApiAbout(api({ images: [] })), null)
  assert.equal(mapApiAbout(api({ heading: '  ' })), null)
  assert.equal(mapApiAbout(api({ intro: undefined })), null)
  assert.equal(mapApiAbout(api({ images: 'no' })), null)
  assert.equal(mapApiAbout({ statusCode: 404, message: 'Contenido no publicado' }), null)
})

test('about: descarta imágenes externas, con ".." o sin alt', () => {
  const about = mapApiAbout(
    api({
      images: [
        { src: 'https://evil.example/x.webp', alt: 'X' },
        { src: '/about/../secreto.webp', alt: 'X' },
        { src: '/about/sin-alt.webp', alt: ' ' },
        { src: '/about/ok.webp', alt: 'Bien' }
      ]
    })
  )
  assert.deepEqual(
    about.images.map(item => item.src),
    ['/about/ok.webp']
  )
  assert.equal(mapApiAbout(api({ images: [{ src: '//evil.example/x.webp', alt: 'X' }] })), null)
})

test('about: un botón con enlace inseguro se omite', () => {
  assert.equal(
    mapApiAbout(api({ cta: { label: 'Ir', href: 'javascript:alert(1)' } })).cta,
    undefined
  )
  assert.equal(mapApiAbout(api({ cta: { label: 'Ir', href: '//evil.example' } })).cta, undefined)
  assert.deepEqual(mapApiAbout(api({ cta: { label: 'Ir', href: '/#contacto' } })).cta, {
    label: 'Ir',
    href: '/#contacto'
  })
})

test('about: recorta cifras (4) y herramientas (12) y limpia vacíos', () => {
  const stats = Array.from({ length: 6 }, (_, n) => ({ value: `${n}`, label: `L${n}` }))
  const tools = Array.from({ length: 15 }, (_, n) => `t${n}`)
  const about = mapApiAbout(api({ stats: [...stats, { value: '', label: 'x' }], tools }))
  assert.equal(about.stats.length, 4)
  assert.equal(about.tools.length, 12)
})
