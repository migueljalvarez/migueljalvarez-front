import assert from 'node:assert/strict'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const publicDir = join(root, 'public')

// Presupuesto de imágenes (ver docs/portfolio-guide.md).
const MAX_BYTES = 150 * 1024
const MAX_WIDTH = 1920

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })

const images = walk(publicDir).filter(file => /\.(webp|jpe?g|png|avif)$/i.test(file))

test(`ninguna imagen de public/ supera ${MAX_BYTES / 1024} KB`, () => {
  const heavy = images
    .filter(file => statSync(file).size > MAX_BYTES)
    .map(file => `${relative(publicDir, file)} (${Math.round(statSync(file).size / 1024)} KB)`)

  assert.deepEqual(heavy, [])
})

test(`ninguna imagen de public/ supera ${MAX_WIDTH}px de ancho`, async () => {
  const { default: sharp } = await import('sharp')
  const wide = []

  for (const file of images) {
    const { width } = await sharp(file).metadata()
    if (width && width > MAX_WIDTH) wide.push(`${relative(publicDir, file)} (${width}px)`)
  }

  assert.deepEqual(wide, [])
})

test('cada proyecto con portada usa la carpeta public/projects/<slug>/', () => {
  const projects = join(publicDir, 'projects')
  const folders = readdirSync(projects, { withFileTypes: true }).filter(entry =>
    entry.isDirectory()
  )

  for (const folder of folders) {
    const files = readdirSync(join(projects, folder.name))
    assert.ok(files.includes('cover.webp'), `public/projects/${folder.name} necesita cover.webp`)
  }
})
