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
    try {
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
    } catch (error) {
      console.error('Error en /api/socia-media:', (error as Error).message)

      // Durante el prerender, retornamos fallback para evitar error 500
      if (process.env.npm_lifecycle_event === 'generate') {
        return [
          {
            id: '0',
            name: 'N/A',
            link: '',
            icon: '',
            isHovered: false
          }
        ] as unknown as SocialMediaType[]
      }

      // En entorno real: lanzar error
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al cargar el perfil'
      })
    }
  }),
  {
    maxAge: CACHE_EXP,
    swr: true
  }
)
