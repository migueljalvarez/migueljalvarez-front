// Guías del sitio (contenido para buscadores y para quien aún está decidiendo). Texto en primera persona, sin cifras ni
// casos inventados: si una guía necesita un dato real, se añade aquí cuando exista.
import type { Guide } from '~/types/guide'

export const GUIDE_REWRITE_OR_IMPROVE: Guide = {
  path: '/guias/rehacer-o-mejorar-software',
  eyebrow: 'Guía',
  title: '¿Rehacer o mejorar tu software? Cómo decido antes de invertir',
  seoTitle: '¿Rehacer o mejorar tu software?',
  description:
    'Te cuento cómo decido si un sistema se mejora o se rehace: señales, preguntas clave y un proceso claro antes de invertir tiempo y presupuesto.',
  publishedAt: '2026-11-20',
  updatedAt: '2026-11-20',
  intro: [
    'Un día alguien te dice: «este sistema ya no da más, hay que rehacerlo todo». Otro día, que basta con arreglar un par de cosas. Las dos opciones suenan razonables y las dos cuestan tiempo y dinero, así que conviene decidir con criterio y no por cansancio.',
    'Esto es lo que reviso yo antes de recomendar una u otra.'
  ],
  sections: [
    {
      id: 'que-duele',
      title: 'Primero, qué es lo que realmente duele',
      paragraphs: [
        'Rehacer casi nunca es la respuesta a «me molesta el software». Es la respuesta a un problema concreto. Antes de decidir, escribe en una frase qué está frenando a tu negocio:'
      ],
      items: [
        'Cada cambio tarda semanas y rompe algo más.',
        'Nadie del equipo entiende bien cómo funciona.',
        'No puedes añadir algo que tus clientes ya piden.',
        'Se cae, o es lento, justo cuando más lo necesitas.'
      ]
    },
    {
      id: 'senales-mejorar',
      title: 'Señales de que conviene mejorar lo que ya tienes',
      paragraphs: [
        'Aquí suelen servir una revisión de código, ordenar lo que más duele (refactorización) y añadir pruebas para poder cambiar sin miedo.'
      ],
      items: [
        'Lo esencial funciona: el sistema hace lo que tu negocio necesita y lo que falla es la forma (código desordenado, pocas pruebas, partes sin documentar).',
        'El problema está localizado en una zona o en una función, no en todo.',
        'Hay base sobre la que construir: los datos están ordenados y la tecnología todavía tiene soporte y gente que la conozca.',
        'Necesitas resultados pronto: mejorar por partes permite ver avances sin parar la operación.'
      ]
    },
    {
      id: 'senales-rehacer',
      title: 'Señales de que conviene rehacer',
      paragraphs: [
        'Rehacer también tiene su riesgo: se pierde conocimiento que estaba escondido en el sistema viejo y se tarda más de lo previsto. Por eso rara vez recomiendo cambiar todo de golpe.'
      ],
      items: [
        'La base ya no sostiene lo que viene: lo que necesitas hoy choca con cómo se diseñó desde el principio.',
        'La tecnología quedó sin soporte o sin personas que puedan mantenerla.',
        'Arreglar cuesta más que construir de nuevo, y eso se puede comparar con números, no con intuición.',
        'El riesgo de seguridad o de continuidad es mayor que el riesgo de cambiar.'
      ]
    },
    {
      id: 'preguntas',
      title: 'Las preguntas que me hago antes de recomendar',
      ordered: true,
      items: [
        '¿Qué problema de negocio estamos resolviendo y cómo sabremos que se resolvió?',
        '¿Qué parte del sistema causa la mayoría del dolor?',
        '¿Qué pasa si no hacemos nada durante seis meses?',
        '¿Cuánto cuesta mantener lo actual frente a cambiarlo?',
        '¿Se puede avanzar en partes, o es todo o nada?',
        '¿Quién va a mantener lo que construyamos después?'
      ]
    },
    {
      id: 'como-lo-abordo',
      title: 'Cómo lo abordo',
      paragraphs: ['No te propongo empezar por escribir código. El orden es otro:'],
      ordered: true,
      items: [
        'Entender: hablamos de tu negocio y reviso el estado real del sistema.',
        'Comparar opciones: te muestro mejorar, rehacer por partes o rehacer, cada una con su costo, su riesgo y lo que dejarías de hacer.',
        'Recomendar con claridad: te digo cuál elegir y por qué, incluso si la mejor opción es construir menos.'
      ]
    }
  ],
  cta: {
    heading: '¿Te pasa algo de esto?',
    text: 'Si tienes un sistema que se volvió difícil de cambiar, o te proponen rehacerlo todo y no sabes si vale la pena, cuéntame tu caso. Primero lo entendemos; después decidimos cómo construirlo.',
    label: 'Contarme tu caso'
  }
}

export const GUIDES = [GUIDE_REWRITE_OR_IMPROVE]
