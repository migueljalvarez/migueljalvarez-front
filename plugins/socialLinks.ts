import type { SocialMediaType } from '~/types/common'

/**
 * Carga las redes sociales una sola vez al arrancar (en el servidor durante el SSR) y las deja en el
 * estado compartido, para que Header y Contact las lean de forma síncrona sin parpadeo. El estado
 * viaja serializado al cliente: no hay una segunda petición.
 */
export default defineNuxtPlugin(async () => {
  const links = useState<SocialMediaType[]>('social-links', () => [])
  if (links.value.length === 0) {
    links.value = await $fetch<SocialMediaType[]>('/api/social-links').catch(() => [])
  }
})
