import {
  DESPENSA_PAGE_SIZE,
  parseFeedbackPage,
  parsePing,
  type DespensaFeedbackPage,
  type DespensaKind,
  type DespensaPing
} from '~/utils/despensa'
import { toAdminApiError } from '~/utils/adminApiError'

export type DespensaPingResult =
  { ok: true; ping: DespensaPing; simulated: boolean } | { ok: false; message: string }

export type DespensaFeedbackResult =
  { ok: true; page: DespensaFeedbackPage } | { ok: false; message: string }

// Los mensajes de estas rutas los escribe el propio sitio (llave rechazada, API apagada, límite, sin configurar):
// son específicos y seguros, así que se muestran en vez del texto genérico del panel.
const messageOf = (error: unknown) => {
  const apiError = toAdminApiError(error)
  return apiError.detail ?? apiError.message
}

/**
 * Comentarios de los usuarios de Mi Despensa. Las llamadas pasan por `useAdminApi` hacia las rutas propias del
 * sitio (`/api/admin/despensa/*`): la llave de esa API vive en el servidor y el navegador nunca la ve.
 */
export const useAdminDespensa = () => {
  const api = useAdminApi()

  const ping = async (): Promise<DespensaPingResult> => {
    try {
      const data = await api.get<Record<string, unknown>>('despensa/ping')
      const parsed = parsePing(data)
      return parsed
        ? { ok: true, ping: parsed, simulated: data.simulated === true }
        : { ok: false, message: 'La respuesta no tiene el formato esperado.' }
    } catch (error) {
      return { ok: false, message: messageOf(error) }
    }
  }

  const feedback = async (
    kind: DespensaKind | undefined,
    offset: number
  ): Promise<DespensaFeedbackResult & { simulated?: boolean }> => {
    try {
      const data = await api.get<Record<string, unknown>>('despensa/feedback', {
        kind,
        limit: DESPENSA_PAGE_SIZE,
        offset
      })
      const page = parseFeedbackPage(data)
      return page
        ? { ok: true, page, simulated: data.simulated === true }
        : { ok: false, message: 'La respuesta no tiene el formato esperado.' }
    } catch (error) {
      return { ok: false, message: messageOf(error) }
    }
  }

  return { ping, feedback }
}
