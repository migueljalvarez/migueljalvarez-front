import type { PolicyBlock } from '~/utils/publicContent'

/** Acuerdos de trabajo de `/como-trabajo`: API (panel) con respaldo en `data/work.ts`. */
export const usePolicies = async () => {
  const { data } = await useFetch<PolicyBlock[]>('/api/policies', {
    key: 'policies',
    default: () => []
  })
  return { policies: computed(() => data.value ?? []) }
}
