import type { AboutContent } from '~/types/about'
import type { SocialMediaType } from '~/types/common'

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const REGEX_COMMON = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/
export const REGEX_LARGE_TEXT = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9,.\-+¿¡?"'()!\s]+$/

export const HOME_HERO_COPY = {
  /** Titular por tramos: "code" va apagado y "problem" en ámbar (solo cambia el color, sin subrayado). */
  title: {
    before: 'Antes de escribir ',
    code: 'código',
    middle: ', entiendo tu ',
    problem: 'problema',
    after: '.'
  },
  lead: {
    before: 'Ayudo a ',
    strong: 'emprendedores y empresas',
    after: ' a convertir ideas y problemas en software que puede crecer con su negocio.'
  },
  support: {
    before: 'Cuéntame qué necesitas y lo vemos juntos. ',
    strong: 'Primero lo entendemos;',
    after: ' después decidimos cómo construirlo.'
  }
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
    role: 'Ingeniero de sistemas',
    tagline: 'Desarrollo de software que parte de tu necesidad y está listo para crecer.',
    name: 'Miguel Álvarez',
    interests: ['Cultura geek', 'Café & charlas', 'Aprendizaje continuo'],
    principleLabel: 'Principio clave',
    location: 'Medellín, Colombia',
    remote: 'Trabajo en remoto',
    intro:
      'Hola, soy Miguel, ingeniero de sistemas. Me dedico al desarrollo de software, partiendo de la necesidad inicial y preparando el camino para crecer en el futuro. Trabajo con pasión por lo que hago.',
    quote:
      'No dimensionar ni proyectar a futuro un proyecto lleva a mala planificación, reprocesos y módulos que nadie entiende por separado.',
    howIWorkTitle: 'Cómo pienso mi trabajo',
    howIWork:
      'He colaborado con equipos internacionales de habla hispana en proyectos de IoT, LegalTech, outsourcing y consultoría, e identidad digital. Pasar por sectores tan distintos me ha permitido conocer los errores que casi nadie nota hasta que ya duelen.',
    beyondWorkTitle: 'Fuera del trabajo',
    beyondWork:
      'Soy relajado y tranquilo, apasionado de la tecnología y la cultura geek. Me gusta salir a caminar y olvidarme un poco de las cosas, los días de pizza, las salidas con amigos y compartir siempre un buen café. También relajarme viendo películas y series, y estar siempre buscando algo nuevo que aprender.',
    toolsTitle: 'Herramientas',
    imageAlt: 'Miguel Álvarez, ingeniero de sistemas, trabajando en remoto',
    highlights: [
      { value: '10+', label: 'años haciendo software' },
      { value: '4', label: 'sectores distintos' },
      { value: 'LATAM', label: 'equipos de habla hispana' }
    ]
  },
  contact: {
    eyebrow: 'Hablemos',
    location: 'Medellín, Colombia',
    heading: '¿Tienes algo en mente?',
    description:
      'No necesitas tener un documento técnico ni todos los requisitos definidos. Cuéntame qué quieres hacer, qué problema tienes o qué quieres mejorar. Primero hablamos; después vemos si puedo ayudarte.',
    benefits: ['Respuesta en menos de 24 horas', 'Primera consulta sin costo'],
    compact: {
      heading: '¿Tienes dudas sobre este documento?',
      description: 'Escríbeme y te respondo en menos de 24 horas.',
      cta: 'Escríbeme'
    },
    privacy: 'Uso tus datos solo para responderte.',
    consent: 'Acepto el tratamiento de mis datos personales según la',
    privacyLink: 'Política de privacidad',
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
export const WHATSAPP_URL = 'https://wa.link/bxjfgq'
export const MY_SOCIAL_MEDIA: SocialMediaType[] = [
  {
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/in/ingmiguelalvarez/',
    icon: 'mdi:linkedin'
  },
  {
    name: 'GitHub',
    link: 'https://github.com/migueljalvarez',
    icon: 'mdi:github'
  }
]

/* Phases of software development */
export const DEVELOPMENT_PHASES = [
  {
    title: 'Descubrimiento y análisis',
    description: 'Definimos el problema, los usuarios y el alcance del producto.'
  },
  {
    title: 'Planificación y arquitectura',
    description: 'Priorizamos el alcance y elegimos una solución técnica adecuada.'
  },
  {
    title: 'Diseño de experiencia',
    description: 'Organizamos los flujos y la interfaz para que el producto sea claro y usable.'
  },
  {
    title: 'Desarrollo e integración',
    description: 'Construimos el producto y conectamos sus componentes y servicios.'
  },
  {
    title: 'Pruebas y validación',
    description: 'Comprobamos que la solución funcione y cumpla los objetivos acordados.'
  },
  {
    title: 'Despliegue y evolución',
    description: 'Publicamos el producto y lo mejoramos a partir de su uso real.'
  }
]

export const META = {
  TITLE: 'Miguel Álvarez',
  DESCRIPTION:
    'Desarrollo de Software y Soluciones Digitales. Ayudo a emprendedores y empresas a convertir ideas en sitios, sistemas y MVPs sostenibles. Con 10+ años de experiencia, construyo soluciones digitales eficientes y escalables.'
}

/**
 * Respaldo de la sección "Sobre mí": se usa cuando la API no está configurada, no responde, no tiene
 * nada publicado o devuelve algo inválido. Mismo contenido que se veía antes de gestionarlo desde el panel.
 */
export const ABOUT_FALLBACK: AboutContent = {
  eyebrow: HOME_COPY.about.eyebrow,
  heading: HOME_COPY.about.heading,
  intro: HOME_COPY.about.intro,
  role: HOME_COPY.about.role,
  tagline: HOME_COPY.about.tagline,
  name: HOME_COPY.about.name,
  interests: [...HOME_COPY.about.interests],
  quote: HOME_COPY.about.quote,
  howIWork: HOME_COPY.about.howIWork,
  beyondWork: HOME_COPY.about.beyondWork,
  location: HOME_COPY.about.location,
  workMode: HOME_COPY.about.remote,
  stats: HOME_COPY.about.highlights.map(item => ({ ...item })),
  availability: HOME_COPY.hero.availability,
  cta: { label: WHATSAPP_CTA_LABEL, href: WHATSAPP_URL },
  tools: [],
  images: [{ src: '/ma.webp', alt: HOME_COPY.about.imageAlt, width: 1536, height: 1024 }]
}
