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
    title: 'Consultoría',
    icon: 'fa-solid:users',
    items: ['Aterrizaje de ideas', 'Planificación y Roadmap']
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
    title: 'Freelance',
    icon: 'fa6-solid:laptop-code',
    items: [
      'Creación de Landing Page',
      'Creación de MVPs',
      'Desarrollo de Funciones',
      'Corrección de Bugs',
      'Soporte y mantenimiento'
    ]
  }
]
