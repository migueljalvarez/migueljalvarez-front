import { Testimonial } from '~/types/common'
import { model } from '~/server/utils/firebase-admin.ts'

import { CACHE_EXP } from '~/constants/common'
type snapshotType = {
  id: string
  data: () => Partial<Testimonial>
}

export default defineCachedEventHandler(
  defineEventHandler(async _event => {
    const snapshot = await model.testimonial.limit(4).get()
    if (snapshot.empty) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No documents found in Testimonial collection'
      })
    }
    const data = snapshot.docs
      .map((doc: snapshotType) => ({
        id: doc.id,
        ...(doc.data() as Omit<Testimonial, 'id'>)
      }))
      .reverse() as Testimonial[]

    return data
    return [
      {
        name: 'Alfredo Rojas',
        position: 'Director de AR Stereo',
        description:
          'Un gran trabajo, me ayudo a salir de la zona de confort y a mejorar mis habilidades',
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
    ]
  }),
  {
    maxAge: CACHE_EXP,
    swr: true
  }
)
