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

