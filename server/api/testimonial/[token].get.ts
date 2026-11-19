import { createPublicApiClient } from '../../utils/publicApiClient'
import { openTestimonialForm } from '../../utils/testimonialPublic'

/**
 * Datos mínimos del formulario de testimonio para el enlace único. La llamada a la API se hace solo desde
 * aquí (Nitro); el token nunca se escribe en logs ni se guarda en caché.
 */
export default defineEventHandler(async event => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const id = getServerSecret('apiAccessClientId', event)
  const secret = getServerSecret('apiAccessClientSecret', event)
  const client = createPublicApiClient({
    baseUrl: getServerSecret('apiBaseUrl', event),
    timeoutMs: 5000,
    headers: id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {}
  })

  const result = await openTestimonialForm(
    client,
    getRouterParam(event, 'token') ?? '',
    getClientIp(event)
  )
  if (!result.ok) {
    throw createError({
      statusCode: result.status,
      statusMessage: 'Error',
      message: result.message
    })
  }
  return result.data
})
