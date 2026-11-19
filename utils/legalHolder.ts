/**
 * Titular del sitio (identificación legal). Los datos NUNCA van en el código: llegan por configuración
 * (runtimeConfig.public.legal, variables NUXT_PUBLIC_LEGAL_*). Funciones puras, sin Nuxt, para poder probarlas.
 */

export type LegalIdType = 'CC' | 'NIT'

export type LegalHolder = {
  name: string
  idType: LegalIdType | ''
  idNumber: string
  email: string
  city: string
}

export const EMPTY_LEGAL_HOLDER: LegalHolder = {
  name: '',
  idType: '',
  idNumber: '',
  email: '',
  city: ''
}

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

/** Normaliza lo que llega de la configuración: recorta espacios y descarta tipos de documento no válidos. */
export const normalizeLegalHolder = (raw?: Partial<Record<keyof LegalHolder, unknown>> | null) => {
  const idType = clean(raw?.idType).toUpperCase().replace(/\./g, '')
  return {
    name: clean(raw?.name),
    idType: idType === 'CC' || idType === 'NIT' ? idType : '',
    idNumber: clean(raw?.idNumber),
    email: clean(raw?.email),
    city: clean(raw?.city)
  } as LegalHolder
}

/** Hay nombre, documento (tipo y número), correo y ciudad. */
export const isLegalHolderComplete = (holder: LegalHolder) =>
  Boolean(holder.name && holder.idType && holder.idNumber && holder.email && holder.city)

/** "C.C. 123" o "NIT 123"; vacío si falta el tipo o el número. */
export const legalIdText = (holder: LegalHolder) => {
  if (!holder.idType || !holder.idNumber) return ''
  return `${holder.idType === 'CC' ? 'C.C.' : 'NIT'} ${holder.idNumber}`
}

/**
 * Frase de identificación. Solo con nombre; el documento se añade únicamente si está completo.
 * Sin nombre devuelve cadena vacía: nunca se muestra un marcador ni "undefined".
 */
export const legalHolderSentence = (holder: LegalHolder) => {
  if (!holder.name) return ''
  const id = legalIdText(holder)
  return id
    ? `Este sitio web es operado por ${holder.name}, identificado con ${id}.`
    : `Este sitio web es operado por ${holder.name}.`
}

/** Ciudad con el país al final, sin duplicarlo si la variable ya lo incluye ("Medellín, Colombia"). */
export const cityWithCountry = (city: string) => {
  const value = city.trim()
  return /colombia/i.test(value) ? value : `${value}, Colombia`
}
