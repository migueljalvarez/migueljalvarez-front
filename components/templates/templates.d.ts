export type ProjectType = 'client' | 'product' | 'practice'
export type PortafolioType = {
  id: string
  title: string
  type: ProjectType
  portfolioType: string
  slug?: string
  problem?: string
  decision?: string
  result?: string
  technologies: string[]
  version: string
  status?: string
  description: string
  urlImage: string
  url: string
  initialProblem: string
  solutionDetails: string
  images: Image[]
  gallery?: string[]
}
export type PortfolioProps = {
  title: string
  projects: PortafolioType[]
}

export type PorfolioItemProps = {
  id: string
  title: string
  portfolioType: string
  image: string
  technologies: string[]
}
