import { ABOUT_FALLBACK } from '~/constants/common'
import type { AboutContent } from '~/types/about'

/**
 * Sección "Sobre mí" de la home. Se carga durante el SSR desde `/api/about` (API con respaldo en el
 * código), así que llega ya en el HTML, sin parpadeo.
 */
export const useAbout = async () => {
  const { data } = await useFetch<AboutContent>('/api/about', {
    key: 'about',
    default: () => ABOUT_FALLBACK
  })
  return { about: computed(() => data.value ?? ABOUT_FALLBACK) }
}
