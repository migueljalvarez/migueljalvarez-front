import {
  phaseFromStatus,
  type PublicTestimonialForm,
  type TestimonialPhase,
  type TestimonialSubmission
} from '~/utils/testimonialSubmission'

type FetchErrorLike = { statusCode?: number; status?: number; data?: { message?: unknown } | null }

/**
 * Formulario público de testimonio (enlace único del correo). Las llamadas van al servidor del sitio
 * (`/api/testimonial/<token>`), que habla con la API: el navegador nunca la llama directamente. Sin
 * reintentos automáticos: cada fallo cuenta para el límite por IP de la API.
 */
export const useTestimonialRequest = async (token: string) => {
  const { data, error, refresh, status } = await useFetch<PublicTestimonialForm>(
    `/api/testimonial/${token}`,
    // La clave no incluye el token: no viaja en el payload de SSR más que en la ruta.
    { key: 'testimonial-form', retry: false, default: () => null }
  )

  const loadPhase = computed<TestimonialPhase | null>(() =>
    error.value
      ? phaseFromStatus((error.value as FetchErrorLike).statusCode ?? error.value.statusCode)
      : null
  )

  /** Envía el testimonio. Devuelve `null` si salió bien, o la fase/mensaje para mostrar. */
  const submit = async (
    body: TestimonialSubmission
  ): Promise<null | { phase: TestimonialPhase; message: string }> => {
    try {
      await $fetch(`/api/testimonial/${token}`, { method: 'POST', body, retry: false })
      return null
    } catch (failure) {
      const source = (failure ?? {}) as FetchErrorLike
      const code = source.statusCode ?? source.status
      const message = source.data?.message
      return {
        phase: phaseFromStatus(code),
        message:
          (code === 400 || code === 429) && typeof message === 'string'
            ? message
            : 'No pudimos enviar tu testimonio. Lo que escribiste sigue aquí: inténtalo de nuevo.'
      }
    }
  }

  return {
    form: data,
    loadPhase,
    pending: computed(() => status.value === 'pending'),
    refresh,
    submit
  }
}
