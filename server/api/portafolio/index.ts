import type { PortafolioType } from '~/components/templates/templates'
import { model } from '~/server/utils/firebase-admin.ts'

type snapshotType = {
  id: string
  data: () => Partial<PortafolioType>
}

export default defineEventHandler(async (_event): Promise<Omit<PortafolioType, 'images'>[]> => {
  const storage = useStorage()
  const key = 'portfolio-cache'

  const cached = (await storage.getItem(key)) as Omit<PortafolioType, 'images'>[]
  if (cached) {
    return cached
  }
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
  await storage.setItem(key, data)
  return data
})
