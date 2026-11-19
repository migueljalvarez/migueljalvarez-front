import { toAdminApiError } from '~/utils/adminApiError'
import {
  keysToDiscard,
  mediaKeyFromUrl,
  mediaResultSchema,
  mediaUploadErrorMessage,
  validateMediaFile,
  type MediaFolder,
  type MediaUploadOutcome
} from '~/utils/admin/media'

/**
 * Imágenes del panel (`/api/admin/media`, vía `useAdminApi`). `upload` valida en el navegador y sube; los
 * archivos que dejan de usarse se piden con `discardAfterSave` y se borran del almacenamiento con
 * `flushDiscards` solo cuando el contenido se guardó (así nunca se borra algo que el sitio aún muestra).
 */
export const useAdminMedia = () => {
  const api = useAdminApi()
  /** URLs subidas que el editor dejó de usar; compartidas entre campos y editor. */
  const pending = useState<string[]>('admin-media-discards', () => [])

  const upload = async (file: File, folder: MediaFolder): Promise<MediaUploadOutcome> => {
    const invalid = validateMediaFile(file)
    if (invalid) return { ok: false, message: invalid }
    const form = new FormData()
    form.append('folder', folder)
    form.append('file', file)
    try {
      const parsed = mediaResultSchema.safeParse(await api.post<unknown>('media', form))
      return parsed.success
        ? { ok: true, media: parsed.data }
        : { ok: false, message: 'La respuesta del servidor no es válida. Inténtalo de nuevo.' }
    } catch (error) {
      return { ok: false, message: mediaUploadErrorMessage(toAdminApiError(error)) }
    }
  }

  const remove = async (key: string): Promise<void> => {
    try {
      await api.del(`media?key=${encodeURIComponent(key)}`)
    } catch (error) {
      // Ya no existe = el objetivo está cumplido.
      if (toAdminApiError(error).status !== 404) throw error
    }
  }

  const discardAfterSave = (url: string) => {
    if (mediaKeyFromUrl(url) && !pending.value.includes(url)) pending.value.push(url)
  }
  const clearDiscards = () => {
    pending.value = []
  }
  /** Borra (sin interrumpir nada si falla) los archivos pedidos que ya no están en uso. */
  const flushDiscards = async (urlsInUse: string[]) => {
    const keys = keysToDiscard(pending.value, urlsInUse)
    pending.value = []
    await Promise.allSettled(keys.map(remove))
  }

  return { upload, remove, discardAfterSave, clearDiscards, flushDiscards }
}
