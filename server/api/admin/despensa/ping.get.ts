import { parsePing } from '../../../../utils/despensa'
import { callDespensaFromEvent, requireAdminSession } from '../../../utils/despensaGateway'

/**
 * «Probar conexión» con Mi Despensa (GET /admin/ping de su API). Solo para administradores con sesión: la llave
 * de esa API vive en el servidor (MI_DESPENSA_ADMIN_KEY) y nunca llega al navegador.
 */
export default defineEventHandler(async event => {
  await requireAdminSession(event)
  const { simulated, result } = await callDespensaFromEvent(event, '/ping', undefined)
  if (!result.ok) {
    throw createError({
      statusCode: result.httpStatus,
      statusMessage: 'Error',
      message: result.message,
      data: { code: result.code }
    })
  }
  const ping = parsePing(result.data)
  if (!ping) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Error',
      message: 'Mi Despensa respondió con un formato inesperado.',
      data: { code: 'down' }
    })
  }
  return { ...ping, simulated }
})
