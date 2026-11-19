import { normalizeLegalHolder } from '../../utils/legalHolder'

// Titular del sitio para Términos y Privacidad. Se lee de las variables de entorno en ejecución
// (NUXT_PUBLIC_LEGAL_*, con NUXT_LEGAL_* como alias) y NO pasa por runtimeConfig.public: así no se
// serializa en el HTML de las demás páginas. Cada dato vacío se omite en el texto.
export default defineEventHandler(event => {
  const pick = (key: string) =>
    process.env[`NUXT_PUBLIC_LEGAL_${key}`] || process.env[`NUXT_LEGAL_${key}`] || ''

  setHeader(event, 'Cache-Control', 'public, max-age=300')
  return normalizeLegalHolder({
    name: pick('NAME'),
    idType: pick('ID_TYPE'),
    idNumber: pick('ID_NUMBER'),
    email: pick('EMAIL'),
    city: pick('CITY')
  })
})
