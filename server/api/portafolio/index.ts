import type { PortafolioType } from '~/components/templates/templates'
import { CACHE_EXP } from '~/constants/common'
import { model } from '~/server/utils/firebase-admin.ts'

type snapshotType = {
  id: string
  data: () => Partial<PortafolioType>
}

export default defineCachedEventHandler(
  defineEventHandler(async (_event): Promise<Omit<PortafolioType, 'images'>[]> => {
    const snapshot = await model.portfolio.limit(10).get()
    if (snapshot.empty) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No documents found in the Porfolio collection'
      })
    }
    const data = snapshot.docs.map((doc: snapshotType) => ({
      id: doc.id,
      ...(doc.data() as Omit<PortafolioType, 'id'>)
    })) as PortafolioType[]

    return data
  }),
  {
    maxAge: CACHE_EXP,
    swr: true
  }
)
