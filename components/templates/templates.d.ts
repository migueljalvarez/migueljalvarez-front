type PortfolioType = 'Cliente' | 'Practica' | string
export type PortafolioType = {
  id: string
  title: string
  type?: string
  portfolioType: PortfolioType
  technologies: string[]
  version: string
  state: string
  description: string
  urlImage: string
  url: string
  initialProblem: string
  solutionDetails: string
  images: Image[]
}
export type PortfolioProps = {
  title: string
  projects: PortafolioType[]
}

export type PorfolioItemProps = {
  id: string
  title: string
  portfolioType: PortfolioType
  image: string
  technologies: string[]
}
