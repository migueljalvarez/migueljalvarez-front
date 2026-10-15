export type PortfolioCardProject = {
  id: string
  slug: string
  title: string
  description: string
  type: 'cliente' | 'propio'
  tags: string[]
  audience: string
  image: string
  href: string
  primary?: boolean
}

export type PortfolioFilter = 'Todos' | 'Clientes' | 'Productos propios'
export type PortfolioCardVariant = 'horizontal' | 'featured' | 'default'
export type PortfolioLayoutMode = 'empty' | 'horizontal' | 'two' | 'three' | 'bento'
