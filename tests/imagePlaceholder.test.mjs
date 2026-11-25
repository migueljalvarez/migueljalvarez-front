import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Toda imagen de contenido editable (Sobre mí, portada y galería de proyectos) pasa por el respaldo de
// marca: si vuelve un NuxtImg suelto, una ruta vacía o rota se vería como imagen rota.
const WRAPPED = [
  'components/molecules/ImageCarousel/ImageCarousel.vue',
  'components/organisms/ProjectCard/ProjectCard.vue',
  'components/organisms/ProjectListCard/ProjectListCard.vue',
  'components/organisms/ProjectGallery/ProjectGallery.vue',
  'components/templates/ProjectDetail/ProjectDetail.vue'
]

for (const file of WRAPPED) {
  test(`placeholder: ${file} usa ImageWithFallback y no NuxtImg suelto`, () => {
    const source = read(file)
    assert.match(source, /<ImageWithFallback/)
    assert.doesNotMatch(source, /<NuxtImg/)
  })
}

test('placeholder: el envoltorio cubre ruta vacía y fallo de carga', () => {
  const source = read('components/molecules/ImageWithFallback/ImageWithFallback.vue')
  assert.ok(source.includes('props.src?.trim()'))
  assert.match(source, /@error="failed = true"/)
  assert.match(source, /<ImagePlaceholder/)
})

test('placeholder: el átomo es estático, con proporción del contenedor y accesible', () => {
  const source = read('components/atoms/ImagePlaceholder/ImagePlaceholder.vue')
  assert.doesNotMatch(source, /animation|@keyframes|transition/)
  assert.match(source, /aria-hidden/)
  assert.match(source, /role/)
})

test('placeholder: átomo y molécula están exportados', () => {
  assert.match(read('components/atoms/index.ts'), /ImagePlaceholder/)
  assert.match(read('components/molecules/index.ts'), /ImageWithFallback/)
})
