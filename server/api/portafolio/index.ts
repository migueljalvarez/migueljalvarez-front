import type { PortafolioType } from '~/components/templates/templates'
import { CACHE_EXP } from '~/constants/common'
import { model } from '~/server/utils/firebase-admin.ts'
type SnapshotType = {
  id: string
  data: () => Partial<PortafolioType>
}

export default defineCachedEventHandler(
  defineEventHandler(async (): Promise<Omit<PortafolioType, 'images'>[]> => {
    try {
      const snapshot = await model.portfolio.limit(10).get()

      if (snapshot.empty) {
        throw createError({
          statusCode: 404,
          statusMessage: 'No documents found in the Portfolio collection'
        })
      }

      const data = snapshot.docs.map((doc: SnapshotType) => ({
        id: doc.id,
        ...(doc.data() as Omit<PortafolioType, 'id' | 'images'>)
      }))

      return data
    } catch (error) {
      const err = error as Error
      console.error('[API] Error en /api/portafolio:', err.message)

      const isGenerating = process.env.npm_lifecycle_event === 'generate'

      if (isGenerating) {
        // Retornar lista vacía durante prerender para evitar error 500
        return []
      }

      // Lanzar error en modo SSR o dev
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
