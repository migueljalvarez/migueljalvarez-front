import { Resend } from 'resend'
import { z } from 'zod'

const SUBJECT_LABELS = {
  desarrollo: 'Desarrollo',
  oferta: 'Oferta',
  consulta: 'Consulta',
  soporte: 'Soporte',
  otro: 'Otro'
} as const

// Honeypot: el campo `website` está oculto para personas; si llega con texto es un bot.
const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(254).pipe(z.email()),
  subject: z.enum(Object.keys(SUBJECT_LABELS) as [keyof typeof SUBJECT_LABELS]),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(200).optional()
})

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// Límite en memoria por IP. En despliegues serverless cada instancia lleva su propio contador;
// es una defensa básica, no sustituye un rate limit del proveedor (TODO: revisar en S2+).
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const attempts = new Map<string, number[]>()

const isRateLimited = (key: string) => {
  const now = Date.now()
  const recent = (attempts.get(key) ?? []).filter(time => now - time < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX) {
    attempts.set(key, recent)
    return true
  }

  recent.push(now)
  attempts.set(key, recent)

  // Evita que el mapa crezca sin límite.
  if (attempts.size > 1000) {
    for (const [ip, times] of attempts) {
      if (times.every(time => now - time >= RATE_LIMIT_WINDOW_MS)) attempts.delete(ip)
    }
  }

  return false
}

export default defineEventHandler(async event => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'desconocida'

  if (isRateLimited(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Demasiados intentos. Inténtalo de nuevo más tarde.'
    })
  }

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos inválidos'
    })
  }

  const { name, email, subject, message, website } = parsed.data

  // Bot detectado: respondemos igual que en un envío correcto para no dar pistas.
  if (website) {
    return { success: true }
  }

  const config = useRuntimeConfig(event)

  if (!config.resendApiKey || !config.mailFrom || !config.mailTo) {
    console.error('Contacto: faltan RESEND_API_KEY, MAIL_FROM o MAIL_TO en la configuración')
    throw createError({
      statusCode: 500,
      statusMessage: 'No se pudo enviar el correo'
    })
  }

  const subjectLabel = SUBJECT_LABELS[subject]
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>')

  try {
    const resend = new Resend(config.resendApiKey)
    const { error } = await resend.emails.send({
      from: config.mailFrom,
      to: [config.mailTo],
      replyTo: email,
      subject: `Contacto web: ${subjectLabel}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5">
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Asunto:</strong> ${subjectLabel}</p>
          <p><strong>Mensaje:</strong></p>
          <blockquote style="background: #f5f5f5; padding: 1em; border-left: 3px solid #ccc;">
            ${safeMessage}
          </blockquote>
        </div>
      `,
      text: `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subjectLabel}\n\n${message}`
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error('Error al enviar correo con Resend:', (error as Error).message)
    throw createError({
      statusCode: 500,
      statusMessage: 'No se pudo enviar el correo'
    })
  }
})
