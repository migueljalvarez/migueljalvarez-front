export type SectionHeaderProps = {
  eyebrow?: string
  heading: string
  /** Si se omite, el texto de apoyo puede ir en el slot por defecto. */
  description?: string
  level?: 'h1' | 'h2' | 'h3'
  /** `dark` para bandas oscuras (hero, proceso, contacto). */
  tone?: 'light' | 'dark'
  /** `lg` para el h1 de páginas interiores. */
  size?: 'md' | 'lg'
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
