// Política de tratamiento de datos personales (Ley 1581 de 2012 y Decreto 1377 de 2013, compilado en el Decreto 1074 de 2015).
// BORRADOR: debe ser revisado por una persona con conocimiento legal antes de publicarse.
import type { LegalSection } from '~/types/legal'
import { cityWithCountry, legalIdText, type LegalHolder } from '~/utils/legalHolder'

export const PRIVACY_UPDATED_AT = '2026-11-20'
// Correo de respaldo (ejemplo): el real sale de NUXT_PUBLIC_LEGAL_EMAIL y nunca se escribe en el repositorio público.
export const PRIVACY_CONTACT_EMAIL = 'correo@example.com'

export type PrivacySection = LegalSection

/** Párrafo de "Responsable": usa los datos del titular que existan; sin ninguno, el texto de marca de siempre. */
const buildResponsibleParagraph = (holder: LegalHolder) => {
  const idText = legalIdText(holder)
  const who = holder.name
    ? `${holder.name}, persona natural${idText ? `, identificado con ${idText}` : ''}`
    : 'Miguel Álvarez, persona natural'
  const where = holder.city ? cityWithCountry(holder.city) : 'Medellín, Colombia'
  return `${who}, con domicilio en ${where}, es el responsable del tratamiento de los datos personales que recibe a través de este sitio web (migueljalvarez.com).`
}

export const getPrivacySections = (holder: LegalHolder): PrivacySection[] => {
  const contactEmail = holder.email || PRIVACY_CONTACT_EMAIL
  return [
    {
      id: 'responsable',
      title: 'Responsable del tratamiento',
      paragraphs: [
        buildResponsibleParagraph(holder),
        `Para consultas, reclamos o el ejercicio de tus derechos puedes escribir a ${contactEmail}.`
      ]
    },
    {
      id: 'datos',
      title: 'Qué datos recojo',
      paragraphs: [
        'Los datos personales que recojo son los que tú me envías al usar el formulario de contacto. Aparte, cuento de forma anónima los clics en los botones de contacto, como explico en la sección siguiente:'
      ],
      items: [
        'Nombre y correo electrónico.',
        'El asunto que eliges y el mensaje que escribes.',
        'De forma técnica y transitoria, tu dirección IP, únicamente para limitar envíos repetidos y evitar abusos (no se usa para identificarte).'
      ]
    },
    {
      id: 'clics',
      title: 'Conteo anónimo de clics',
      paragraphs: [
        'Para saber qué canal de contacto prefieren las personas, cuento de forma anónima y agregada qué botones de contacto se pulsan en este sitio (por ejemplo, el de WhatsApp o «Ver cómo trabajo»). Cada clic se guarda solo con la página donde ocurre, si usas móvil o escritorio y, si llegas desde un enlace con campaña, el origen de ese enlace.',
        'No uso cookies para esto, no guardo tu dirección IP (solo se usa un instante, en memoria, para limitar abusos) ni ningún dato que te identifique, y no relaciono estos conteos con lo que escribes en el formulario. Los conteos se conservan 13 meses.'
      ]
    },
    {
      id: 'sensibles',
      title: 'Datos sensibles y menores de edad',
      paragraphs: [
        'No solicito datos sensibles ni datos de niños, niñas o adolescentes. Este sitio no está dirigido a menores de edad. Si crees que he recibido datos de este tipo por error, escríbeme y los eliminaré.'
      ]
    },
    {
      id: 'finalidades',
      title: 'Para qué uso tus datos',
      paragraphs: [
        'No vendo ni cedo tus datos a terceros y no los uso para enviarte publicidad masiva. Si más adelante quisiera usarlos para otra finalidad, te lo pediré de forma expresa.'
      ],
      items: [
        'Responder a tu consulta o solicitud.',
        'Valorar tu necesidad y, si aplica, enviarte una propuesta de servicios.',
        'Gestionar la relación comercial y el seguimiento de la conversación.',
        'Cumplir obligaciones legales y atender requerimientos de autoridades competentes.'
      ]
    },
    {
      id: 'autorizacion',
      title: 'Autorización',
      paragraphs: [
        'Al enviar el formulario de contacto me autorizas de manera previa, expresa e informada para tratar tus datos con las finalidades descritas. Puedes revocar esta autorización en cualquier momento escribiéndome al correo indicado.'
      ]
    },
    {
      id: 'testimonios',
      title: 'Testimonios de clientes',
      paragraphs: [
        'Si trabajamos juntos, puedo pedirte un testimonio sobre cómo fue la experiencia. Para eso te envío un correo con un enlace único y personal, que solo sirve para enviarlo y deja de funcionar pasados unos días. Con esa solicitud trato los siguientes datos:'
      ],
      items: [
        'Tu nombre y tu correo electrónico, para enviarte la solicitud.',
        'El nombre del proyecto y, si lo incluyo, un mensaje mío para ti.',
        'Lo que escribas en el formulario: tu testimonio y, si quieres, tu nombre, cargo y empresa.',
        'Tu autorización expresa para publicarlo.'
      ]
    },
    {
      id: 'testimonios-publicacion',
      title: 'Publicación y retiro de un testimonio',
      paragraphs: [
        'Uso tu testimonio para valorar mi trabajo y, solo si lo autorizas de forma expresa al enviarlo, para publicarlo en este sitio con el nombre, el cargo y la empresa que hayas indicado. Nada se publica sin esa autorización, y antes de hacerlo lo reviso y lo apruebo yo.',
        `Puedes pedirme en cualquier momento que retire tu testimonio escribiendo a ${contactEmail}; lo quitaré del sitio. Conservo la solicitud y tu respuesta el tiempo necesario para estas finalidades.`
      ]
    },
    {
      id: 'terceros',
      title: 'Proveedores que intervienen',
      paragraphs: [
        'Para prestar el servicio utilizo proveedores tecnológicos que pueden tratar datos en mi nombre, por ejemplo para el alojamiento del sitio, el envío de correos y el almacenamiento de la información del panel de gestión. Algunos pueden estar ubicados fuera de Colombia, por lo que tus datos podrían ser transferidos o transmitidos a otros países. Procuro elegir proveedores con medidas de seguridad adecuadas.',
        'Si me escribes por WhatsApp, esa conversación se rige además por los términos y la política de privacidad de WhatsApp (Meta). Yo solo trato lo que me compartas por ese medio para las mismas finalidades descritas en esta política.'
      ]
    },
    {
      id: 'conservacion',
      title: 'Cuánto tiempo conservo tus datos',
      paragraphs: [
        'Conservo tus datos el tiempo necesario para cumplir las finalidades anteriores y las obligaciones legales aplicables. Cuando dejen de ser necesarios, los eliminaré o anonimizaré.'
      ]
    },
    {
      id: 'derechos',
      title: 'Tus derechos',
      paragraphs: ['Como titular de los datos tienes derecho a:'],
      items: [
        'Conocer, actualizar y rectificar tus datos personales.',
        'Solicitar prueba de la autorización que me diste.',
        'Ser informado sobre el uso que he dado a tus datos.',
        'Revocar la autorización y solicitar la supresión de tus datos cuando no se respeten los principios y garantías legales.',
        'Acceder de forma gratuita a tus datos personales.',
        'Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la normativa de protección de datos.'
      ]
    },
    {
      id: 'ejercer',
      title: 'Cómo ejercer tus derechos',
      paragraphs: [
        `Envía tu consulta o reclamo a ${contactEmail} indicando tu nombre, el correo con el que me escribiste y lo que solicitas. En un reclamo cuéntame además qué hechos lo motivan y adjunta los documentos que quieras hacer valer.`,
        'Responderé las consultas en un máximo de 10 días hábiles; si no puedo hacerlo en ese plazo, te lo avisaré antes de que venza, te diré el motivo y te daré una nueva fecha, que no pasará de 5 días hábiles más.',
        'Responderé los reclamos en un máximo de 15 días hábiles; si no puedo hacerlo en ese plazo, te lo avisaré antes de que venza, te diré el motivo y te daré una nueva fecha, que no pasará de 8 días hábiles más. Si tu reclamo llega incompleto, te pediré lo que falta.'
      ]
    },
    {
      id: 'seguridad',
      title: 'Seguridad',
      paragraphs: [
        'Aplico medidas técnicas y organizativas razonables para proteger tus datos contra pérdida, acceso no autorizado o uso indebido. Ningún sistema es completamente infalible, pero trabajo para mantener estas medidas al día.'
      ]
    },
    {
      id: 'cambios',
      title: 'Cambios en esta política',
      paragraphs: [
        'Si actualizo esta política, publicaré la nueva versión en esta misma página con su fecha de actualización.'
      ]
    }
  ]
}
