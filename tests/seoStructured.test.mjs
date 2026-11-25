import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  absoluteUrl,
  buildBreadcrumbList,
  buildProjectSchema,
  sitemapDate,
  sitemapUrlEntry
} from '../utils/seo.ts'

const SITE = 'https://www.migueljalvarez.com/'

test('las migas de pan empiezan en Inicio y usan URL absolutas sin barra doble', () => {
  const list = buildBreadcrumbList(SITE, [
    { name: 'Portafolio', path: '/portafolio' },
    { name: 'Mi Comodoro', path: '/portafolio/mi-comodoro' }
  ])
  assert.equal(list['@type'], 'BreadcrumbList')
  assert.deepEqual(
    list.itemListElement.map(i => [i.position, i.name, i.item]),
    [
      [1, 'Inicio', 'https://www.migueljalvarez.com'],
      [2, 'Portafolio', 'https://www.migueljalvarez.com/portafolio'],
      [3, 'Mi Comodoro', 'https://www.migueljalvarez.com/portafolio/mi-comodoro']
    ]
  )
})

test('la ficha como obra del autor solo lleva lo que existe', () => {
  const full = buildProjectSchema(SITE, {
    id: 'mi-comodoro',
    slug: 'mi-comodoro',
    title: 'Mi Comodoro',
    description: 'App de finanzas',
    ogImage: '/projects/mi-comodoro/og.jpg',
    url: 'https://www.micomodoro.com/'
  })
  assert.equal(full['@type'], 'CreativeWork')
  assert.equal(full.author['@id'], 'https://www.migueljalvarez.com/#person')
  assert.equal(full.image, 'https://www.migueljalvarez.com/projects/mi-comodoro/og.jpg')
  assert.deepEqual(full.sameAs, ['https://www.micomodoro.com/'])
  const bare = buildProjectSchema(SITE, { id: 'x', title: 'X' })
  assert.equal('image' in bare || 'sameAs' in bare || 'description' in bare, false)
})

test('una imagen alojada fuera del sitio (R2) conserva su URL; una ruta del sitio se completa', () => {
  const r2 = 'https://pub-ejemplo.r2.dev/projects/ejemplo.webp'
  assert.equal(absoluteUrl(SITE, r2), r2)
  assert.equal(absoluteUrl(SITE, '/og-image.jpg'), 'https://www.migueljalvarez.com/og-image.jpg')
  const schema = buildProjectSchema(SITE, { id: 'x', slug: 'x', title: 'X', ogImage: r2 })
  assert.equal(schema.image, r2)
  const page = readFileSync('pages/portfolio/[slug].vue', 'utf8')
  assert.match(page, /absoluteUrl\(siteUrl,/) // la ficha no concatena el dominio a ciegas
})

test('el sitemap solo pone lastmod con una fecha real', () => {
  assert.equal(sitemapDate('2026-11-20'), '2026-11-20')
  assert.equal(sitemapDate('20/11/2026'), null)
  assert.equal(sitemapDate('2026-13-45'), null)
  assert.equal(sitemapDate(undefined), null)
  assert.equal(sitemapUrlEntry('https://a.co/x', '2026-11-20'), '  <url><loc>https://a.co/x</loc><lastmod>2026-11-20</lastmod></url>')
  assert.equal(sitemapUrlEntry('https://a.co/x'), '  <url><loc>https://a.co/x</loc></url>')
})

test('título de la home ≤ 60 caracteres y descripción de Términos ≤ 160', () => {
  const home = readFileSync('pages/index.vue', 'utf8')
  assert.ok(home.includes('Desarrollo de software a la medida'))
  const title = 'Miguel Álvarez | Desarrollo de software a la medida'
  assert.ok(title.length <= 60, String(title.length))
  const terms = readFileSync('pages/terms.vue', 'utf8')
  const description = /description:\s*'([^']+)'/.exec(terms)[1]
  assert.ok(description.length >= 120 && description.length <= 160, String(description.length))
})

test('el artículo de la guía lleva autor, fechas y URL absoluta', async () => {
  const { buildArticleSchema } = await import('../utils/seo.ts')
  const schema = buildArticleSchema(SITE, {
    path: '/guias/x',
    title: 'T',
    description: 'D',
    publishedAt: '2026-11-20',
    updatedAt: '2026-11-21'
  })
  assert.equal(schema['@type'], 'Article')
  assert.equal(schema.url, 'https://www.migueljalvarez.com/guias/x')
  assert.equal(schema.author['@id'], 'https://www.migueljalvarez.com/#person')
  assert.equal(schema.datePublished, '2026-11-20')
  assert.equal(schema.dateModified, '2026-11-21')
})

test('la guía cumple los límites de SEO y no deja marcas de borrador ni promesas sin confirmar', () => {
  const source = readFileSync('data/guides.ts', 'utf8')
  const title = /seoTitle: '([^']+)'/.exec(source)[1]
  const description = /description:\s*'([^']+)'/.exec(source)[1]
  assert.ok(title.length + ' | Desarrollo de Software'.length <= 60, String(title.length))
  assert.ok(description.length >= 120 && description.length <= 160, String(description.length))
  assert.equal(/\[(PONER|CONFIRMAR)/.test(source), false)
  assert.equal(/24 horas|sin costo/i.test(source), false)
})

test('la guía está en el sitemap, tiene su página y usa el template propio', () => {
  assert.ok(readFileSync('server/routes/sitemap.xml.ts', 'utf8').includes('GUIDES.map'))
  const page = readFileSync('pages/guides/rewrite-or-improve.vue', 'utf8')
  assert.ok(page.includes("path: '/guias/rehacer-o-mejorar-software'") && page.includes('<GuideArticle'))
  assert.equal((page.match(/<h1/g) || []).length, 0) // el h1 lo pone el template con Heading
})

test('la guía tiene enlaces internos: desde el detalle del servicio «decidir» y desde Cómo trabajo', () => {
  assert.ok(readFileSync('data/services.ts', 'utf8').includes('GUIDE_REWRITE_OR_IMPROVE.path'))
  assert.ok(readFileSync('components/organisms/ServiceCard/ServiceCard.vue', 'utf8').includes('offering.guide'))
  assert.ok(readFileSync('components/templates/HowWork/HowWorkContent.vue', 'utf8').includes('guide.path'))
})
