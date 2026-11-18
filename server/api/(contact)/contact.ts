import { Resend } from 'resend'
import { PRIVACY_UPDATED_AT } from '~/data/privacy'
import { processContact } from '../../utils/contactFlow'
import { contactSchema, SUBJECT_LABELS } from '../../utils/contactSchema'
import { saveLead } from '../../utils/leadIntake'
import { createPublicApiClient } from '../../utils/publicApiClient'

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
  const ip = getClientIp(event)

  if (isRateLimited(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Demasiados intentos. Inténtalo de nuevo más tarde.'
    })
  }

  const body = await readBody(event)
  const parsed = contactSchema.safeParse(body)

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

  const sendEmail = async () => {
    const resendApiKey = getServerSecret('resendApiKey', event)
    const mailFrom = getServerSecret('mailFrom', event)
    const mailTo = getServerSecret('mailTo', event)

    if (!resendApiKey || !mailFrom || !mailTo) {
      throw new Error('faltan RESEND_API_KEY, MAIL_FROM o MAIL_TO en la configuración')
    }

    const subjectLabel = SUBJECT_LABELS[subject]
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>')

    const resend = new Resend(resendApiKey)
    const { error } = await resend.emails.send({
      from: mailFrom,
      to: [mailTo],
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
  }

  // El lead se guarda en la API con el consentimiento y la versión de la política vigente en el servidor
  // (la versión no la decide el navegador). Nunca lanza: devuelve el resultado.
  const storeLead = () => {
    const id = getServerSecret('apiAccessClientId', event)
    const secret = getServerSecret('apiAccessClientSecret', event)
    const client = createPublicApiClient({
      baseUrl: getServerSecret('apiBaseUrl', event),
      timeoutMs: 3000,
      headers: id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {}
    })
    return saveLead(
      client,
      { name, email, subject, message, consent: true, consentPolicyVersion: PRIVACY_UPDATED_AT },
      { intakeKey: getServerSecret('intakeApiKey', event) }
    )
  }

  try {
    const result = await processContact({ sendEmail, saveLead: storeLead })

    // Registro sin datos personales: solo el estado de cada canal.
    if (!result.emailSent) {
      console.error(
        `[contact] correo NO enviado; el mensaje quedó guardado en la API (${result.lead})`
      )
    } else if (result.lead !== 'saved' && result.lead !== 'duplicate') {
      console.warn(`[contact] correo enviado; el lead no se guardó en la API (${result.lead})`)
    }

    return { success: true }
  } catch (error) {
    console.error('[contact] no se pudo capturar el mensaje:', (error as Error).message)
    throw createError({
      statusCode: 500,
      statusMessage: 'No se pudo enviar el correo'
    })
  }
})
