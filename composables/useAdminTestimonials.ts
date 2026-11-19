import type { TestimonialRecord } from '~/utils/admin/testimonials'

/** Solicitudes de testimonio del panel. */
export const useAdminTestimonials = () => {
  const api = useAdminApi()
  return {
    list: (query: { limit: number; offset: number; status?: string }) =>
      api.get<{ items: TestimonialRecord[]; total: number }>('testimonials', query)
  }
}
