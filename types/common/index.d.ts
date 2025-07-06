export type SocialMediaType = {
  name: string
  link: string
  icon: string
  isHovered: boolean
}

export type Testimonial = {
  name: string
  position: string
  description: string
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

export type Me = {
  id: string
  name: string
  profession: string
  jobDescription: string
}
