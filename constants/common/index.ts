export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const REGEX_COMMON = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/
export const REGEX_LARGE_TEXT = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9,.\-+¿¡?"'()!\s]+$/

export const MAIN_TITLE_PRESENTATION = 'Hola'
export const MAIN_TITLE_PRESENTATION_COMPLEMENT = 'soy'
export const HOME_HERO_COPY = {
  title: 'Antes de escribir código, entiendo tu problema.',
  description:
    'Ayudo a emprendedores y empresas a convertir ideas en software que puede crecer con su negocio. Cuéntame qué necesitas y lo vemos juntos.'
}
export const HOME_COPY = {
  hero: {
    availability: 'Disponible para nuevos proyectos y consultoría técnica'
  },
  services: {
    eyebrow: 'Antes de construir',
    heading: 'La tecnología es importante. Entender el problema, todavía más.',
    descriptionStart:
      'Mi trabajo no empieza escogiendo un framework. Empieza entendiendo qué quieres lograr, qué tienes hoy, y qué es realmente',
    viable: 'viable con tu presupuesto y tus tiempos',
    descriptionEnd: '— no todo lo que suena bien técnicamente es lo correcto para tu negocio.',
    prompt: '¿En qué punto estás?',
    detailsCta: 'Ver detalle',
    detailLabels: {
      audience: 'Para quién',
      approach: 'Cómo ayudo',
      deliverables: 'Qué recibes',
      phases: 'Fases aplicables'
    }
  },
  process: {
    eyebrow: 'Proceso',
    heading: 'Un proceso completo, en cada etapa',
    description: 'Según lo que necesites, entro en una o varias de estas etapas.'
  },
  portfolio: {
    heading: 'Soluciones que generan impacto',
    description:
      'Proyectos que integran tecnología y necesidades concretas para construir soluciones útiles.',
    allLabel: 'Portafolio completo',
    allHeading: '¿Buscas algo más?',
    allDescription: 'Explora más proyectos y conoce el contexto detrás de cada solución.',
    allCta: 'Ver todos los proyectos'
  },
  about: {
    eyebrow: 'Sobre mí',
    heading: 'Un poco más sobre mí',
    location: 'Medellín, Colombia',
    remote: 'Trabajo en remoto',
    highlights: [
      { value: '10+', label: 'años haciendo software' },
      { value: '4', label: 'sectores distintos' },
      { value: 'Internacional', label: 'equipos de habla hispana' }
    ]
  },
  contact: {
    eyebrow: 'Hablemos',
    heading: '¿Tienes algo en mente?',
    description:
      'No necesitas tener un documento técnico ni todos los requisitos definidos. Cuéntame qué quieres hacer, qué problema tienes o qué quieres mejorar. Primero hablamos; después vemos si puedo ayudarte.',
    benefits: ['Respuesta en menos de 24 horas', 'Primera consulta sin costo'],
    privacy: 'Uso tus datos solo para responderte.',
    serviceDescription: 'Servicios de consultoría y desarrollo de software',
    sendError: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
    form: {
      success: 'Mensaje enviado exitosamente',
      submit: 'Enviar',
      subjectPlaceholder: 'Selecciona un asunto',
      subjects: [
        { value: 'desarrollo', label: 'Desarrollo' },
        { value: 'oferta', label: 'Oferta' },
        { value: 'consulta', label: 'Consulta' },
        { value: 'soporte', label: 'Soporte' },
        { value: 'otro', label: 'Otro' }
      ]
    }
  },
  work: {
    eyebrow: 'Cómo trabajo',
    heading: 'Acuerdos claros para construir con confianza',
    cta: 'Ver cómo trabajo'
  }
}
export const PRIMARY_CTA_LABEL = 'Hablemos de tu proyecto'
export const WHATSAPP_CTA_LABEL = 'Hablemos por WhatsApp'
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
  TITLE: 'Miguel Álvarez',
  DESCRIPTION:
    'Desarrollo de Software y Soluciones Digitales. Ayudo a emprendedores y empresas a convertir ideas en sitios, sistemas y MVPs sostenibles. Con 9+ años de experiencia, construyo soluciones digitales eficientes y escalables.'
}
