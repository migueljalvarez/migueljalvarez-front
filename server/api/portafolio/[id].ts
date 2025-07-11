import type { PortafolioType } from '~/types/common'

export default defineEventHandler(async event => {
  const portafolioId = getRouterParam(event, 'id') as string
  const storage = useStorage()

  const cached = await storage.getItem(portafolioId)
  if (cached) {
    return cached
  }

  if (!portafolioId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing portfolio ID'
    })
  }
  const doc = await model.portfolio.doc(portafolioId).get()
  if (!doc.exists) {
    throw createError({
      statusCode: 404,
      statusMessage: `Portfolio item with ID '${portafolioId}' not found`
    })
  }

  const data = {
    id: doc.id,
    ...(doc.data() as Omit<PortafolioType, 'id'>)
  }

  await storage.setItem(portafolioId, data)
  return data
})
