import {
  isLegalHolderComplete,
  legalHolderSentence,
  legalIdText,
  normalizeLegalHolder
} from '~/utils/legalHolder'

/**
 * Titular del sitio desde la configuración pública (NUXT_PUBLIC_LEGAL_*). Cada dato se muestra solo si existe.
 */
export const useLegalHolder = () => {
  const config = useRuntimeConfig().public.legal
  const holder = computed(() => normalizeLegalHolder(config))
  const isComplete = computed(() => isLegalHolderComplete(holder.value))
  const sentence = computed(() => legalHolderSentence(holder.value))
  const idText = computed(() => legalIdText(holder.value))
  return { holder, isComplete, sentence, idText }
}
