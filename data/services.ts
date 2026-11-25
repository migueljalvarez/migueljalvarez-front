import { GUIDE_REWRITE_OR_IMPROVE } from './guides'

export type ServiceOffering = {
  id: string
  situation: string
  title: string
  tags: string[]
  audience: string
  approach: string
  deliverables: string
  phases: number[]
  /** Guía relacionada (enlace interno que se muestra en el detalle del servicio). */
  guide?: { label: string; to: string }
}

// Copy provisional hasta disponer del HTML de referencia.
export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    id: 'construir-una-idea',
    situation: 'Tengo una idea o necesito construir algo',
    title: 'De la idea a un producto que puedas usar y hacer crecer.',
    tags: ['Primera versión (MVP)', 'Página web', 'Plataforma (SaaS)', 'Software a la medida'],
    audience:
      'Para emprendedores y equipos que necesitan validar una idea o construir una herramienta digital desde cero.',
    approach:
      'Analizo el problema, defino un alcance viable y desarrollo la solución con una base técnica preparada para evolucionar.',
    deliverables:
      'Una solución funcional, una experiencia clara y una base de código documentada para seguir creciendo.',
    phases: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 'mejorar-un-producto',
    situation: 'Ya tengo algo y necesito que funcione mejor',
    title: 'Un sistema más ordenado y confiable, sin detener tu operación.',
    tags: ['Revisión de código', 'Ordenar lo que ya existe'],
    audience:
      'Para empresas y equipos con un sistema en marcha que necesitan resolver problemas que frenan su operación o añadir capacidades.',
    approach:
      'Reviso el estado actual, identifico riesgos y oportunidades, y priorizo cambios que mejoren la estabilidad y el uso del producto.',
    deliverables:
      'Hallazgos priorizados, decisiones técnicas explicadas y mejoras implementadas con pruebas acordes al alcance.',
    phases: [1, 2, 4, 5]
  },
  {
    id: 'decidir-antes-de-invertir',
    situation: 'Necesito decidir bien antes de invertir',
    title: 'Claridad sobre el camino antes de comprometer tiempo y presupuesto.',
    tags: ['Consultoría técnica'],
    audience:
      'Para personas y organizaciones que necesitan evaluar una idea, una arquitectura o una decisión técnica importante.',
    approach:
      'Analizo objetivos, restricciones y alternativas para separar lo esencial de lo accesorio y entender los riesgos.',
    deliverables:
      'Recomendaciones concretas, opciones comparadas y próximos pasos acordes a tus prioridades.',
    phases: [1, 2],
    guide: {
      label: '¿Rehacer o mejorar tu software? Cómo decido antes de invertir',
      to: GUIDE_REWRITE_OR_IMPROVE.path
    }
  }
]
