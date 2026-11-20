// Términos y condiciones de uso del sitio y de los servicios (Colombia).
// BORRADOR: debe ser revisado por una persona con conocimiento legal antes de depender de él.
import { PRIVACY_CONTACT_EMAIL } from '~/data/privacy'
import type { LegalSection } from '~/types/legal'
import { cityWithCountry, legalHolderSentence, type LegalHolder } from '~/utils/legalHolder'

export const TERMS_UPDATED_AT = '2026-11-20'

export type TermsSection = LegalSection

export const getTermsSections = (holder: LegalHolder): TermsSection[] => {
  const contactEmail = holder.email || PRIVACY_CONTACT_EMAIL
  const holderSentence = legalHolderSentence(holder)
  const where = holder.city ? cityWithCountry(holder.city) : 'Colombia'

  return [
    {
      id: 'titular',
      title: 'Quién opera este sitio',
      paragraphs: [
        ...(holderSentence ? [holderSentence] : []),
        `Estos términos regulan el uso de este sitio web (migueljalvarez.com) y la relación inicial con quien me contacta. Soy una persona natural que presta servicios de desarrollo de software de forma independiente, con base en ${where} y trabajo remoto.`,
        'Al navegar por el sitio o enviarme un mensaje aceptas estos términos. Si no estás de acuerdo con alguno, te pido que no uses el sitio.'
      ]
    },
    {
      id: 'objeto',
      title: 'Para qué sirve el sitio',
      paragraphs: [
        'Este sitio presenta quién soy, cómo trabajo y los servicios que ofrezco, y te permite escribirme para contarme tu proyecto. Hoy el sitio no vende productos ni cobra pagos en línea: es una vía de contacto y de información.',
        'La información publicada es orientativa. No constituye una oferta vinculante ni una promesa de resultados.'
      ]
    },
    {
      id: 'servicios',
      title: 'Cómo se contratan los servicios',
      paragraphs: [
        'Los servicios no se contratan por el solo hecho de usar el sitio o escribirme. Después de conversar sobre tu necesidad, te enviaré una propuesta y, si la aceptas, firmaremos un acuerdo individual por escrito.',
        'Ese acuerdo define el alcance, los entregables, los tiempos, el valor y la forma de pago, la propiedad del trabajo y la confidencialidad. Si algo de una propuesta o contrato contradice estos términos, prevalece lo pactado por escrito para ese servicio.'
      ],
      items: [
        'La primera consulta es sin costo y no genera ninguna obligación para ninguna de las partes.',
        'Procuro responder en menos de 24 horas hábiles, sin que esto sea una garantía.',
        'Los cambios de alcance se acuerdan por escrito antes de ejecutarse.'
      ]
    },
    {
      id: 'propiedad',
      title: 'Propiedad intelectual',
      paragraphs: [
        'Los textos, el diseño, el logo, las imágenes y el código propio de este sitio son míos o se usan con autorización, y están protegidos por las normas de propiedad intelectual. Puedes consultarlos y compartir el enlace, pero no copiarlos ni reutilizarlos con fines comerciales sin mi permiso previo y por escrito.',
        'Las marcas y los proyectos de terceros que aparecen en el portafolio pertenecen a sus dueños y se muestran como referencia de trabajo realizado, con su conocimiento.',
        'La propiedad del trabajo que desarrolle para ti se define en el acuerdo individual de cada proyecto.'
      ]
    },
    {
      id: 'uso',
      title: 'Uso aceptable',
      paragraphs: ['Al usar el sitio te comprometes a no:'],
      items: [
        'Enviar mensajes falsos, ofensivos, engañosos o con contenido ilegal.',
        'Intentar acceder sin permiso a zonas privadas, sistemas o datos del sitio.',
        'Sobrecargar el sitio, automatizar envíos del formulario o interferir con su funcionamiento.',
        'Suplantar a otra persona o usar datos de terceros sin su autorización.'
      ]
    },
    {
      id: 'responsabilidad',
      title: 'Limitación de responsabilidad',
      paragraphs: [
        'Me esfuerzo por mantener el sitio disponible y la información al día, pero se ofrece tal como está: puede tener interrupciones, errores o contenido desactualizado, y no garantizo que esté libre de fallos.',
        'En la medida que la ley lo permita, no respondo por daños indirectos derivados del uso del sitio o de la confianza en su información. Esto no limita la responsabilidad que la ley no permita excluir, ni lo que se pacte en un acuerdo de servicios.'
      ]
    },
    {
      id: 'terceros',
      title: 'Enlaces y servicios de terceros',
      paragraphs: [
        'El sitio puede enlazar a páginas o redes sociales de terceros (por ejemplo, WhatsApp, mis perfiles profesionales o proyectos del portafolio). No controlo su contenido ni sus políticas, y su uso se rige por los términos de cada uno.'
      ]
    },
    {
      id: 'datos',
      title: 'Protección de datos personales',
      paragraphs: [
        'Trato los datos que me envías conforme a la Ley 1581 de 2012 y sus normas complementarias. En la política de tratamiento de datos explico qué recojo, para qué lo uso y cómo puedes ejercer tus derechos.'
      ],
      link: { label: 'Leer la política de privacidad', to: '/privacidad' }
    },
    {
      id: 'productos',
      title: 'Si más adelante ofrezco productos',
      paragraphs: [
        'Hoy no vendo productos ni servicios directamente en el sitio. Si algún día lo hago, publicaré aquí las condiciones de esa venta (precio, forma de pago, entrega y derecho de retracto cuando aplique, conforme al Estatuto del Consumidor) antes de ofrecerla.'
      ]
    },
    {
      id: 'ley',
      title: 'Ley aplicable y jurisdicción',
      paragraphs: [
        'Estos términos se rigen por las leyes de la República de Colombia. Las diferencias que surjan se buscarán resolver primero de forma directa y de buena fe; si no es posible, serán competentes los jueces de Colombia.'
      ]
    },
    {
      id: 'cambios',
      title: 'Cambios en estos términos',
      paragraphs: [
        'Puedo actualizar estos términos cuando cambien el sitio, mis servicios o la normativa. Publicaré la nueva versión en esta misma página con su fecha de actualización; seguir usando el sitio después implica aceptar la versión vigente.'
      ]
    },
    {
      id: 'contacto',
      title: 'Contacto',
      paragraphs: [`Para cualquier duda sobre estos términos puedes escribir a ${contactEmail}.`]
    }
  ]
}
