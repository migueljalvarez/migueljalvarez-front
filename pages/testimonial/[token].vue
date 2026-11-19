<script setup lang="ts">
  import TestimonialSubmit from '~/components/templates/TestimonialSubmit/TestimonialSubmit.vue'
  import type { TestimonialSubmission } from '~/utils/testimonialSubmission'

  // URL pública en español por SEO/claridad; el archivo va en inglés. Enlace único del correo: no se
  // indexa, no envía el referrer y el token nunca entra en el canonical ni en Open Graph.
  definePageMeta({ path: '/testimonio/:token' })
  useSeoMeta({ title: 'Tu testimonio', robots: 'noindex, nofollow' })
  useHead({ meta: [{ name: 'referrer', content: 'no-referrer' }] })

  const token = String(useRoute().params.token ?? '')
  const { form, loadPhase, refresh, submit } = await useTestimonialRequest(token)

  const submitting = ref(false)
  const sent = ref(false)
  const submitError = ref('')
  const failedPhase = ref<'invalid' | null>(null)

  const phase = computed<'form' | 'sent' | 'invalid' | 'limited' | 'unavailable'>(() => {
    if (sent.value) return 'sent'
    if (failedPhase.value) return failedPhase.value
    if (loadPhase.value) return loadPhase.value
    return form.value ? 'form' : 'unavailable'
  })

  const onSubmit = async (data: TestimonialSubmission) => {
    submitting.value = true
    submitError.value = ''
    const failure = await submit(data)
    submitting.value = false
    if (!failure) {
      sent.value = true
      return
    }
    // Un enlace que dejó de servir sale de la pantalla; un fallo puntual conserva el texto escrito.
    if (failure.phase === 'invalid') failedPhase.value = 'invalid'
    else submitError.value = failure.message
  }
</script>

<template>
  <TestimonialSubmit
    :phase="phase"
    :client-name="form?.clientName"
    :project-name="form?.projectName"
    :message="form?.message"
    :expires-at="form?.expiresAt"
    :submitting="submitting"
    :error="submitError"
    @submit="onSubmit"
    @retry="refresh()"
  />
</template>
