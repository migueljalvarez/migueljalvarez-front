import type {
  PublicTestimonialForm,
  TestimonialSubmission
} from '../../utils/testimonialSubmission.ts'
import type { ApiPostResult } from './publicApiClient.ts'

/**
 * Lado público del flujo de testimonios (enlace único del correo). Puro (sin Nitro): recibe el cliente
 * HTTP de la API y devuelve resultados, nunca lanza. El token vive solo en la ruta de la petición: no se
 * registra en logs ni se devuelve en ningún cuerpo.
 *
 * Seguridad: el mismo mensaje genérico para un enlace inexistente, vencido, mal formado o ya usado (no
 * permite averiguar qué tokens existen) y la IP real del visitante se reenvía para el límite de fallos.
 */
export const TESTIMONIAL_TOKEN = /^[A-Za-z0-9_-]{43}$/
export const INVALID_LINK_MESSAGE = 'Enlace no válido o vencido'
export const TOO_MANY_MESSAGE = 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
export const UNAVAILABLE_MESSAGE =
  'No pudimos conectar con el servidor. Inténtalo de nuevo en unos minutos.'
export const INVALID_DATA_MESSAGE = 'Revisa los datos del formulario e inténtalo de nuevo.'
/** Cuerpo máximo aceptado del envío (3000 caracteres de texto + campos cortos caben de sobra). */
export const MAX_SUBMISSION_BYTES = 16 * 1024

export type PublicFlowResult<T> =
  { ok: true; data: T } | { ok: false; status: 400 | 404 | 429 | 503; message: string }

/* eslint-disable no-unused-vars */
export type TestimonialPublicClient = {
  getResult: <T>(path: string, headers?: Record<string, string>) => Promise<ApiPostResult<T>>
  post: <T>(
    path: string,
    body: unknown,
    headers?: Record<string, string>
  ) => Promise<ApiPostResult<T>>
}
/* eslint-enable no-unused-vars */

const invalid = (): PublicFlowResult<never> => ({
  ok: false,
  status: 404,
  message: INVALID_LINK_MESSAGE
})

/** Traduce el estado de la API a un resultado seguro para el navegador. */
const failure = (status: number): PublicFlowResult<never> => {
  if (status === 429) return { ok: false, status: 429, message: TOO_MANY_MESSAGE }
  if (status === 400) return { ok: false, status: 400, message: INVALID_DATA_MESSAGE }
  // 404, 410 y cualquier otro 4xx: el enlace ya no sirve (mismo mensaje en todos los casos).
  if (status >= 400 && status < 500) return invalid()
  return { ok: false, status: 503, message: UNAVAILABLE_MESSAGE }
}

const text = (value: unknown) => (typeof value === 'string' ? value : '')

const ipHeaders = (clientIp: string) => ({ 'x-client-ip': clientIp.slice(0, 64) })

export const isValidTestimonialToken = (token: unknown): token is string =>
  typeof token === 'string' && TESTIMONIAL_TOKEN.test(token)

/** Abre el formulario: devuelve solo los datos mínimos que la API entrega (sin correo ni ids). */
export const openTestimonialForm = async (
  client: TestimonialPublicClient,
  token: string,
  clientIp: string
): Promise<PublicFlowResult<PublicTestimonialForm>> => {
  // Un token mal formado nunca llega a la API.
  if (!isValidTestimonialToken(token)) return invalid()

  const result = await client.getResult<Record<string, unknown>>(
    `/api/testimonials/requests/${token}`,
    ipHeaders(clientIp)
  )
  // Al abrir, un 400 solo puede significar un token mal formado: mismo mensaje genérico.
  if (!result.ok || !result.data) return failure(result.status === 400 ? 404 : result.status)

  const data = result.data
  return {
    ok: true,
    data: {
      clientName: text(data.clientName),
      projectName: text(data.projectName),
      message: text(data.message),
      expiresAt: text(data.expiresAt)
    }
  }
}

/** Envía el testimonio. La API valida de nuevo y garantiza que solo un envío por enlace gana. */
export const submitTestimonial = async (
  client: TestimonialPublicClient,
  token: string,
  submission: TestimonialSubmission,
  clientIp: string
): Promise<PublicFlowResult<null>> => {
  if (!isValidTestimonialToken(token)) return invalid()

  const result = await client.post<unknown>(
    `/api/testimonials/requests/${token}`,
    submission,
    ipHeaders(clientIp)
  )
  if (!result.ok) return failure(result.status)
  return { ok: true, data: null }
}
