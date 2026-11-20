/**
 * Índice de secciones de un editor del panel (Sobre mí hoy; Portafolio, Políticas y Testimonios después).
 * Tipos y ayudantes puros: cada editor arma su lista y el layout solo la dibuja.
 */
export type EditorSectionStatus = 'ok' | 'empty' | 'error'

export type EditorSectionItem = {
  /** Id del bloque en la página (el ancla a la que lleva). */
  id: string
  label: string
  status: EditorSectionStatus
  /** Contador opcional, p. ej. «3/4». */
  count?: string
}

/**
 * Estado de una sección: error si alguna clave de error le pertenece; completa si tiene contenido; vacía si no.
 * `prefixes` son los campos de la sección (una clave `stats.0.value` pertenece al campo `stats`).
 */
export const editorSectionStatus = (
  errors: Record<string, string>,
  prefixes: string[],
  filled: boolean
): EditorSectionStatus => {
  const hasError = Object.keys(errors).some(key => prefixes.includes(key.split('.')[0] as string))
  if (hasError) return 'error'
  return filled ? 'ok' : 'empty'
}

/** Id de la sección activa según cuáles cruzan la línea de lectura (la última en el orden de la página). */
export const activeEditorSection = (ids: string[], crossing: ReadonlySet<string>): string | null =>
  [...ids].reverse().find(id => crossing.has(id)) ?? null
