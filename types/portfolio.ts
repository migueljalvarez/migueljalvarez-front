export type PortfolioCardProject = {
  id: string
  slug: string
  title: string
  description: string
  type: 'client' | 'product'
  tags: string[]
  audience: string
  image: string
  href: string
  /** Sitio o aplicación en línea (https), si el proyecto la tiene. */
  url?: string
  primary?: boolean
  /** Destacado en el panel: primero y en grande en /portafolio. */
  featured?: boolean
  status?: 'published' | 'in-development'
  /** Dato de ejemplo (solo desarrollo). */
  sample?: boolean
}

export type PortfolioFilter = 'all' | 'client' | 'product'
export type PortfolioCardVariant = 'horizontal' | 'featured' | 'default'
export type PortfolioLayoutMode = 'empty' | 'horizontal' | 'two' | 'three' | 'bento'
