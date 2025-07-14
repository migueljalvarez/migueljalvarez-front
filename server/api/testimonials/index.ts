import type { Testimonial } from '~/types/common'
import { model } from '~/server/utils/firebase-admin.ts'
import { CACHE_EXP } from '~/constants/common'

type SnapshotType = {
  id: string
  data: () => Partial<Testimonial>
}

export default defineCachedEventHandler(
  defineEventHandler(async (): Promise<Testimonial[]> => {
    try {
      const snapshot = await model.testimonial.limit(4).get()

      if (snapshot.empty) {
        throw createError({
          statusCode: 404,
          statusMessage: 'No documents found in Testimonial collection'
        })
      }

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

      const isGenerating = process.env.npm_lifecycle_event === 'generate'

      if (isGenerating) {
        return [
          {
            id: 'fallback-1',
            name: 'Alfredo Rojas',
            position: 'Director de AR Stereo',
            testimonial:
              'Un gran trabajo, me ayudó a salir de la zona de confort y a mejorar mis habilidades.',
            image: '/alfredo-rojas.webp',
            type: 'Cliente',
            socialMedia: [
              {
                name: 'Instagram',
                link: '',
                icon: 'mdi:instagram',
                isHovered: false
              }
            ]
          }
        ] as Testimonial[]
      }

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
