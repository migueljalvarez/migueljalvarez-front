import { z } from 'zod'

/**
 * Lógica pura (sin Nuxt) de "Redes sociales" y "Políticas" del panel. Las reglas coinciden con los DTO
 * de la API (`site-content-admin.dto.ts`): lo que aquí es válido, la API lo acepta.
 */

// --- Redes sociales -----------------------------------------------------------------------------

export const SOCIAL_LINKS_MAX = 20
export const SOCIAL_NAME_MAX = 60
export const SOCIAL_URL_MAX = 300
const SOCIAL_URL_RE = /^(https:\/\/\S+|mailto:\S+)$/
const SOCIAL_ICON_RE = /^[a-z0-9-]+:[a-z0-9-]+$/

/** Iconos habituales (formato prefijo:nombre) para sugerir en la lista de la pantalla. */
export const SOCIAL_ICON_SUGGESTIONS = [
  { value: 'mdi:linkedin', label: 'LinkedIn' },
  { value: 'mdi:github', label: 'GitHub' },
  { value: 'simple-icons:x', label: 'X' },
  { value: 'mdi:instagram', label: 'Instagram' },
  { value: 'mdi:facebook', label: 'Facebook' },
  { value: 'mdi:youtube', label: 'YouTube' },
  { value: 'mdi:whatsapp', label: 'WhatsApp' },
  { value: 'mdi:email-outline', label: 'Correo' },
  { value: 'mdi:web', label: 'Sitio web' }
] as const

export type SocialLinkRecord = {
  id: string
  name: string
  url: string
  icon: string
  visible: boolean
  sortOrder: number
}

/** Fila en edición. `key` solo identifica la fila en la interfaz (no viaja a la API). */
export type SocialLinkDraft = {
  key: string
  name: string
  url: string
  icon: string
  visible: boolean
}

export type SocialLinkField = 'name' | 'url' | 'icon'
export type SocialLinkErrors = Partial<Record<SocialLinkField, string>>

export const isValidIcon = (icon: string) => SOCIAL_ICON_RE.test(icon.trim())

export const emptySocialDraft = (key: string): SocialLinkDraft => ({
  key,
  name: '',
  url: 'https://',
  icon: '',
  visible: true
})

/** Pasa la lista de la API (ya ordenada, pero se reordena por seguridad) a filas editables. */
export const draftsFromRecords = (
  records: SocialLinkRecord[],
  nextKey: () => string
): SocialLinkDraft[] =>
  [...records]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ name, url, icon, visible }) => ({ key: nextKey(), name, url, icon, visible }))

/** Cuerpo del `PUT admin/social-links`: reemplaza la lista; el orden del arreglo es el orden del sitio. */
export const toSocialPayload = (drafts: SocialLinkDraft[]) => ({
  items: drafts.map(draft => ({
    name: draft.name.trim(),
    url: draft.url.trim(),
    icon: draft.icon.trim(),
    visible: draft.visible
  }))
})

/** Representación estable de la lista (sin `key`) para saber si hay cambios sin guardar. */
export const socialSnapshot = (drafts: SocialLinkDraft[]) =>
  JSON.stringify(toSocialPayload(drafts).items)

export const hasSocialChanges = (savedSnapshot: string, drafts: SocialLinkDraft[]) =>
  socialSnapshot(drafts) !== savedSnapshot

/** Devuelve una copia con el elemento movido de `from` a `to` (índices fuera de rango no cambian nada). */
export const moveItem = <T>(list: T[], from: number, to: number): T[] => {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return [...list]
  }
  const copy = [...list]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item as T)
  return copy
}

export const validateSocialDraft = (draft: SocialLinkDraft): SocialLinkErrors => {
  const errors: SocialLinkErrors = {}
  const name = draft.name.trim()
  const url = draft.url.trim()
  const icon = draft.icon.trim()

  if (!name) errors.name = 'Escribe el nombre de la red, p. ej. LinkedIn.'
  else if (name.length > SOCIAL_NAME_MAX) errors.name = `Máximo ${SOCIAL_NAME_MAX} caracteres.`

  if (!url || url === 'https://') errors.url = 'Escribe la dirección del enlace.'
  else if (!SOCIAL_URL_RE.test(url)) {
    errors.url =
      'Usa una dirección que empiece por https:// o mailto:, p. ej. https://github.com/tu-usuario.'
  } else if (url.length > SOCIAL_URL_MAX) errors.url = `Máximo ${SOCIAL_URL_MAX} caracteres.`

  if (!icon) errors.icon = 'Elige un icono, p. ej. mdi:github.'
  else if (!SOCIAL_ICON_RE.test(icon)) {
    errors.icon = 'Usa el formato prefijo:nombre en minúsculas, p. ej. mdi:linkedin.'
  }
  return errors
}

export type SocialValidation = {
  /** Errores por fila (clave = `key` de la fila). */
  errors: Record<string, SocialLinkErrors>
  /** Error de la lista completa (p. ej. más de 20). */
  listError: string
  valid: boolean
}

/** Valida cada fila, que los nombres sean únicos (sin distinguir mayúsculas) y el máximo de redes. */
export const validateSocialLinks = (drafts: SocialLinkDraft[]): SocialValidation => {
  const errors: Record<string, SocialLinkErrors> = {}
  for (const draft of drafts) {
    const rowErrors = validateSocialDraft(draft)
    if (Object.keys(rowErrors).length) errors[draft.key] = rowErrors
  }

  const counts = new Map<string, number>()
  for (const draft of drafts) {
    const name = draft.name.trim().toLowerCase()
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  for (const draft of drafts) {
    const name = draft.name.trim().toLowerCase()
    if ((counts.get(name) ?? 0) > 1 && !errors[draft.key]?.name) {
      errors[draft.key] = { ...errors[draft.key], name: 'Ya hay otra red con este nombre.' }
    }
  }

  const listError =
    drafts.length > SOCIAL_LINKS_MAX ? `Puedes tener hasta ${SOCIAL_LINKS_MAX} redes.` : ''
  return { errors, listError, valid: !Object.keys(errors).length && !listError }
}

// --- Políticas ----------------------------------------------------------------------------------

export const POLICY_TITLE_MAX = 120
export const POLICY_BODY_MAX = 2000
export const POLICY_ORDER_MAX = 9999

export type PolicyRecord = {
  id: string
  title: string
  body: string
  isPublic: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/** Formulario de política. `sortOrder` se escribe como texto y sale como entero 0–9999. */
export const policyFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Escribe el título de la política.')
    .max(POLICY_TITLE_MAX, `Máximo ${POLICY_TITLE_MAX} caracteres.`),
  body: z
    .string()
    .trim()
    .min(1, 'Escribe el texto de la política.')
    .max(POLICY_BODY_MAX, `Máximo ${POLICY_BODY_MAX} caracteres.`),
  isPublic: z.boolean(),
  sortOrder: z
    .string()
    .trim()
    .regex(/^\d{1,4}$/, `Escribe un número entero entre 0 y ${POLICY_ORDER_MAX}.`)
    .transform(Number)
})

/** Orden sugerido para una política nueva: al final de la lista, de 10 en 10 para poder intercalar. */
export const nextPolicyOrder = (policies: { sortOrder: number }[]) =>
  Math.min(
    POLICY_ORDER_MAX,
    policies.length ? Math.max(...policies.map(policy => policy.sortOrder)) + 10 : 0
  )
