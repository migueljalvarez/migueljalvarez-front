export type SocialMediaType = {
  name: string
  link: string
  icon: string
}

export type ProjectType = 'client' | 'product' | 'practice'
export type ProjectStatus = 'published' | 'in-development'

/** Imagen de la galería. `alt` es obligatorio (accesibilidad y SEO); `caption` es opcional. */
export type ProjectImage = {
  src: string
  alt: string
  caption?: string
}

/** Cifra destacada de un proyecto (solo datos verificables). */
export type ProjectHighlight = {
  value: string
  label: string
}

/**
 * Proyecto del portafolio. Todo lo opcional solo se muestra si tiene contenido real.
 * Guía de contenido e imágenes: docs/portfolio-guide.md
 */
export type PortfolioType = {
  id: string
  slug?: string
  title: string
  type: ProjectType
  /** Etiqueta de presentación, p. ej. "Producto propio" o "Cliente". */
  portfolioType: string
  status?: ProjectStatus
  /** Resumen de 1–2 frases (tarjeta y encabezado de la ficha). */
  description: string
  role?: string
  year?: string
  duration?: string
  problem?: string
  decision?: string
  result?: string
  highlights?: ProjectHighlight[]
  /** Qué incluyó el proyecto (entregables). */
  scope?: string[]
  technologies: string[]
  /** Portada (tarjeta y cabecera de la ficha): 1280×720, webp. */
  urlImage: string
  /** Imagen para redes (Open Graph): 1200×630, jpg. Si falta se usa la del sitio. */
  ogImage?: string
  gallery?: ProjectImage[]
  /** Enlace público del proyecto, si existe. */
  url?: string
  /** Etiquetas de la tarjeta (máx. 4) y a quién va dirigido el proyecto. */
  tags?: string[]
  audience?: string
  /** Proyecto destacado: va primero y en grande en el listado. */
  featured?: boolean
  /** Dato de ejemplo (solo desarrollo): la interfaz lo marca como tal. */
  sample?: boolean
}
