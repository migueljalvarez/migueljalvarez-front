export type SocialMediaType = {
  name: string
  link: string
  icon: string
  isHovered: boolean
}

export type Testimonial = {
  id?: string
  name: string
  position: string
  testimonial: string
  image: string
  type: string
  socialMedia: Array<SocialMediaType>
}
export type Image = {
  title: string
  url: string
}
export type PortafolioType = {
  id: string
  title: string
  type?: string
  portfolioType: string
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

export type Me = {
  id: string
  name: string
  profession: string
  jobDescription: string
}
