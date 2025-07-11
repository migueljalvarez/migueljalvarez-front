import type { PortafolioType } from '~/types/common'

export default defineEventHandler(async event => {
  const storage = useStorage()
  const key = 'portfolio-item-cache'

  const cached = await storage.getItem(key)
  if (cached) {
    return cached
  }
  const portafolioId = getRouterParam(event, 'id')
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

  await storage.setItem(key, data)
  return
})
