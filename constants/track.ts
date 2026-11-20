/**
 * Conteo anónimo de clics: lista cerrada de botones y formatos. La comparten el cliente (directiva
 * `v-track`) y el servidor (`/api/track`); debe coincidir con la de la API (`click-events.constants.ts`).
 */
export const TRACK_BUTTON_IDS = [
  'wa_hero',
  'wa_sobre_mi',
  'wa_contacto',
  'wa_contacto_compacto',
  'wa_proyecto',
  'wa_como_trabajo',
  'nav_hablemos',
  'cta_ver_como_trabajo',
  'cta_ver_proyecto',
  'cta_hero_card'
] as const

export const FORM_SUBMIT_OK = 'form_submit_ok'
export const TRACK_EVENT_IDS = [...TRACK_BUTTON_IDS, FORM_SUBMIT_OK] as const
export type TrackEventId = (typeof TRACK_EVENT_IDS)[number]

/** Eventos de proyecto: llevan slug (y solo ellos). */
export const TRACK_SLUG_IDS: readonly string[] = ['wa_proyecto', 'cta_ver_proyecto']

export const MAX_TRACK_BODY_BYTES = 1024

export const SLUG_PATTERN = /^[a-z0-9-]{1,80}$/
/** Ruta sin consulta ni fragmento. */
export const PAGE_PATH_PATTERN = /^\/[^\s?#]{0,199}$/
export const UTM_PATTERN = /^[A-Za-z0-9_.+\- ]{1,60}$/
export const REFERRER_HOST_PATTERN = /^[A-Za-z0-9.-]{1,120}$/
