import type { ServiceOfferView } from '~/types/pricing'

/** Ofertas de `/como-cobro`: API (panel) con respaldo en `data/pricing.ts` (mismas ofertas, sin precios). */
export const useServiceOffers = async () => {
  const { data } = await useFetch<ServiceOfferView[]>('/api/service-offers', {
    key: 'service-offers',
    default: () => []
  })
  return { offers: computed(() => data.value ?? []) }
}
