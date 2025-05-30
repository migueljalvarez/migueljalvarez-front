export default defineEventHandler(async _event => {
  return [
    {
      name: 'Gustavo Sanchez',
      position: 'Senior Software Engineer',
      description:
        'Miguel es un excelente trabajador y un excelente programador, persona confiable y responsable, trabajador de equipo y persona capaz de asumir nuevos retos. ',
      image: '/gustavo-sanchez.jpg',
      type: 'Trabajo',
      socialMedia: [
        {
          name: 'LinkedIn',
          link: 'https://www.linkedin.com/in/your-profile',
          icon: 'mdi:linkedin',
          isHovered: false
        }
      ]
    },
    {
      name: 'Rocio Solano',
      position: 'Product Manager',
      description:
        'Miguel es un colaborador con alto nivel de compromiso y sentido de pertenencia. Tiene habilidades en el desarrollo de software en node JS, android y manejo de configuración para components AWS. trabaja de Manera cooperativa con el equipo asignado, habilidad para aprender de nuevos lenguajes y se reta constantemente en el cumplimiento de objetivos.',
      image: '/rocio-solano.jpg',
      socialMedia: [
        {
          name: 'LinkedIn',
          link: 'https://www.linkedin.com/in/your-profile',
          icon: 'mdi:linkedin',
          isHovered: false
        }
      ],
      type: 'Trabajo'
    },
    {
      name: 'Daniel Puerto',
      position: 'Senior Software Engineer',
      description: `Migue es una gran desarrollador, lo conoci como back-end sin embargo se desempeño muy bien como front-end, logrando excelentes resultados, su colaboracion con el equipo fue fenomenal.

Desempeño proyectos con arquitectura hexagonal y promovio buenas practicas de Logs para lograr asi un rendimiento excepcional en los proyectos que trabajo`,
      image: '/daniel-puerto.jpg',
      type: 'Trabajo',
      socialMedia: [
        {
          name: 'LinkedIn',
          link: 'https://www.linkedin.com/in/your-profile',
          icon: 'mdi:linkedin',
          isHovered: false
        }
      ]
    },
    {
      name: 'Alfredo Rojas',
      position: 'Director de AR Stereo',
      description:
        'Un gran trabajo, me ayudo a salir de la zona de confort y a mejorar mis habilidades',
      image: '/alfredo-rojas.webp',
      type: 'Cliente',
      socialMedia: [
        {
          name: 'Instagram',
          link: '',
          icon: 'mdi:instagram',
          isHovered: false
        }
      ]
    }
  ]
})
