import { CACHE_EXP } from '~/constants/common/index.js'
import { model } from '../../utils/firebase-admin.ts'
type Me = {
  id: string
  name: string
  profession: string
  jobDescription: string
}
type snapshotType = {
  id: string
  data: () => Partial<Me>
}

export default defineCachedEventHandler(
  defineEventHandler(async (): Promise<Partial<Me>> => {
    const snapshot = await model.me.get()
    if (snapshot.empty) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No documents found in the Me collection'
      })
    }
    const data = snapshot.docs.map((doc: snapshotType) => ({
      id: doc.id,
      ...(doc.data() as Omit<Me, 'id'>)
    }))[0] as Me

    return data
  }),
  {
    maxAge: CACHE_EXP,
    swr: true
  }
)
