import type { LegalSection } from './legal'

/** Sección de una guía: igual que la de un documento legal, con la opción de lista numerada. */
export type GuideSection = LegalSection & {
  /** Muestra `items` como lista numerada (pasos o preguntas en orden) en vez de con viñetas. */
  ordered?: boolean
}

export type Guide = {
  /** Ruta pública (en español por SEO; el archivo de la página está en inglés). */
  path: string
  eyebrow: string
  /** Título visible (h1). */
  title: string
  /** Título corto para la pestaña; el sitio le añade « | Miguel Álvarez». */
  seoTitle: string
  /** Descripción para buscadores y redes (120 a 160 caracteres). */
  description: string
  /** Fecha ISO (AAAA-MM-DD) de publicación y de la última actualización. */
  publishedAt: string
  updatedAt: string
  intro: string[]
  sections: GuideSection[]
  cta: { heading: string; text: string; label: string }
}
