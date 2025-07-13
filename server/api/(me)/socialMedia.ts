import { CACHE_EXP } from '~/constants/common/index.js'
import { model } from '../../utils/firebase-admin.ts'
type SocialMediaType = {
  id: string
  name: string
  link: string
  icon: string
  isHovered: boolean
}
type snapshotType = {
  id: string
  data: () => Partial<SocialMediaType>
}

export default defineCachedEventHandler(
  defineEventHandler(async (): Promise<SocialMediaType[]> => {
    const snapshot = await model.socialMedia.get()
    if (snapshot.empty) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No documents found in the SocialMedia collection'
      })
    }

    const data = snapshot.docs.map((doc: snapshotType) => ({
      id: doc.id,
      ...(doc.data() as Omit<SocialMediaType, 'id'>)
    })) as SocialMediaType[]

    return data
  }),
  {
    maxAge: CACHE_EXP,
    swr: true
  }
)
