import type { SocialMediaType } from '~/types/common/index'

/**
 * Redes sociales del sitio. Salen de la API (se gestionan desde el panel) con respaldo en el código;
 * `plugins/socialLinks.ts` las carga una vez durante el SSR.
 * Cada llamada devuelve su propia copia para que ningún componente comparta estado mutable.
 */
export const useSocialMedia = () => {
  const links = useState<SocialMediaType[]>('social-links', () => [])
  const socials = ref<SocialMediaType[]>(links.value.map(item => ({ ...item })))

  return { socials }
}
