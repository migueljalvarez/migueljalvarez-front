import type { Testimonial } from '~/types/common'
import { model } from '~/server/utils/firebase-admin'
import { CACHE_EXP } from '~/constants/common'

type SnapshotType = {
  id: string
  data: () => Partial<Testimonial>
}

export default defineCachedEventHandler(
  defineEventHandler(async (): Promise<Testimonial[]> => {
    try {
      const snapshot = await model.testimonial.limit(4).get()

      // Sin testimonios aprobados: lista vacía (la landing oculta la sección).
      if (snapshot.empty) return []

      const data = snapshot.docs
        .map((doc: SnapshotType) => ({
          id: doc.id,
          ...(doc.data() as Omit<Testimonial, 'id'>)
        }))
        .reverse()

      return data
    } catch (error) {
      const err = error as Error
      console.error('[API] Error en /api/testimonials:', err.message)

      throw createError({
        statusCode: 500,
        statusMessage: 'Error interno al obtener testimonios'
      })
    }
  }),
  {
    maxAge: CACHE_EXP,
    swr: true
  }
)
