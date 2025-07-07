export type PortafolioType = {
  id: string
  title: string
  type?: string
  portafolioType: string
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
