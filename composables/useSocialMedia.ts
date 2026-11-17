import { MY_SOCIAL_MEDIA } from '~/constants/common'
import type { SocialMediaType } from '~/types/common/index'

/**
 * Redes sociales del sitio. Salen de `MY_SOCIAL_MEDIA` (constants/common), sin base de datos: se
 * renderizan en el servidor y no hay petición extra. Más adelante se podrán gestionar desde el panel.
 * Cada llamada devuelve su propia copia porque `isHovered` es estado local de cada componente.
 */
export const useSocialMedia = () => {
  const socials = ref<SocialMediaType[]>(MY_SOCIAL_MEDIA.map(item => ({ ...item })))

  return { socials }
}
