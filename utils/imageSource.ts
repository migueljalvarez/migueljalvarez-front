/**
 * Orígenes válidos de una imagen del contenido editable (Sobre mí, portafolio): una ruta del propio sitio
 * (`/about/miguel.webp`) o la URL https de una imagen subida desde el panel (almacenamiento R2). Puro (sin
 * Nuxt) para poder probarlo y compartirlo entre el mapeo público y el panel.
 */

const SITE_IMAGE_RE = /^\/(?!\/)[A-Za-z0-9_\-./]+\.(webp|jpe?g|png)$/
/** https, host sin credenciales, sin consulta ni fragmento y con extensión de imagen. */
const REMOTE_IMAGE_RE = /^https:\/\/[A-Za-z0-9.-]+(:\d{1,5})?\/[^\s<>"'\?#]*\.(webp|jpe?g|png)$/i
const MAX_LENGTH = 300

export const isSiteImagePath = (value: unknown): value is string =>
  typeof value === 'string' && SITE_IMAGE_RE.test(value) && !value.includes('..')

export const isRemoteImageUrl = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length <= MAX_LENGTH &&
  REMOTE_IMAGE_RE.test(value) &&
  !value.split('/').slice(3).includes('..')

/** Ruta del sitio o URL https de una imagen. */
export const isImageSource = (value: unknown): value is string =>
  isSiteImagePath(value) || isRemoteImageUrl(value)
