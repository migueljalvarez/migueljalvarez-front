import {
  PAGE_PATH_PATTERN,
  REFERRER_HOST_PATTERN,
  SLUG_PATTERN,
  TRACK_EVENT_IDS,
  TRACK_SLUG_IDS,
  UTM_PATTERN
} from '../constants/track.ts'

/**
 * Lógica pura (sin Nuxt ni navegador) del conteo anónimo de clics en el cliente. Nada de esto guarda
 * datos en el navegador: la atribución inicial vive solo en memoria (`useState`).
 */

/** Marca que el panel guarda SOLO en el navegador del autor para no contar sus visitas. */
export const NO_TRACK_KEY = 'mj_no_track'

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

/** ¿Está activada la marca «No contar mis visitas»? Si el almacenamiento falla, se sigue contando. */
export const isTrackingDisabled = (storage: () => StorageLike | undefined): boolean => {
  try {
    return storage()?.getItem(NO_TRACK_KEY) === '1'
  } catch {
    return false
  }
}

/** Activa o quita la marca (solo la usa el panel). Devuelve `false` si el navegador no la pudo guardar. */
export const setTrackingDisabled = (
  storage: () => StorageLike | undefined,
  disabled: boolean
): boolean => {
  try {
    const store = storage()
    if (!store) return false
    if (disabled) store.setItem(NO_TRACK_KEY, '1')
    else store.removeItem(NO_TRACK_KEY)
    return true
  } catch {
    return false
  }
}

export type TrackTarget = string | { id: string; slug?: string }

export type TrackAttribution = {
  utmSource?: string
  utmCampaign?: string
  referrerHost?: string
}

export type TrackBody = TrackAttribution & {
  eventId: string
  slug?: string
  pagePath: string
  device: 'mobile' | 'desktop'
}

/** Rutas privadas o con datos en la URL (token de testimonio, panel): nunca se mide desde ellas. */
const UNTRACKED_PATHS = /^\/(admin|login|testimonio|api)(\/|$)/

export const MOBILE_MAX_WIDTH = 768

export const deviceFor = (width: number): 'mobile' | 'desktop' =>
  width < MOBILE_MAX_WIDTH ? 'mobile' : 'desktop'

/** Valor de utm_* limpio (minúsculas) o `undefined` si no cumple el formato. */
export const sanitizeUtm = (value: string | null | undefined): string | undefined => {
  const clean = (value ?? '').trim().toLowerCase()
  return UTM_PATTERN.test(clean) ? clean : undefined
}

/** Solo el host del referrer; vacío si es el propio sitio, no es http(s) o no es válido. */
export const referrerHostOf = (referrer: string, ownHost: string): string | undefined => {
  if (!referrer) return undefined
  try {
    const url = new URL(referrer)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined
    const host = url.hostname.toLowerCase()
    if (host === ownHost.toLowerCase()) return undefined
    return REFERRER_HOST_PATTERN.test(host) ? host : undefined
  } catch {
    return undefined
  }
}

/** Atribución de la primera carga: utm_source, utm_campaign y host del referrer. */
export const readAttribution = (
  search: string,
  referrer: string,
  ownHost: string
): TrackAttribution => {
  const params = new URLSearchParams(search)
  const attribution: TrackAttribution = {}
  const source = sanitizeUtm(params.get('utm_source'))
  const campaign = sanitizeUtm(params.get('utm_campaign'))
  const host = referrerHostOf(referrer, ownHost)
  if (source) attribution.utmSource = source
  if (campaign) attribution.utmCampaign = campaign
  if (host) attribution.referrerHost = host
  return attribution
}

/** Ruta a registrar (sin barra final), o `undefined` si no se debe medir desde esa página. */
export const trackablePath = (pathname: string): string | undefined => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (UNTRACKED_PATHS.test(path)) return undefined
  return PAGE_PATH_PATTERN.test(path) ? path : undefined
}

/** Normaliza el valor de `v-track`; `undefined` si es vacío, desconocido o el slug no corresponde. */
export const normalizeTarget = (target: TrackTarget | null | undefined) => {
  if (!target) return undefined
  const { id, slug } = typeof target === 'string' ? { id: target, slug: undefined } : target
  if (!(TRACK_EVENT_IDS as readonly string[]).includes(id)) return undefined
  const needsSlug = TRACK_SLUG_IDS.includes(id)
  if (needsSlug !== (slug !== undefined)) return undefined
  if (slug !== undefined && !SLUG_PATTERN.test(slug)) return undefined
  return { id, slug }
}

export const buildTrackBody = (
  target: TrackTarget | null | undefined,
  context: { pathname: string; width: number; attribution: TrackAttribution }
): TrackBody | undefined => {
  const normalized = normalizeTarget(target)
  const pagePath = trackablePath(context.pathname)
  if (!normalized || !pagePath) return undefined
  return {
    eventId: normalized.id,
    ...(normalized.slug !== undefined ? { slug: normalized.slug } : {}),
    pagePath,
    ...context.attribution,
    device: deviceFor(context.width)
  }
}
