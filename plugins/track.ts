import type { DirectiveBinding } from 'vue'
import type { TrackTarget } from '~/utils/track'
import { readAttribution } from '~/utils/track'

type TrackElement = HTMLElement & { __track?: { target: TrackTarget | null | undefined } }

/**
 * Directiva `v-track`: `v-track="'wa_hero'"` o `v-track="{ id: 'wa_proyecto', slug }"`.
 * Escucha `click` sin `preventDefault` y sin tocar los atributos del elemento. El registro es universal
 * (con `getSSRProps` vacío) para que el SSR no avise de una directiva sin resolver; la escucha solo
 * existe en el cliente. Con valor vacío (`v-track="undefined"`) no hace nada.
 */
export default defineNuxtPlugin(nuxtApp => {
  // Atribución inicial (antes de que la primera navegación interna la pierda).
  if (import.meta.client) {
    const attribution = useTrackAttribution()
    attribution.value = readAttribution(
      window.location.search,
      document.referrer,
      window.location.hostname
    )
  }

  const { track } = useTrack()

  nuxtApp.vueApp.directive('track', {
    mounted(el: TrackElement, binding: DirectiveBinding<TrackTarget | null | undefined>) {
      el.__track = { target: binding.value }
      el.addEventListener('click', () => track(el.__track?.target))
    },
    updated(el: TrackElement, binding: DirectiveBinding<TrackTarget | null | undefined>) {
      el.__track = { target: binding.value }
    },
    getSSRProps: () => ({})
  })
})
