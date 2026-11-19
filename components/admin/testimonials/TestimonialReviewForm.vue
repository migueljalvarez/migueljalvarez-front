<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    NO_CONSENT_MESSAGE,
    TESTIMONIAL_LIMITS,
    buildReviewPayload,
    reviewFormFromRecord,
    type ReviewFormValues,
    type TestimonialRecord
  } from '~/utils/admin/testimonials'

  // Revisión de una respuesta: texto original (inmutable), texto a publicar (editable), cargo y empresa.
  // Aprobar exige el consentimiento de publicación del cliente; la decisión se puede cambiar después
  // (p. ej. rechazar una aprobada la retira de la web).
  const props = defineProps<{ record: TestimonialRecord }>()
  const emit = defineEmits<{ reviewed: [record: TestimonialRecord, message: string] }>()

  const testimonials = useAdminTestimonials()
  const uid = useId()
  const values = reactive<ReviewFormValues>(reviewFormFromRecord(props.record))
  const errors = ref<Record<string, string>>({})
  const failure = ref('')
  const busy = ref<'approve' | 'reject' | null>(null)

  watch(
    () => props.record.id,
    () => {
      Object.assign(values, reviewFormFromRecord(props.record))
      errors.value = {}
      failure.value = ''
    }
  )

  const edited = computed(() => values.publishedText.trim() !== (props.record.answer ?? '').trim())

  const decide = async (decision: 'approve' | 'reject') => {
    failure.value = ''
    const check = buildReviewPayload(decision, values, props.record)
    if (!check.ok) {
      errors.value = check.errors
      failure.value = check.errors._ ?? ''
      await nextTick()
      document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
      return
    }
    errors.value = {}
    busy.value = decision
    try {
      const saved = await testimonials.review(props.record.id, check.data)
      emit(
        'reviewed',
        saved,
        decision === 'approve' ? 'Testimonio aprobado y publicado' : 'Testimonio rechazado'
      )
    } catch (error) {
      failure.value = toAdminApiError(error).message
    } finally {
      busy.value = null
    }
  }
</script>

<template>
  <div class="space-y-4">
    <figure class="space-y-2">
      <figcaption class="text-xs text-brand-muted">
        Texto original del cliente (no se modifica)
      </figcaption>
      <blockquote
        class="whitespace-pre-line rounded-xl border-l-4 border-brand-blue bg-brand-surface-soft p-4 text-base leading-7 text-brand-ink"
      >
        {{ record.answer }}
      </blockquote>
    </figure>

    <p
      v-if="record.consentPublish"
      class="flex items-start gap-2 text-sm font-medium text-brand-success-text"
    >
      <Icon
        name="mdi:check-decagram-outline"
        size="20"
        class="mt-0.5 shrink-0"
        aria-hidden="true"
      />
      El cliente autorizó publicar su texto, nombre, cargo y empresa (Ley 1581).
    </p>
    <p v-else class="flex items-start gap-2 text-sm font-medium text-brand-error-text">
      <Icon name="mdi:alert-circle-outline" size="20" class="mt-0.5 shrink-0" aria-hidden="true" />
      {{ NO_CONSENT_MESSAGE }}
    </p>

    <AdminInput
      :id="`${uid}-text`"
      v-model="values.publishedText"
      label="Texto a publicar"
      type="textarea"
      :rows="5"
      :maxlength="TESTIMONIAL_LIMITS.publishedText"
      counter
      :hint="
        edited
          ? 'Editaste el texto: se publica esta versión y el original se conserva.'
          : 'Sin cambios: se publica el texto original. Puedes ajustar ortografía o recortarlo.'
      "
      :error="errors.publishedText"
    />
    <div class="grid gap-4 sm:grid-cols-2">
      <AdminInput
        :id="`${uid}-role`"
        v-model="values.authorRole"
        label="Cargo (opcional)"
        :maxlength="TESTIMONIAL_LIMITS.authorRole"
        :error="errors.authorRole"
      />
      <AdminInput
        :id="`${uid}-company`"
        v-model="values.authorCompany"
        label="Empresa (opcional)"
        :maxlength="TESTIMONIAL_LIMITS.authorCompany"
        :error="errors.authorCompany"
      />
    </div>

    <AdminNotice tone="error" :message="failure" />

    <div
      class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end [&>*]:w-full sm:[&>*]:w-auto"
    >
      <AdminButton
        variant="danger"
        :disabled="busy === 'approve'"
        :loading="busy === 'reject'"
        loading-label="Rechazando…"
        @click="decide('reject')"
      >
        {{ record.status === 'aprobada' ? 'Rechazar y retirar de la web' : 'Rechazar' }}
      </AdminButton>
      <AdminButton
        variant="primary"
        :disabled="busy === 'reject'"
        :loading="busy === 'approve'"
        loading-label="Aprobando…"
        @click="decide('approve')"
      >
        {{ record.status === 'aprobada' ? 'Guardar cambios' : 'Aprobar y publicar' }}
      </AdminButton>
    </div>
  </div>
</template>
