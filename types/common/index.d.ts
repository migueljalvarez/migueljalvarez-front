export type SocialMediaType = {
  name: string
  link: string
  icon: string
  isHovered: boolean
}


export type Image = {
  title: string
  url: string
}
export type PortafolioType = {
  id: string
  title: string
  type: 'client' | 'product' | 'practice'
  portfolioType: string
  status?: 'published' | 'in-development'
  slug?: string
  problem?: string
  decision?: string
  result?: string
  technologies: string[]
  version: string
  description: string
  urlImage: string
  url: string
  initialProblem: string
  solutionDetails: string
  images: Image[]
  gallery?: string[]
}

