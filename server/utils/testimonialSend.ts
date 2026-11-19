import { z } from 'zod'
import { normalizeBaseUrl } from './publicApiClient.ts'
import {
  buildTestimonialEmail,
  buildTestimonialLink,
  decideSendResult,
  type MailStatus,
  type TestimonialEmail,
  type TestimonialRequestData
} from './testimonialMail.ts'

/**
 * Crea (o renueva) una solicitud de testimonio en la API y envía el correo con el enlace único. Puro (sin
 * Nitro): recibe sus dependencias (llamada a la API con la sesión del panel y envío de correo) para poder
 * probarlo de punta a punta con dobles.
 *
 * Seguridad:
 * - Exige una sesión de administrador válida (se comprueba en la API con la cookie del panel).
 * - El enlace se arma con la URL pública configurada, nunca con datos de la petición.
 * - El token solo se devuelve (dentro del enlace) cuando el correo NO salió; nunca se registra en logs.
 */
export const MAX_SEND_BODY_BYTES = 8 * 1024

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform(value => (value ? value : undefined))

const expiresInDays = z.number().int().min(1).max(60).optional()

export const sendRequestSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('create'),
    clientId: z.uuid().optional(),
    clientName: z.string().trim().min(1).max(100),
    email: z.string().trim().max(254).pipe(z.email()),
    projectName: optionalText(150),
    message: optionalText(1000),
    expiresInDays
  }),
  z.object({ mode: z.literal('renew'), id: z.uuid(), expiresInDays })
])

export type SendRequestInput = z.infer<typeof sendRequestSchema>

export type ApiReply = { status: number; data: unknown }

/* eslint-disable no-unused-vars */
export type TestimonialSendDeps = {
  /** Llamada a `/api/admin/<segmentos>` de la API con la cookie de sesión del panel. */
  call: (method: 'GET' | 'POST', segments: string[], body?: unknown) => Promise<ApiReply>
  /** Envía el correo; nunca debe lanzar el contenido del correo ni el token en el error. */
  sendMail: (to: string, email: TestimonialEmail) => Promise<MailStatus>
  /** `true` si esta sesión/IP superó el límite de envíos (se llama después de validar la sesión). */
  isLimited: () => boolean
  baseUrl: string
}
/* eslint-enable no-unused-vars */

export type TestimonialSendResult =
  | { ok: true; body: ReturnType<typeof decideSendResult> }
  | { ok: false; status: 400 | 401 | 404 | 409 | 429 | 500 | 503; message: string }

const fail = (
  status: 400 | 401 | 404 | 409 | 429 | 500 | 503,
  message: string
): TestimonialSendResult => ({ ok: false, status, message })

const UNAVAILABLE = 'El panel no puede conectarse con el servidor ahora. Inténtalo de nuevo.'

/** Mensaje de la API (validación o conflicto) o el de respaldo. */
const apiMessage = (data: unknown, fallback: string) => {
  const message = (data as { message?: unknown } | null)?.message
  if (typeof message === 'string' && message.trim()) return message.trim()
  if (Array.isArray(message)) {
    const joined = message.filter(item => typeof item === 'string').join(' · ')
    if (joined) return joined
  }
  return fallback
}

const asRecord = (data: unknown): Record<string, unknown> | null =>
  data && typeof data === 'object' ? (data as Record<string, unknown>) : null

export const runTestimonialSend = async (
  deps: TestimonialSendDeps,
  input: SendRequestInput
): Promise<TestimonialSendResult> => {
  // Antes de generar ningún token: sin URL pública válida no se puede armar el enlace.
  if (!normalizeBaseUrl(deps.baseUrl)) {
    return fail(500, 'Falta configurar la URL pública del sitio (NUXT_PUBLIC_BASE_URL).')
  }

  // 1) Sesión de administrador válida.
  const session = await deps.call('GET', ['session'])
  if (session.status === 401 || session.status === 403) {
    return fail(401, 'Tu sesión terminó. Inicia sesión de nuevo.')
  }
  if (session.status !== 200) return fail(503, UNAVAILABLE)

  // 2) Límite de envíos (después de la sesión: quien no es admin no consume el cupo del admin).
  if (deps.isLimited()) {
    return fail(429, 'Demasiados envíos seguidos. Espera unos minutos e inténtalo de nuevo.')
  }

  // 3) Crear o renovar en la API: aquí se genera el token.
  let reply: ApiReply
  if (input.mode === 'create') {
    const { mode: _mode, ...body } = input
    void _mode
    reply = await deps.call('POST', ['testimonials'], body)
    if (reply.status === 401) return fail(401, 'Tu sesión terminó. Inicia sesión de nuevo.')
    if (reply.status === 400) return fail(400, apiMessage(reply.data, 'Revisa los datos.'))
    if (reply.status === 409) return fail(409, apiMessage(reply.data, 'El cliente no existe.'))
    if (reply.status !== 201) return fail(503, UNAVAILABLE)
  } else {
    // Para renovar hace falta el correo y el nombre: se leen antes de cambiar nada.
    const current = await deps.call('GET', ['testimonials', input.id])
    if (current.status === 404) return fail(404, 'La solicitud ya no existe.')
    if (current.status === 401) return fail(401, 'Tu sesión terminó. Inicia sesión de nuevo.')
    if (current.status !== 200) return fail(503, UNAVAILABLE)

    reply = await deps.call(
      'POST',
      ['testimonials', input.id, 'renew'],
      input.expiresInDays ? { expiresInDays: input.expiresInDays } : {}
    )
    if (reply.status === 401) return fail(401, 'Tu sesión terminó. Inicia sesión de nuevo.')
    if (reply.status === 404) return fail(404, 'La solicitud ya no existe.')
    if (reply.status === 409) {
      return fail(409, apiMessage(reply.data, 'Esta solicitud ya fue respondida.'))
    }
    if (reply.status === 400) return fail(400, apiMessage(reply.data, 'Revisa los datos.'))
    if (reply.status !== 200) return fail(503, UNAVAILABLE)
  }

  const request = asRecord(reply.data) as TestimonialRequestData | null
  const token = typeof request?.token === 'string' ? request.token : ''
  const link = buildTestimonialLink(deps.baseUrl, token)
  if (!request || !link) return fail(503, UNAVAILABLE)

  // 4) Correo con el enlace. Si falla, el panel recibe el enlace para copiarlo.
  const email = String(request.email ?? '')
  let mail: MailStatus
  try {
    mail = await deps.sendMail(
      email,
      buildTestimonialEmail({
        clientName: String(request.clientName ?? ''),
        projectName: typeof request.projectName === 'string' ? request.projectName : undefined,
        message: typeof request.message === 'string' ? request.message : undefined,
        link,
        expiresAt: String(request.expiresAt ?? '')
      })
    )
  } catch {
    mail = 'failed'
  }

  return { ok: true, body: decideSendResult({ request, link, mail, email }) }
}
