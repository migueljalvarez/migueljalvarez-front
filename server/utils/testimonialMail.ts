import { normalizeBaseUrl } from './publicApiClient.ts'
import { TESTIMONIAL_TOKEN } from './testimonialPublic.ts'

/**
 * Enlace y correo de la solicitud de testimonio. Puro (sin Nitro) para poder probarlo. El correo es
 * texto + HTML escapado, en primera persona, sin imágenes remotas ni pixeles de seguimiento.
 */
export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Ruta pública del formulario (la URL en español es por SEO/claridad; el archivo está en inglés). */
export const TESTIMONIAL_PUBLIC_PATH = '/testimonio'

/**
 * Enlace único. La base sale SIEMPRE de la configuración (`NUXT_PUBLIC_BASE_URL`), nunca de `window`
 * ni de cabeceras de la petición. Devuelve `null` si la base no es una URL http(s) o el token no es válido.
 */
export const buildTestimonialLink = (baseUrl: string, token: string): string | null => {
  const base = normalizeBaseUrl(baseUrl)
  if (!base || !TESTIMONIAL_TOKEN.test(token)) return null
  return `${base}${TESTIMONIAL_PUBLIC_PATH}/${token}`
}

const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim()

const formatExpiry = (iso: string) => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Bogota'
      })
}

export type TestimonialEmailInput = {
  clientName: string
  projectName?: string
  message?: string
  link: string
  expiresAt: string
}

export type TestimonialEmail = { subject: string; html: string; text: string }

export const buildTestimonialEmail = (input: TestimonialEmailInput): TestimonialEmail => {
  const name = oneLine(input.clientName)
  const firstName = name.split(' ')[0] || name
  const project = oneLine(input.projectName ?? '')
  const personal = (input.message ?? '').replace(/\r\n?/g, '\n').trim()
  const expiry = formatExpiry(input.expiresAt)

  // El asunto va en una sola línea: un salto de línea en un dato del cliente no puede inyectar cabeceras.
  const subject = oneLine(`${firstName}, ¿me cuentas cómo fue trabajar juntos?`)

  const intro = project
    ? `Gracias por confiarme «${project}». Me ayudaría mucho que me cuentes, con tus palabras, cómo fue trabajar juntos.`
    : 'Gracias por confiar en mi trabajo. Me ayudaría mucho que me cuentes, con tus palabras, cómo fue trabajar juntos.'
  const how =
    'Son un par de minutos. Solo se publica con tu autorización expresa, que te pediré en el mismo formulario.'
  const expiryLine = expiry ? `El enlace funciona hasta el ${expiry}.` : ''
  const ignore = 'Si no esperabas este correo, puedes ignorarlo: no pasa nada.'

  const text = [
    `Hola, ${firstName}:`,
    '',
    intro,
    ...(personal ? ['', personal] : []),
    '',
    how,
    '',
    `Escríbelo aquí: ${input.link}`,
    ...(expiryLine ? ['', expiryLine] : []),
    '',
    ignore,
    '',
    'Un abrazo,',
    'Miguel'
  ].join('\n')

  const p = 'margin:0 0 16px;font-size:16px;line-height:1.6;color:#121e30'
  const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #d9e0ea;border-radius:16px;padding:32px">
      <p style="${p}">Hola, ${escapeHtml(firstName)}:</p>
      <p style="${p}">${escapeHtml(intro)}</p>
      ${
        personal
          ? `<blockquote style="margin:0 0 16px;padding:12px 16px;border-left:4px solid #3f6bad;background:#f5f7fa;color:#121e30;font-size:16px;line-height:1.6">${escapeHtml(personal).replace(/\n/g, '<br>')}</blockquote>`
          : ''
      }
      <p style="${p}">${escapeHtml(how)}</p>
      <p style="margin:24px 0">
        <a href="${escapeHtml(input.link)}" style="display:inline-block;background:#243b62;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 24px;border-radius:8px">Escribir mi testimonio</a>
      </p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4d5868">Si el botón no funciona, copia este enlace en tu navegador:<br>${escapeHtml(input.link)}</p>
      ${expiryLine ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4d5868">${escapeHtml(expiryLine)}</p>` : ''}
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4d5868">${escapeHtml(ignore)}</p>
      <p style="margin:0;font-size:16px;line-height:1.6;color:#121e30">Un abrazo,<br>Miguel</p>
    </div>
  </body>
</html>`

  return { subject, html, text }
}

export type MailStatus = 'sent' | 'not-configured' | 'failed'

export type TestimonialRequestData = Record<string, unknown> & { token?: string }

/**
 * Resultado para el panel. El token solo sale (dentro de `link`) cuando el correo NO salió, para que
 * Miguel pueda copiar el enlace y enviarlo por otro canal; si el correo salió, la respuesta no lo lleva.
 */
export const decideSendResult = (input: {
  request: TestimonialRequestData
  link: string
  mail: MailStatus
  email: string
}) => {
  // El token nunca sale en `request`: solo dentro de `link` y solo si el correo no salió.
  const request: TestimonialRequestData = { ...input.request }
  delete request.token
  if (input.mail === 'sent') {
    return { request, mail: input.mail, notice: `Correo enviado a ${input.email}.` }
  }
  const notice =
    input.mail === 'not-configured'
      ? 'El envío de correo no está configurado en este servidor. Copia el enlace y envíaselo al cliente.'
      : 'No se pudo enviar el correo. Copia el enlace y envíaselo al cliente.'
  return { request, mail: input.mail, link: input.link, notice }
}
