import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY!)

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1)
})

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return createError({
      statusCode: 400,
      statusMessage: 'Datos inválidos'
    })
  }

  const { name, email, subject, message } = parsed.data

  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: [process.env.MAIL_TO!],
      replyTo: email,
      subject: `${subject}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5">
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong></p>
          <blockquote style="background: #f5f5f5; padding: 1em; border-left: 3px solid #ccc;">
            ${message.replace(/\n/g, '<br>')}
          </blockquote>
        </div>
      `
    })

    return { success: true }
  } catch (error) {
    console.error('Error al enviar correo con Resend:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'No se pudo enviar el correo'
    })
  }
})
