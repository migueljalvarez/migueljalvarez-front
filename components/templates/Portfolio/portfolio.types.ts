export type PortfolioCardProject = {
  id: string
  title: string
  description: string
  type: 'cliente' | 'propio'
  projectKind: string
  sector: string
  audience: string
  image: string
  href?: string
  status?: string
  mock?: boolean
}

export type PortfolioFilter = 'Todos' | 'Clientes' | 'Productos propios'
export type PortfolioCardVariant = 'featured' | 'secondary' | 'balanced'
