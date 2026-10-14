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
  primary?: boolean
}

export type PortfolioFilter = 'Todos' | 'Clientes' | 'Productos propios'
export type PortfolioCardVariant = 'primary' | 'secondary' | 'balanced'
