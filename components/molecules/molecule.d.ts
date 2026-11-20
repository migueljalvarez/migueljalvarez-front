export type SectionHeaderProps = {
  eyebrow?: string
  heading: string
  /** Si se omite, el texto de apoyo puede ir en el slot por defecto. */
  description?: string
  level?: 'h1' | 'h2' | 'h3'
  /** `dark` para bandas oscuras (hero, proceso, contacto). */
  tone?: 'light' | 'dark'
  headingId?: string
}

export type CheckListItem = string | { text: string; note?: string }

export type CheckListProps = {
  items: CheckListItem[]
  tone?: 'light' | 'dark'
  size?: 'sm' | 'md'
  icon?: string
  iconClass?: string
  /** Disposición en fila (hero); por defecto, columna. */
  inline?: boolean
}

export type BackLinkProps = {
  to: string
}

export type SocialMediaProps = {
  link: string
  name: string
  icon: string
  size: number
  /** Para fondos claros (menú móvil); por defecto, fondos oscuros. */
  onLight?: boolean
}

export type QuoteBlockProps = {
  /** Etiqueta en mayúsculas sobre la cita (p. ej. Principio clave). */
  label?: string
}

export type StatListProps = {
  items: { value: string; label: string }[]
}

export type ChipListProps = {
  items: string[]
  /** Nombre accesible de la lista. */
  label: string
}

export type InfoCardProps = {
  title: string
  level?: 'h2' | 'h3' | 'h4'
  /** Color del punto junto al título. */
  dot?: 'warm' | 'blue'
}

export type ImageCarouselProps = {
  /** De 1 a 4 imágenes; si llegan más, se muestran las 4 primeras. */
  images: { src: string; alt: string; width?: number; height?: number }[]
}

export type ImageWithFallbackProps = {
  /** Ruta de la imagen; vacía o ausente muestra el placeholder de marca. */
  src?: string
  /** Texto alternativo; vacío = imagen decorativa. */
  alt: string
  width?: number
  height?: number
  sizes?: string
  quality?: number
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  /** Clases de la imagen (por defecto `object-cover`). */
  imageClass?: string
}
