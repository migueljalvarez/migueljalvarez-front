export type WorkPolicyBlock = {
  id: string
  titulo: string
  texto: string
}

export type WorkFaqItem = {
  pregunta: string
  respuesta: string
}

export type WorkNonNegotiable = {
  texto: string
  nota?: string
}

// Copy provisional hasta disponer del HTML de referencia.
export const WORK_COMMITMENTS = [
  'El código y los accesos son tuyos.',
  'Te digo cuándo algo no te conviene, aunque eso signifique construir menos.',
  'Uso IA con transparencia y respondo por el resultado.',
  'Explico las decisiones técnicas importantes.',
  'Acuerdo el alcance antes de implementar.'
]

export const WORK_NON_NEGOTIABLES: WorkNonNegotiable[] = [
  {
    texto: 'No construyo clones que suplanten la identidad de otra marca o sitio.',
    nota: 'Me inspiro en referencias, no copio identidades.'
  },
  {
    texto:
      'No participo en engaños a terceros (reseñas falsas, phishing) ni en el uso abusivo de datos personales.'
  },
  { texto: 'No prometo resultados que dependan de factores fuera del proyecto.' },
  { texto: 'No recomiendo complejidad ni herramientas que no aporten valor.' },
  { texto: 'No reutilizo código o activos sin respetar sus licencias.' }
]

export const WORK_POLICY_BLOCKS: WorkPolicyBlock[] = [
  {
    id: 'codigo',
    titulo: 'El código',
    texto:
      'El repositorio vive en tu cuenta desde el primer día. Al completar el pago, los derechos del código desarrollado para ti pasan a ser tuyos, por contrato. Mis librerías y herramientas previas, y el software open source, conservan su licencia original. Lo escribo pensando en su propósito y legibilidad, para que otros puedan mantenerlo.'
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
      'No. Es posible aclarar los requisitos, priorizar lo importante y definir un alcance inicial que se ajuste a tus necesidades.'
  },
  {
    pregunta: '¿Aceptas trabajos puntuales?',
    respuesta:
      'Sí. Una revisión de código, una refactorización o una consultoría se pueden contratar por separado, sin necesidad de un proyecto completo. Si después quieres continuar, el siguiente paso se acuerda en ese momento.'
  },
  {
    pregunta: '¿Cómo se estima el trabajo?',
    respuesta:
      'La estimación parte del alcance entendido y de sus riesgos. Si aparecen nuevos requisitos, revisamos prioridades y acuerdos antes de continuar.'
  }
]
