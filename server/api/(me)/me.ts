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
    try {
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
    } catch (error) {
      console.error('Error en /api/me:', (error as Error).message)

      // Durante el prerender, retornamos fallback para evitar error 500
      if (process.env.npm_lifecycle_event === 'generate') {
        return {
          id: '0',
          name: 'Desconocido',
          profession: 'N/A',
          jobDescription: 'Contenido no disponible'
        }
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
