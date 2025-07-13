import { CACHE_EXP } from '~/constants/common'
import type { PortafolioType } from '~/types/common'

export default defineCachedEventHandler(
  defineEventHandler(async event => {
    const portafolioId = getRouterParam(event, 'id') as string

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

    return data
  }),
  {
    maxAge: CACHE_EXP,
    swr: true
  }
)
