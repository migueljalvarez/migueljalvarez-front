import { PORTFOLIO_PROJECTS } from '~/constants/portfolio'
import { ABOUT_FALLBACK, MY_SOCIAL_MEDIA } from '~/constants/common'
import { PRICING_FALLBACK_OFFERS } from '~/data/pricing'
import { WORK_POLICY_BLOCKS } from '~/data/work'
import type { AboutContent } from '~/types/about'
import type { PortfolioType, SocialMediaType } from '~/types/common'
import type { ServiceOfferView } from '~/types/pricing'
import {
  mapApiAbout,
  mapApiPolicy,
  mapApiPortfolioEntry,
  mapApiServiceOffers,
  mapApiSocialLink,
  type ApiPolicy,
  type ApiPortfolioEntry,
  type ApiSocialLink,
  type PolicyBlock
} from '~/utils/publicContent'
import { createPublicApiClient } from './publicApiClient'

/**
 * Contenido público del sitio. Fuente principal: la API (se gestiona desde el panel). Si la API no está
 * configurada, no responde o no tiene nada publicado, se usa el contenido de respaldo del código, de
 * modo que el landing nunca cae ni queda vacío.
 */

const apiClient = () => {
  const id = getServerSecret('apiAccessClientId')
  const secret = getServerSecret('apiAccessClientSecret')
  return createPublicApiClient({
    baseUrl: getServerSecret('apiBaseUrl'),
    // Credenciales de servicio de Cloudflare Access (solo si la API está detrás de Access).
    headers: id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {},
    onError: (path, reason) => console.warn(`[public-api] ${path}: ${reason}; se usa el respaldo`)
  })
}

/** Proyectos del portafolio, con los destacados primero (la API ya los entrega ordenados). */
export const getPortfolioItems = async (): Promise<PortfolioType[]> => {
  const entries = await apiClient().get<ApiPortfolioEntry[]>('/api/portfolio')
  if (entries && entries.length > 0) return entries.map(mapApiPortfolioEntry)
  return PORTFOLIO_PROJECTS
}

export const getSocialLinks = async (): Promise<SocialMediaType[]> => {
  const links = await apiClient().get<ApiSocialLink[]>('/api/social-links')
  if (links && links.length > 0) return links.map(mapApiSocialLink)
  return MY_SOCIAL_MEDIA.map(item => ({ ...item }))
}

export const getPolicyBlocks = async (): Promise<PolicyBlock[]> => {
  const policies = await apiClient().get<ApiPolicy[]>('/api/policies')
  if (policies && policies.length > 0) return policies.map(mapApiPolicy)
  return WORK_POLICY_BLOCKS.map((block, index) =>
    mapApiPolicy({ title: block.title, body: block.text }, index)
  )
}

/**
 * Ofertas de `/como-cobro`. Los precios solo salen de la API (panel); el respaldo del código trae las mismas
 * ofertas sin precio para no publicar un monto que ya no sea el vigente.
 */
export const getServiceOffers = async (): Promise<ServiceOfferView[]> => {
  const offers = mapApiServiceOffers(await apiClient().get<unknown>('/api/service-offers'))
  if (offers.length > 0) return offers
  return PRICING_FALLBACK_OFFERS.map(offer => ({ ...offer, includes: [...offer.includes] }))
}

/** "Sobre mí": el publicado en la API (404 = sin publicar) o, si no hay o es inválido, el respaldo. */
export const getAbout = async (): Promise<AboutContent> => {
  const about = mapApiAbout(await apiClient().get<unknown>('/api/about'))
  return about ?? { ...ABOUT_FALLBACK, stats: ABOUT_FALLBACK.stats.map(item => ({ ...item })) }
}
