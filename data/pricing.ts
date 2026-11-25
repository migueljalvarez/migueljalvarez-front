import type { PricingTerm, ServiceOfferView } from '~/types/pricing'

/**
 * Copy de `/como-cobro`. Los PRECIOS no viven aquí: se gestionan en el panel (módulo Ofertas) y llegan por
 * `GET /api/service-offers`. Esto es solo el respaldo mientras la API no responde o no tiene ofertas publicadas:
 * mismas ofertas, SIN precios (se cotizan según el alcance), para no mostrar un monto que ya no sea el vigente.
 */
export const PRICING_COPY = {
  eyebrow: 'Cómo cobro',
  heading: 'Precios claros desde la primera conversación',
  description:
    'Empieza con un servicio acotado y de precio conocido. Si después quieres construir, ya sabemos cómo trabajamos y cuánto cuesta cada paso.',
  offersHeading: 'Servicios para empezar',
  termsHeading: 'Cómo se paga',
  unpriced: 'Se cotiza según el alcance',
  ctaHeading: '¿No sabes cuál te conviene?',
  ctaText: 'Cuéntame tu caso y te digo cuál encaja, o si no necesitas ninguno todavía.'
}

/** Condiciones de cobro (texto fijo de marca; los montos cambian en el panel, estas condiciones casi nunca). */
export const PRICING_TERMS: PricingTerm[] = [
  {
    title: 'Precio «desde»',
    text: 'Es un punto de partida: el valor final depende del tamaño y la complejidad de lo que necesites, y te lo confirmo por escrito antes de empezar.'
  },
  {
    title: 'En dólares',
    text: 'Los precios están en USD. Si trabajas desde Colombia, puedes pagar en pesos al cambio del día.'
  },
  {
    title: 'Anticipo',
    text: 'En los servicios para empezar pido el 50 % antes de comenzar y el resto al entregar.'
  },
  {
    title: 'Proyectos de desarrollo',
    text: 'Se cotizan después del descubrimiento, con alcance, plazos y entregables acordados por escrito. El valor del descubrimiento se descuenta del proyecto.'
  }
]

export const PRICING_FALLBACK_OFFERS: ServiceOfferView[] = [
  {
    id: 'consulting-session',
    slug: 'consulting-session',
    title: 'Sesión de consultoría',
    summary:
      'Una conversación de 90 minutos para aclarar una idea, una decisión técnica o un problema, con un informe corto de próximos pasos.',
    includes: [
      'Sesión de 90 minutos por videollamada',
      'Informe corto con recomendaciones y próximos pasos'
    ]
  },
  {
    id: 'rewrite-or-improve-diagnosis',
    slug: 'rewrite-or-improve-diagnosis',
    title: 'Diagnóstico «¿Rehacer o mejorar?»',
    summary:
      'Reviso el estado de tu sistema y te muestro mejorar, rehacer por partes o rehacer, cada opción con su costo y su riesgo.',
    includes: [
      'Revisión del sistema y de sus riesgos',
      'Opciones comparadas con costo y riesgo',
      'Recomendación clara, incluso si es construir menos'
    ]
  },
  {
    id: 'code-review',
    slug: 'code-review',
    title: 'Revisión de código acotada',
    summary:
      'Reviso un repositorio y te entrego un informe de hallazgos priorizados, con decisiones técnicas explicadas.',
    includes: [
      'Un repositorio revisado',
      'Informe de hallazgos priorizados',
      'Recomendaciones explicadas'
    ]
  },
  {
    id: 'discovery',
    slug: 'discovery',
    title: 'Descubrimiento de proyecto',
    summary:
      'El primer paso de un proyecto: definimos el problema, el alcance, las prioridades y la solución técnica antes de construir. Su valor se descuenta del proyecto.',
    includes: [
      'Alcance y prioridades acordados',
      'Arquitectura y solución técnica propuestas',
      'Estimación del proyecto'
    ]
  }
]
