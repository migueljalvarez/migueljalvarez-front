import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { toAdminApiError } from '../utils/adminApiError.ts'
import {
  MEDIA_MAX_BYTES,
  keysToDiscard,
  mediaKeyFromUrl,
  mediaResultSchema,
  mediaUploadErrorMessage,
  validateMediaFile
} from '../utils/admin/media.ts'
import { isImageSource, isRemoteImageUrl, isSiteImagePath } from '../utils/imageSource.ts'

const KEY = 'about/0b6f1c2e-3d4a-4b5c-8d6e-7f8091a2b3c4.webp'
const URL_OK = `https://pub-0123456789abcdef.r2.dev/${KEY}`

test('origen de imagen: ruta del sitio o URL https con extensión; nada más', () => {
  for (const ok of ['/about/ma.webp', '/projects/a/cover.jpg', URL_OK]) {
    assert.equal(isImageSource(ok), true, ok)
  }
  for (const bad of [
    'http://pub.r2.dev/a.webp',
    'https://pub.r2.dev/a.webp?x=1',
    'https://pub.r2.dev/a.webp#x',
    'https://user:pw@pub.r2.dev/a.webp',
    'https://pub.r2.dev/../a.webp',
    'https://pub.r2.dev/a b.webp',
    'https://pub.r2.dev/a.svg',
    '//pub.r2.dev/a.webp',
    '/about/../x.webp',
    'javascript:alert(1)',
    'data:image/png;base64,AAAA',
    '',
    null,
    42
  ]) {
    assert.equal(isImageSource(bad), false, String(bad))
  }
  assert.equal(isSiteImagePath(URL_OK), false)
  assert.equal(isRemoteImageUrl('/about/ma.webp'), false)
})

test('validación previa del archivo: tipo, vacío y 5 MB', () => {
  assert.equal(validateMediaFile({ type: 'image/png', size: 1000 }), null)
  assert.equal(validateMediaFile({ type: 'image/webp', size: MEDIA_MAX_BYTES }), null)
  assert.match(validateMediaFile({ type: 'image/gif', size: 1000 }), /JPEG, PNG o WebP/)
  assert.match(validateMediaFile({ type: 'application/pdf', size: 1000 }), /no es una imagen/)
  assert.match(validateMediaFile({ type: 'image/png', size: 0 }), /vacío/)
  assert.match(validateMediaFile({ type: 'image/jpeg', size: MEDIA_MAX_BYTES + 1 }), /5 MB/)
})

test('la respuesta de la API se valida: url https, clave estricta y medidas', () => {
  const ok = { url: URL_OK, key: KEY, width: 1600, height: 900, bytes: 52000 }
  assert.equal(mediaResultSchema.safeParse(ok).success, true)
  for (const bad of [
    { ...ok, url: 'http://x.test/a.webp' },
    { ...ok, key: '../etc/passwd' },
    { ...ok, key: 'otra/0b6f1c2e-3d4a-4b5c-8d6e-7f8091a2b3c4.webp' },
    { ...ok, width: 0 },
    { ...ok, bytes: -1 },
    { url: URL_OK }
  ]) {
    assert.equal(mediaResultSchema.safeParse(bad).success, false)
  }
})

test('la clave se deduce de la URL subida y no de rutas del sitio ni de URL ajenas', () => {
  assert.equal(mediaKeyFromUrl(URL_OK), KEY)
  assert.equal(mediaKeyFromUrl(`https://media.ejemplo.co/${KEY}`), KEY)
  assert.equal(mediaKeyFromUrl('/about/ma.webp'), null)
  assert.equal(mediaKeyFromUrl('https://cdn.test/foto.webp'), null)
  assert.equal(
    mediaKeyFromUrl('https://cdn.test/otra/0b6f1c2e-3d4a-4b5c-8d6e-7f8091a2b3c4.webp'),
    null
  )
})

test('al borrar tras guardar se omiten las repetidas, las ajenas y las que siguen en uso', () => {
  const other = `https://pub-0123456789abcdef.r2.dev/projects/11111111-2222-3333-4444-555555555555.webp`
  assert.deepEqual(keysToDiscard([URL_OK, URL_OK, '/about/ma.webp', 'https://x.test/a.webp'], []), [
    KEY
  ])
  assert.deepEqual(keysToDiscard([URL_OK, other], [URL_OK]), [
    'projects/11111111-2222-3333-4444-555555555555.webp'
  ])
  assert.deepEqual(keysToDiscard([], [URL_OK]), [])
})

test('errores de subida en español: 413, tipo, 400 de la API, 503 sin almacenamiento y 502', () => {
  const from = (status, message, detail) => ({ status, message, detail })
  assert.match(mediaUploadErrorMessage(from(413, 'x')), /5 MB/)
  assert.match(mediaUploadErrorMessage(from(415, 'x')), /JPEG, PNG o WebP/)
  assert.equal(
    mediaUploadErrorMessage(from(400, 'Formato no permitido: solo JPEG, PNG o WebP')),
    'Formato no permitido: solo JPEG, PNG o WebP'
  )
  assert.match(
    mediaUploadErrorMessage(
      from(503, 'genérico', 'El almacenamiento de imágenes no está configurado en el servidor')
    ),
    /almacenamiento de imágenes no está configurado/
  )
  assert.match(mediaUploadErrorMessage(from(502, 'x')), /No se pudo guardar/)
  // El 503 del proxy (API caída) conserva su mensaje genérico.
  assert.equal(
    mediaUploadErrorMessage(from(503, 'sin conexión', 'El servicio no está disponible')),
    'sin conexión'
  )
})

test('toAdminApiError conserva el mensaje original de la API en `detail` sin mostrarlo', () => {
  const error = toAdminApiError({
    statusCode: 503,
    data: { message: 'El almacenamiento de imágenes no está configurado en el servidor' }
  })
  assert.match(error.message, /no puede conectarse/)
  assert.match(error.detail, /almacenamiento/)
  assert.match(mediaUploadErrorMessage(error), /almacenamiento de imágenes no está configurado/)
  assert.match(mediaUploadErrorMessage(toAdminApiError({ statusCode: 413 })), /5 MB/)
})

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las imágenes subidas se muestran sin optimizador (provider none) en sitio y panel', () => {
  for (const file of [
    'components/molecules/ImageWithFallback/ImageWithFallback.vue',
    'components/admin/portfolio/PortfolioImagePreview.vue'
  ]) {
    assert.match(read(file), /:provider="remote \? 'none' : undefined"/, file)
  }
})

test('la subida usa useAdminApi (nunca $fetch) y los campos usan el componente compartido', () => {
  assert.doesNotMatch(read('composables/useAdminMedia.ts'), /\$fetch/)
  assert.match(read('composables/useAdminMedia.ts'), /useAdminApi\(\)/)
  for (const file of [
    'components/admin/about/AboutImagesField.vue',
    'components/admin/portfolio/PortfolioEditor.vue',
    'components/admin/portfolio/PortfolioGalleryField.vue'
  ]) {
    assert.match(read(file), /<AdminImageUpload/, file)
  }
})
