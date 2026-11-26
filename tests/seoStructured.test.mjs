import assert from 'node:assert/strict'
import {
  readFileSync } from 'node:fs'
import test from 'node:test'
import {
  absoluteUrl,
  buildBreadcrumbList,
  buildProjectSchema,
  latestSitemapDay, sitemapDate, sitemapDay,
  sitemapUrlEntry,
  projectSeoTitle,
  toMetaDescription
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

test('lastmod de proyectos: día de la fecha ISO y el más reciente; sin fecha no se inventa', () => {
  assert.equal(sitemapDay('2026-01-15T23:10:00.000Z'), '2026-01-15')
  assert.equal(sitemapDay(undefined), null)
  assert.equal(latestSitemapDay(['2026-01-15T10:00:00Z', undefined, '2026-03-02T10:00:00Z']), '2026-03-02')
  assert.equal(latestSitemapDay([undefined, 'ayer']), null)
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
  const constants = readFileSync('constants/common/index.ts', 'utf8')
  const homeTitle = /HOME_TITLE: '([^']+)'/.exec(constants)[1]
  assert.match(homeTitle, /software a la medida en Medellín/i)
  assert.ok((homeTitle + ' | Miguel Álvarez').length <= 60, homeTitle)
  assert.ok(readFileSync('pages/index.vue', 'utf8').includes('title: META.HOME_TITLE'))
  const homeDescription = /DESCRIPTION:\s*'([^']+)'/.exec(constants)[1]
  assert.ok(homeDescription.length <= 160, String(homeDescription.length))
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
  assert.ok(title.length + ' | Miguel Álvarez'.length <= 60, String(title.length))
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

test('el título de una ficha usa la primera etiqueta y nunca pasa de 60 con el sufijo', () => {
  assert.equal(projectSeoTitle({ title: 'Mi App', tags: ['Aplicación móvil'] }), 'Mi App: aplicación móvil')
  assert.equal(projectSeoTitle({ title: 'Mi App' }), 'Mi App')
  assert.equal(projectSeoTitle({ title: 'Mi App', tags: ['x'.repeat(60)] }), 'Mi App')
  const title = projectSeoTitle({ title: 'Mi Comodoro', tags: ['Aplicación financiera'] })
  assert.ok((title + ' | Miguel Álvarez').length <= 60, title)
})

test('la meta descripción se recorta en una palabra y no supera 160', () => {
  assert.equal(toMetaDescription('  Texto   corto  '), 'Texto corto')
  const long = toMetaDescription('palabra '.repeat(40))
  assert.ok(long.length <= 160, String(long.length))
  assert.match(long, /palabra…$/)
})

test('títulos y descripciones de las páginas caben en los límites y terminan en la marca', () => {
  const config = readFileSync('nuxt.config.ts', 'utf8')
  assert.ok(config.includes("titleTemplate: '%s | Miguel Álvarez'"))
  for (const file of ['how-we-work.vue', 'pricing.vue', 'portfolio/index.vue']) {
    const page = readFileSync(`pages/${file}`, 'utf8')
    const title = /title: '([^']+)',\s*description/.exec(page)[1]
    const description = /description:\s*'([^']+)'/.exec(page)[1]
    assert.ok((title + ' | Miguel Álvarez').length <= 60, `${file}: ${title}`)
    assert.ok(description.length <= 160, `${file}: ${description.length}`)
    assert.ok(!/y de clientes/.test(description), file)
  }
})
