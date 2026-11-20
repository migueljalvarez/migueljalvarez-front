import {
  buildTrackBody,
  isTrackingDisabled,
  type TrackAttribution,
  type TrackTarget
} from '~/utils/track'

const TRACK_URL = '/api/track'

/**
 * Atribución de la primera carga (utm_source, utm_campaign y host del referrer), en memoria: se pierde en
 * la primera navegación interna, por eso se captura al arrancar la app (plugin `track`). Sin cookies y sin
 * escribir en el almacenamiento del navegador (solo lee la marca del panel).
 */
export const useTrackAttribution = () => useState<TrackAttribution>('track-attribution', () => ({}))

/**
 * Conteo anónimo de clics. `track()` nunca lanza, nunca bloquea y nunca cambia el comportamiento del
 * elemento: se envía con `sendBeacon` (sobrevive a la navegación y a la pestaña nueva) y, si no está
 * disponible, con `fetch` + `keepalive`. Cualquier fallo se ignora en silencio.
 */
export const useTrack = () => {
  const attribution = useTrackAttribution()

  const track = (target: TrackTarget | null | undefined) => {
    if (!import.meta.client) return
    try {
      if (navigator.webdriver) return
      // Marca del panel («No contar mis visitas»): solo se lee, nunca se escribe desde el sitio público.
      if (isTrackingDisabled(() => window.localStorage)) return
      const body = buildTrackBody(target, {
        pathname: window.location.pathname,
        width: window.innerWidth,
        attribution: attribution.value
      })
      if (!body) return
      const json = JSON.stringify(body)

      if (typeof navigator.sendBeacon === 'function') {
        try {
          if (navigator.sendBeacon(TRACK_URL, new Blob([json], { type: 'application/json' })))
            return
        } catch {
          // Se prueba el respaldo con fetch.
        }
      }
      void fetch(TRACK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: json,
        keepalive: true
      }).catch(() => undefined)
    } catch {
      // El conteo nunca debe afectar al clic.
    }
  }

  return { track }
}
