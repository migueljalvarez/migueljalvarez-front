import { CACHE_EXP } from '~/constants/common'
import type { PortafolioType } from '~/types/common'
import { model } from '~/server/utils/firebase-admin.ts'
export default defineCachedEventHandler(
  defineEventHandler(async event => {
    try {
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
    } catch (error) {
      const err = error as Error
      console.error(`[API] Error en /api/portafolio/[id]:`, err.message)

      const isGenerating = process.env.npm_lifecycle_event === 'generate'

      if (isGenerating) {
        // Evita romper `nuxt generate`, pero no devuelvas datos inválidos
        return null
      }

      // En modo normal (dev o SSR), propaga el error para que el layout de error lo capture
      throw createError({
        statusCode: 500,
        statusMessage: 'Error interno al obtener portafolio'
      })
    }
  }),
  {
    maxAge: CACHE_EXP,
    swr: true
  }
)
