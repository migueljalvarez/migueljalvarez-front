/**
 * Crea o renueva una solicitud de testimonio y envía el correo con el enlace único (Resend). Es un archivo
 * específico: tiene prioridad sobre el proxy genérico `server/api/admin/[...path].ts`.
 *
 * Exige sesión de administrador (se valida en la API con la cookie `admin_session`) y `Origin` del propio
 * sitio. El token y la clave de Resend nunca se escriben en logs.
 */
import { Resend } from 'resend'
import { proxyAdminRequest } from '../../../utils/adminProxy'
import { createRateLimiter } from '../../../utils/rateLimit'
import { isAllowedOrigin } from '../../../utils/testimonialOrigin'
import {
  MAX_SEND_BODY_BYTES,
  runTestimonialSend,
  sendRequestSchema
} from '../../../utils/testimonialSend'

// 10 envíos cada 10 minutos por IP: de sobra para uso real, estorba a quien abuse de una sesión robada.
const limiter = createRateLimiter({ max: 10, windowMs: 10 * 60 * 1000 })

export default defineEventHandler(async event => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  if (
    !isAllowedOrigin(getRequestHeader(event, 'origin'), [
      getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin,
      String(useRuntimeConfig(event).public.baseUrl || '')
    ])
  ) {
    throw createError({ statusCode: 403, statusMessage: 'Origen no permitido' })
  }

  const raw = (await readRawBody(event, 'utf8')) ?? ''
  if (Buffer.byteLength(raw) > MAX_SEND_BODY_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Cuerpo demasiado grande' })
  }
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Datos inválidos.'
    })
  }
  const parsed = sendRequestSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Revisa los datos de la solicitud.'
    })
  }

  const id = getServerSecret('apiAccessClientId', event)
  const secret = getServerSecret('apiAccessClientSecret', event)
  const proxyOptions = {
    baseUrl: getServerSecret('apiBaseUrl', event),
    headers: id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {}
  }
  const cookie = getRequestHeader(event, 'cookie')
  const clientIp = getClientIp(event)
  const userAgent = getRequestHeader(event, 'user-agent')

  const resendApiKey = getServerSecret('resendApiKey', event)
  const mailFrom = getServerSecret('mailFrom', event)
  // En desarrollo no se envía correo real salvo que se pida (TESTIMONIAL_MAIL_DEV=true): así una clave
  // de Resend en el .env no manda mensajes a clientes de ejemplo.
  const mailEnabled =
    !!resendApiKey &&
    !!mailFrom &&
    (!import.meta.dev || process.env.TESTIMONIAL_MAIL_DEV === 'true')

  const result = await runTestimonialSend(
    {
      baseUrl: String(useRuntimeConfig(event).public.baseUrl || ''),
      isLimited: () => limiter.isLimited(clientIp),
      call: async (method, segments, payload) => {
        const reply = await proxyAdminRequest(proxyOptions, {
          method,
          segments,
          body: payload === undefined ? undefined : JSON.stringify(payload),
          cookie,
          clientIp,
          userAgent
        })
        let data: unknown = null
        try {
          data = reply.body ? JSON.parse(reply.body) : null
        } catch {
          data = null
        }
        return { status: reply.status, data }
      },
      sendMail: async (to, email) => {
        if (!mailEnabled) return 'not-configured'
        const { error } = await new Resend(resendApiKey).emails.send({
          from: mailFrom,
          to: [to],
          subject: email.subject,
          html: email.html,
          text: email.text
        })
        if (error) {
          // Solo el tipo de error: sin destinatario, sin enlace, sin token.
          console.error(`[testimonials] correo no enviado (${error.name})`)
          return 'failed'
        }
        return 'sent'
      }
    },
    parsed.data
  )

  if (!result.ok) {
    throw createError({
      statusCode: result.status,
      statusMessage: 'Error',
      message: result.message
    })
  }
  return result.body
})
