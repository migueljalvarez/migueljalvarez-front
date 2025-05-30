export default defineEventHandler(async _event => {
  return [
    {
      name: 'Gustavo Sanchez',
      position: 'Senior Software Engineer',
      description:
        'Miguel es un excelente trabajador y un excelente programador, persona confiable y responsable, trabajador de equipo y persona capaz de asumir nuevos retos. ',
      image:
        'https://media.licdn.com/dms/image/v2/C4E03AQF1td7vYcXsQw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516867355393?e=1752710400&v=beta&t=drkKVU48vBgGC7Xj1FEO_-XvmqjIZ4toidaxJBry-Eo',
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
      image:
        'https://media.licdn.com/dms/image/v2/C5603AQFUDA4f8gDwOQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1517246838743?e=1752710400&v=beta&t=9tc8K-xq7D3tN3KdT7SVGg82N1bimS6s8sRFR634ClI',
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
      image:
        'https://media.licdn.com/dms/image/v2/D4E03AQHvx85UPUnl3w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1690135627970?e=1753315200&v=beta&t=ePJ7MGE9cbPfTcBoEN8ObKDiYcRh7MiXhnoCik2pPa8',
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
      image:
        'https://i0.wp.com/ultimasnoticias.com.ve/wp-content/uploads/2020/08/IMG_16082020_120149_768_x_573_p%C3%ADxel.jpg?resize=696%2C519&ssl=1',
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
