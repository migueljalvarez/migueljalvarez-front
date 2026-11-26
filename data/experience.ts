/**
 * «Situaciones que ya he resuelto» (home). Casos de experiencia profesional contados SIN nombres de empresas
 * ni detalles que las identifiquen (repositorio y sitio públicos). No son proyectos de portafolio.
 */
export type ExperienceCase = {
  id: string
  title: string
  text: string
}

export const EXPERIENCE_COPY = {
  eyebrow: 'Experiencia',
  heading: 'Situaciones que ya he resuelto',
  description: 'Problemas reales de mi experiencia, resumidos para que reconozcas el tuyo.',
  prompt: '¿Te suena alguna?',
  cta: 'Ver cómo empezamos y cuánto cuesta'
}

export const EXPERIENCE_CASES: ExperienceCase[] = [
  {
    id: 'sistema-heredado',
    title: 'Un sistema que ya no daba más',
    text: 'Revisé el código, expliqué los riesgos y presenté opciones. El cliente eligió una y la ejecuté ajustada a su tiempo y presupuesto.'
  },
  {
    id: 'api-lenta-de-construir',
    title: 'Una API que se estaba alargando',
    text: 'La empresa la necesitaba para agilizar sus procesos. Entendí la necesidad, encontré los patrones que se repetían y la simplifiqué eliminando código duplicado.'
  },
  {
    id: 'fallas-recurrentes',
    title: 'Fallas que volvían una y otra vez',
    text: 'Encontré la causa de un error crítico en producción, lo corregí y los incidentes dejaron de repetirse.'
  }
]
