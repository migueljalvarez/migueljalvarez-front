import { z } from 'zod'
import { isRemoteImageUrl } from '../imageSource.ts'

/**
 * Lógica pura (sin Nuxt) de la subida de imágenes del panel. Las reglas coinciden con la API
 * (`POST/DELETE /api/admin/media`, docs/openapi-panel.yaml): lo que aquí es válido, la API lo acepta.
 */

export const MEDIA_MAX_BYTES = 5 * 1024 * 1024
export const MEDIA_MAX_MB = 5
export const MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
/** Para el atributo `accept` del selector de archivos. */
export const MEDIA_ACCEPT = MEDIA_TYPES.join(',')

export type MediaFolder = 'about' | 'projects' | 'misc'

/** Clave de un archivo subido: `<carpeta>/<uuid>.webp` (la URL pública es `<dominio>/<clave>`). */
const MEDIA_KEY_RE =
  /^(about|projects|misc)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/

/** Respuesta de `POST /api/admin/media`. */
export const mediaResultSchema = z.object({
  url: z.string().refine(isRemoteImageUrl, 'URL de imagen no válida'),
  key: z.string().regex(MEDIA_KEY_RE),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  bytes: z.number().int().positive()
})
export type MediaResult = z.infer<typeof mediaResultSchema>

export type MediaUploadOutcome = { ok: true; media: MediaResult } | { ok: false; message: string }

export const formatBytes = (bytes: number): string =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`

/** Comprobación previa en el navegador (la API vuelve a validar): ahorra una subida inútil. */
export const validateMediaFile = (file: { type: string; size: number }): string | null => {
  if (!(MEDIA_TYPES as readonly string[]).includes(file.type)) {
    return 'Ese archivo no es una imagen válida. Elige un JPEG, PNG o WebP.'
  }
  if (file.size <= 0) return 'El archivo está vacío.'
  if (file.size > MEDIA_MAX_BYTES) {
    return `La imagen pesa ${formatBytes(file.size)} y supera el máximo de ${MEDIA_MAX_MB} MB. Elige una más liviana.`
  }
  return null
}

/** Clave de almacenamiento de una URL subida desde el panel, o `null` si no lo es (p. ej. `/about/a.webp`). */
export const mediaKeyFromUrl = (url: string): string | null => {
  if (!isRemoteImageUrl(url)) return null
  try {
    const key = decodeURIComponent(new URL(url).pathname.replace(/^\//, ''))
    return MEDIA_KEY_RE.test(key) ? key : null
  } catch {
    return null
  }
}

type ErrorLike = { status: number; message: string; detail?: string }

/** Mensaje en español para un fallo de subida, según el estado de la respuesta. */
export const mediaUploadErrorMessage = (error: ErrorLike): string => {
  if (error.status === 413) {
    return `La imagen supera los ${MEDIA_MAX_MB} MB. Elige una más liviana.`
  }
  if (error.status === 400) return error.message
  if (error.status === 415) return 'Ese tipo de archivo no es válido. Elige un JPEG, PNG o WebP.'
  if (error.status === 503 && /almacenamiento/i.test(error.detail ?? '')) {
    return 'El almacenamiento de imágenes no está configurado en el servidor. Mientras tanto, escribe la ruta o la URL de la imagen a mano.'
  }
  if (error.status === 502 || /almacenamiento/i.test(error.detail ?? '')) {
    return 'No se pudo guardar la imagen en el almacenamiento. Inténtalo de nuevo en unos minutos.'
  }
  return error.message
}

/**
 * Claves de archivos subidos que se pueden borrar tras guardar: las pedidas, sin repetir y sin las que
 * el contenido guardado sigue usando (nunca se borra una imagen en uso).
 */
export const keysToDiscard = (queuedUrls: string[], urlsInUse: string[]): string[] => {
  const inUse = new Set(urlsInUse.map(mediaKeyFromUrl).filter(Boolean))
  const keys = queuedUrls.map(mediaKeyFromUrl).filter((key): key is string => key !== null)
  return [...new Set(keys)].filter(key => !inUse.has(key))
}
