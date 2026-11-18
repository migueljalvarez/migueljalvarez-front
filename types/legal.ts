/** Sección de un documento legal (política de privacidad, términos y condiciones). */
export type LegalSection = {
  id: string
  title: string
  paragraphs?: string[]
  items?: string[]
  /** Enlace interno opcional al final de la sección. */
  link?: { label: string; to: string }
}
