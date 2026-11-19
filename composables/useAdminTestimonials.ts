import type {
  RequestPayload,
  ReviewPayload,
  TestimonialFilter,
  TestimonialRecord,
  TestimonialSendResponse
} from '~/utils/admin/testimonials'
import { buildListQuery } from '~/utils/admin/testimonials'

/**
 * Acceso a las solicitudes de testimonio del panel (API `/api/admin/testimonials`). Todo pasa por
 * `useAdminApi`. Crear y renovar van por `/api/admin/testimonial-requests/send` (sitio): ese endpoint
 * genera el token, arma el enlace y envía el correo; el token nunca se guarda ni se lista.
 */
export const useAdminTestimonials = () => {
  const api = useAdminApi()

  return {
    list: (query: { limit: number; offset: number; status?: string }) =>
      api.get<{ items: TestimonialRecord[]; total: number }>('testimonials', query),
    page: (filter: TestimonialFilter, page: number) =>
      api.get<{ items: TestimonialRecord[]; total: number }>(
        'testimonials',
        buildListQuery(filter, page)
      ),
    get: (id: string) => api.get<TestimonialRecord>(`testimonials/${id}`),
    /** Crea la solicitud y envía el correo (o devuelve el enlace si el correo no pudo salir). */
    create: (payload: RequestPayload) =>
      api.post<TestimonialSendResponse>('testimonial-requests/send', payload),
    /** Token nuevo + plazo reiniciado + correo de nuevo. El enlace anterior deja de servir. */
    renew: (id: string, expiresInDays?: number) =>
      api.post<TestimonialSendResponse>('testimonial-requests/send', {
        mode: 'renew',
        id,
        ...(expiresInDays ? { expiresInDays } : {})
      }),
    review: (id: string, payload: ReviewPayload) =>
      api.post<TestimonialRecord>(`testimonials/${id}/review`, payload),
    remove: (id: string) => api.del(`testimonials/${id}`)
  }
}
