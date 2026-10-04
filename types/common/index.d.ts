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
  company?: string
  context?: string
  result?: string
}

export type TestimonialContent = {
  id: string
  quote: string
  author: string
  role: string
  company?: string
  context?: string
  image?: string
  profileType?: string
  socialLink?: string
  socialIcon?: string
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

export type Me = {
  id: string
  name: string
  profession: string
  jobDescription: string
}
