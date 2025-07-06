import { dbAdmin } from '../../utils/firebase-admin.ts'
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
export default defineEventHandler(async (): Promise<Partial<Me>> => {
  const snapshot = await dbAdmin.collection('Me').get()
  if (snapshot.empty) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No documents found in the Me collection'
    })
  }
  return snapshot.docs.map((doc: snapshotType) => ({
    id: doc.id,
    ...(doc.data() as Omit<Me, 'id'>)
  }))[0] as Me
})
