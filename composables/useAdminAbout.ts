import { toAdminApiError } from '~/utils/adminApiError'
import {
  buildAboutPayload,
  buildAboutSteps,
  type AboutAdminRecord,
  type AboutFormValues,
  type AboutImageRecord
} from '~/utils/admin/about'

export type AboutSaveResult =
  | { ok: true; record: AboutAdminRecord }
  | {
      ok: false
      /** Mensaje de la API, tal cual (ya en español). */
      message: string
      /** Pasos que sí se aplicaron antes del fallo (si es > 0, `record` trae lo que quedó guardado). */
      applied: number
      record: AboutAdminRecord | null
    }

/**
 * Acceso a datos de "Sobre mí" del panel: envoltorio fino sobre `useAdminApi` (nunca `$fetch`). El
 * contenido y las imágenes tienen endpoints distintos; `save` lleva la API hasta lo que hay en pantalla
 * con los pasos de `buildAboutSteps` (en el orden que respeta las reglas de la API) y devuelve el
 * contenido tal como quedó.
 */
export const useAdminAbout = () => {
  const api = useAdminApi()

  const load = () => api.get<AboutAdminRecord>('about')

  const save = async (
    saved: AboutFormValues,
    current: AboutFormValues
  ): Promise<AboutSaveResult> => {
    const steps = buildAboutSteps(saved, current)
    let applied = 0
    try {
      for (const step of steps) {
        if (step.kind === 'save-content') {
          await api.put<AboutAdminRecord>('about', buildAboutPayload(current))
        } else if (step.kind === 'add-image') {
          await api.post<AboutImageRecord>('about/images', step.body)
        } else if (step.kind === 'update-image') {
          await api.patch<AboutImageRecord>(`about/images/${step.id}`, step.changes)
        } else {
          await api.del(`about/images/${step.id}`)
        }
        applied += 1
      }
      return { ok: true, record: await load() }
    } catch (error) {
      const message = toAdminApiError(error).message
      let record: AboutAdminRecord | null = null
      if (applied > 0) record = await load().catch(() => null)
      return { ok: false, message, applied, record }
    }
  }

  return { load, save }
}
