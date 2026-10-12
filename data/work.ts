export type WorkPolicyBlock = {
  id: string
  titulo: string
  texto: string
}

export type WorkFaqItem = {
  pregunta: string
  respuesta: string
}

// Copy provisional hasta disponer del HTML de referencia.
export const WORK_COMMITMENTS = [
  'Explicar las decisiones técnicas con claridad.',
  'Priorizar soluciones útiles, mantenibles y acordes al alcance.',
  'Mantener una comunicación honesta durante el proceso.'
]

export const WORK_NON_NEGOTIABLES = [
  'No prometo resultados que dependan de factores fuera del proyecto.',
  'No recomiendo complejidad ni herramientas que no aporten valor.',
  'No reutilizo código o activos sin respetar sus licencias.'
]

export const WORK_IDENTITY_NOTE = 'Me inspiro en referencias, no copio identidades.'

export const WORK_POLICY_BLOCKS: WorkPolicyBlock[] = [
  {
    id: 'codigo',
    titulo: 'El código',
    texto:
      'El código se construye pensando en su propósito, legibilidad y mantenimiento. Las decisiones importantes se explican y el alcance se acuerda antes de implementarlo.'
  },
  {
    id: 'lanzamiento',
    titulo: 'Después del lanzamiento',
    texto:
      'Publicar es un comienzo, no el final. Podemos definir soporte y evolución según las necesidades reales del producto, con responsabilidades y tiempos acordados.'
  },
  {
    id: 'ia',
    titulo: 'Uso de IA',
    texto:
      'Uso herramientas de IA como apoyo cuando aportan valor. Reviso y valido sus resultados; la responsabilidad sobre las decisiones y el código sigue siendo humana.'
  }
]

export const WORK_FAQ: WorkFaqItem[] = [
  {
    pregunta: '¿Cómo empieza un proyecto?',
    respuesta:
      'Empezamos con una conversación para entender el problema, los objetivos, las restricciones y qué resultado sería útil.'
  },
  {
    pregunta: '¿Necesito tener todos los requisitos definidos?',
    respuesta:
      'No. Podemos aclararlos juntos, priorizar lo importante y construir un alcance inicial que se ajuste a tus necesidades.'
  },
  {
    pregunta: '¿Qué pasa después del lanzamiento?',
    respuesta:
      'Acordamos de antemano si necesitas acompañamiento, soporte o nuevas etapas. No se asume mantenimiento sin definirlo.'
  },
  {
    pregunta: '¿Cómo se estima el trabajo?',
    respuesta:
      'La estimación parte del alcance entendido y de sus riesgos. Si aparecen nuevos requisitos, revisamos prioridades y acuerdos antes de continuar.'
  }
]
