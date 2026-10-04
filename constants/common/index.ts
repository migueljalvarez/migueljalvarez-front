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
  location: 'Medellin, Antioquia, CO'
}
export const CONTACT_INFO_DESCRIPTION = `¿Buscas impulsar tus proyectos con soluciones creativas y efectivas? ¡Estoy listo para
          ayudarte! Ponte en contacto conmigo y descubre cómo juntos podemos llevar tus ideas al
          siguiente nivel. Tu mensaje es el primer paso para comenzar algo increíble.`

export const WORK_ITEMS = [
  { step: 'Tienes una idea y necesitas convertirla en algo concreto.' },
  { step: 'Quieres un MVP sin invertir meses en cosas que todavía no necesitas.' },
  { step: 'Tu sistema funciona, pero necesita nuevas capacidades.' },
  { step: 'Hay un problema técnico que necesitas entender antes de tomar una decisión.' }
]
/* Phases of software development */
export const DEVELOPMENT_PHASES = [
  {
    title: 'Descubrimiento y análisis',
    description: 'Definimos el problema, los usuarios y el alcance del producto.',
    icon: 'mdi:magnify'
  },
  {
    title: 'Planificación y arquitectura',
    description: 'Priorizamos el alcance y elegimos una solución técnica adecuada.',
    icon: 'mdi:clipboard-text-outline'
  },
  {
    title: 'Diseño de experiencia',
    description: 'Organizamos los flujos y la interfaz para que el producto sea claro y usable.',
    icon: 'mdi:palette-outline'
  },
  {
    title: 'Desarrollo e integración',
    description: 'Construimos el producto y conectamos sus componentes y servicios.',
    icon: 'mdi:code-tags'
  },
  {
    title: 'Pruebas y validación',
    description: 'Comprobamos que la solución funcione y cumpla los objetivos acordados.',
    icon: 'mdi:bug-check-outline'
  },
  {
    title: 'Despliegue y evolución',
    description: 'Publicamos el producto y lo mejoramos a partir de su uso real.',
    icon: 'mdi:rocket-launch-outline'
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
export const META = {
  TITLE: 'Miguel Alvarez ',
  DESCRIPTION:
    'Desarrollo sitios web, sistemas y MVPs de alto rendimiento para startups, emprendedores y empresas. Con 9+ años de experiencia, transformo ideas en soluciones digitales eficientes, escalables y con alto rendimiento.'
}
