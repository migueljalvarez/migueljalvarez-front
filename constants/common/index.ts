export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const REGEX_COMMON = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/
export const REGEX_LARGE_TEXT = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9,.\-+¿¡?"'()!\s]+$/

export const MAIN_TITLE_PRESENTATION = 'Hola'
export const MAIN_TITLE_PRESENTATION_COMPLEMENT = 'soy'
export const MY_SOCIAL_MEDIA = [
  {
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/in/ingmiguelalvarez/',
    icon: 'mdi:linkedin',
    isHovered: false
  },
  {
    name: 'GitHub',
    link: 'https://github.com/migueljalvarez',
    icon: 'mdi:github',
    isHovered: false
  }
  /*   {
    name: 'Instagram',
    link: 'https://www.instagram.com/migueljalvarez/',
    icon: 'mdi:instagram',
    isHovered: false
  },
  {
    name: 'WhatsApp',
    link: 'https://wa.link/xd5n3c',
    icon: 'mdi:whatsapp',
    isHovered: false
  } */
]

export const MAIN_HERO = 'Con mas de 9 años de experiencia como Desarrollador de Software'
//Contact Information
export const CONTACT_INFO = {
  phone: '+57 320-318-7076',
  email: 'ing.migueljalvarez@gamil.com',
  location: 'Medellin, Antioquia - Colombia'
}
export const CONTACT_INFO_DESCRIPTION = `¿Buscas impulsar tus proyectos con soluciones creativas y efectivas? ¡Estoy listo para
          ayudarte! Ponte en contacto conmigo y descubre cómo juntos podemos llevar tus ideas al
          siguiente nivel. Tu mensaje es el primer paso para comenzar algo increíble.`

/* Services */
export const SERVICES = [
  {
    title: 'Estrategia & Consultoría',
    icon: 'fa-solid:users',
    items: [
      'Aterrizaje de ideas',
      'Planificación tecnica del proyecto.',
      'Diseño de roadmap para lanzamientos y crecimiento.'
    ]
  },
  {
    title: 'Desarrollo de Software',
    icon: 'fa-solid:code',
    items: [
      'Desarrollo web a la medida',
      'Mantenimiento y optimización',
      'Integraciones y APIs',
      'Documentación técnica',
      'Despliegue Automatizado',
      'Certificado SSL',
      'Posicionamiento SEO'
    ]
  },
  {
    title: 'Implementación & Soporte',
    icon: 'fa6-solid:laptop-code',
    items: [
      'Creación de Landing Page',
      'Desarrollo de MVPs funcionales y testeables',
      'Implementación de nuevas funciones',
      'Corrección de Bugs',
      'Soporte y mantenimiento'
    ]
  }
]

export const CACHE_EXP = 1800

export const COMPLEMETARY_COURSE = [
  {
    name: 'Academia Geek',
    logo: 'academia-geek.jpeg'
  },
  {
    name: 'Free Code Camp',
    logo: 'FreeCodeCamp.svg'
  },
  {
    name: 'Platzi',
    logo: 'Platzi.svg'
  }
]
export const CANONICAL_URL = 'https://www.migueljalvarez.com/'
export const META_DESCRIPTION =
  'Desarrollo sitios web, sistemas y MVPs de alto rendimiento para startups, emprendedores y empresas. Con 9+ años de experiencia, transformo ideas en soluciones digitales eficientes, escalables y con alto rendimiento.'
