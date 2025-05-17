import type { Testimonial } from "~/common/types";

export const useTestimonial = () => {
  const testimonial = ref<Testimonial[]>([
    {
      name: "Gustavo Sanchez",
      position: "Senior Software Engineer",
      description:
        "Miguel es un excelente trabajador y un excelente programador, persona confiable y responsable, trabajador de equipo y persona capaz de asumir nuevos retos. ",
      image:
        "https://media.licdn.com/dms/image/v2/C4E03AQF1td7vYcXsQw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516867355393?e=1752710400&v=beta&t=drkKVU48vBgGC7Xj1FEO_-XvmqjIZ4toidaxJBry-Eo",
      type: "Trabajo",
      socialMedia: [
        {
          name: "LinkedIn",
          link: "https://www.linkedin.com/in/your-profile",
          icon: "mdi:linkedin",
          isHovered: false,
        },
      ],
    },
    {
      name: "Rocio Solano",
      position: "Product Manager",
      description:
        "Miguel es un colaborador con alto nivel de compromiso y sentido de pertenencia. Tiene habilidades en el desarrollo de software en node JS, android y manejo de configuración para components AWS. trabaja de Manera cooperativa con el equipo asignado, habilidad para aprender de nuevos lenguajes y se reta constantemente en el cumplimiento de objetivos.",
      image:
        "https://media.licdn.com/dms/image/v2/C5603AQFUDA4f8gDwOQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1517246838743?e=1752710400&v=beta&t=9tc8K-xq7D3tN3KdT7SVGg82N1bimS6s8sRFR634ClI",
      socialMedia: [
        {
          name: "LinkedIn",
          link: "https://www.linkedin.com/in/your-profile",
          icon: "mdi:linkedin",
          isHovered: false,
        },
      ],
      type: "Trabajo",
    },
    {
      name: "Daniel Puerto",
      position: "Senior Software Engineer",
      description:
        "Un gran trabajo, me ayudo a salir de la zona de confort y a mejorar mis habilidades",
      image:
        "https://www.lanacion.com.ar/resizer/v2/kit-harington-en-una-escena-de-game-of-L6NWYM4FIZFAHJXX3UGLRYTAGQ.jpg?auth=42e2d30276939988a3eaf07d3c4f01ea1b0ffab2a9a022a6ba966c08673a951f&quality=70&smart=true",
      type: "Trabajo",
      socialMedia: [
        {
          name: "LinkedIn",
          link: "https://www.linkedin.com/in/your-profile",
          icon: "mdi:linkedin",
          isHovered: false,
        },
      ],
    },
    {
      name: "Alfredo Rojas",
      position: "Director de AR Stereo",
      description:
        "Un gran trabajo, me ayudo a salir de la zona de confort y a mejorar mis habilidades",
      image:
        "https://i0.wp.com/ultimasnoticias.com.ve/wp-content/uploads/2020/08/IMG_16082020_120149_768_x_573_p%C3%ADxel.jpg?resize=696%2C519&ssl=1",
      type: "Cliente",
      socialMedia: [
        {
          name: "Instagram",
          link: "",
          icon: "mdi:instagram",
          isHovered: false,
        },
      ],
    },
  ]);
  return { testimonial };
};
