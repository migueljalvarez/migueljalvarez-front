import {
  EMPTY_LEGAL_HOLDER,
  isLegalHolderComplete,
  legalHolderSentence,
  legalIdText,
  normalizeLegalHolder
} from '~/utils/legalHolder'

/**
 * Titular del sitio (GET /api/legal). Solo lo usan Términos y Privacidad: no viaja en las demás páginas.
 * Cada dato se muestra solo si existe. Uso: `const { holder } = await useLegalHolder()`.
 */
export const useLegalHolder = async () => {
  const { data } = await useFetch('/api/legal', {
    key: 'legal-holder',
    default: () => ({ ...EMPTY_LEGAL_HOLDER })
  })
  const holder = computed(() => normalizeLegalHolder(data.value))
  const isComplete = computed(() => isLegalHolderComplete(holder.value))
  const sentence = computed(() => legalHolderSentence(holder.value))
  const idText = computed(() => legalIdText(holder.value))
  return { holder, isComplete, sentence, idText }
}
