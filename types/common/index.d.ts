export type SocialMediaType = {
  name: string;
  link: string;
  icon: string;
  isHovered: boolean;
};

export type Testimonial = {
  name: string;
  position: string;
  description: string;
  image: string;
  type: string
  socialMedia: Array<SocialMediaType>;
};
export type Image = {
  url: string
}
export type PortafolioType = {
  id: string;
  title: string;
  version: string;
  state: string;
  description: string;
  technologies: string[];
  urlImage: string;
  url: string;
  initialProblem: string;
  solutionDetails: string;
  images: Image[]
};