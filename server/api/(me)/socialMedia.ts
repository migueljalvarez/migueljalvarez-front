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
export default defineEventHandler(async (): Promise<SocialMediaType[]> => {
  const storage = useStorage()
  const key = 'social-media-cache'

  const cached = (await storage.getItem(key)) as SocialMediaType[]
  if (cached) {
    return cached
  }
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

  await storage.setItem(key, data)
  return data
})
