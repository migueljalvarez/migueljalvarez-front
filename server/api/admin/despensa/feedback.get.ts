import { parseFeedbackPage, parseFeedbackQuery } from '../../../../utils/despensa'
import { callDespensaFromEvent, requireAdminSession } from '../../../utils/despensaGateway'

/**
 * Comentarios de los usuarios de Mi Despensa (GET /admin/feedback de su API), solo lectura. Exige sesión de
 * administrador; valida el filtro y la paginación antes de llamar y la respuesta antes de devolverla.
 */
export default defineEventHandler(async event => {
  await requireAdminSession(event)
  const query = parseFeedbackQuery(getQuery(event))
  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Revisa el filtro y la paginación.'
    })
  }
  const { simulated, result } = await callDespensaFromEvent(event, '/feedback', query)
  if (!result.ok) {
    throw createError({
      statusCode: result.httpStatus,
      statusMessage: 'Error',
      message: result.message,
      data: { code: result.code }
    })
  }
  const page = parseFeedbackPage(result.data)
  if (!page) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Error',
      message: 'Mi Despensa respondió con un formato inesperado.',
      data: { code: 'down' }
    })
  }
  return { ...page, simulated }
})
