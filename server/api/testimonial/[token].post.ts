import { createPublicApiClient } from '../../utils/publicApiClient'
import { testimonialSubmissionSchema } from '../../../utils/testimonialSubmission'
import {
  INVALID_DATA_MESSAGE,
  MAX_SUBMISSION_BYTES,
  submitTestimonial
} from '../../utils/testimonialPublic'

/**
 * Envío del testimonio desde el enlace único. Valida con Zod y con un límite de cuerpo antes de llamar a
 * la API (que vuelve a validar). Responde 204 sin cuerpo. El token nunca se escribe en logs.
 */
export default defineEventHandler(async event => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const raw = (await readRawBody(event, 'utf8')) ?? ''
  if (Buffer.byteLength(raw) > MAX_SUBMISSION_BYTES) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Payload Too Large',
      message: 'El texto es demasiado largo.'
    })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: INVALID_DATA_MESSAGE
    })
  }
  const parsed = testimonialSubmissionSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: parsed.error.issues[0]?.message ?? INVALID_DATA_MESSAGE
    })
  }

  const id = getServerSecret('apiAccessClientId', event)
  const secret = getServerSecret('apiAccessClientSecret', event)
  const client = createPublicApiClient({
    baseUrl: getServerSecret('apiBaseUrl', event),
    timeoutMs: 5000,
    headers: id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {}
  })

  const result = await submitTestimonial(
    client,
    getRouterParam(event, 'token') ?? '',
    parsed.data,
    getClientIp(event)
  )
  if (!result.ok) {
    throw createError({
      statusCode: result.status,
      statusMessage: 'Error',
      message: result.message
    })
  }
  setResponseStatus(event, 204)
  return null
})
