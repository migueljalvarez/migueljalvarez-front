import { dbAdmin } from '../../utils/firebase-admin.ts'
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
export default defineEventHandler(async (): Promise<SocialMediaType[]> => {
  const snapshot = await dbAdmin.collection('SocialMedia').get()
  if (snapshot.empty) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No documents found in the Me collection'
    })
  }

  return snapshot.docs.map((doc: snapshotType) => ({
    id: doc.id,
    ...(doc.data() as Omit<SocialMediaType, 'id'>)
  })) as SocialMediaType[]
})
