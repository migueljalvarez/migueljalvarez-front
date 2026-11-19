<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import type { TestimonialSendResponse } from '~/utils/admin/testimonials'

  // Resultado de crear o renovar. Si el correo salió, solo lo confirma; si no, muestra el enlace UNA vez
  // con "Copiar enlace" para enviarlo por otro canal. El enlace vive solo en esta vista: no se guarda.
  const props = defineProps<{ result: TestimonialSendResponse }>()

  const uid = useId()
  const field = ref<HTMLInputElement | null>(null)
  const copied = ref(false)
  const copyError = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  const copy = async () => {
    copyError.value = ''
    const link = props.result.link ?? ''
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Sin permiso de portapapeles: se deja el enlace seleccionado para copiarlo a mano.
      field.value?.focus()
      field.value?.select()
      copyError.value = 'No pude copiarlo solo: el enlace quedó seleccionado, cópialo con Ctrl+C.'
      return
    }
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 3000)
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="space-y-3">
    <AdminNotice v-if="result.mail === 'sent'" tone="success" :message="result.notice" />

    <template v-else>
      <p
        role="status"
        class="flex items-start gap-2 rounded-lg border border-brand-warning-border bg-brand-warning-bg px-3 py-2 text-sm font-medium text-brand-warning-text"
      >
        <Icon name="mdi:alert-outline" size="20" class="mt-0.5 shrink-0" aria-hidden="true" />
        <span class="leading-6">{{ result.notice }}</span>
      </p>
      <div v-if="result.link">
        <label :for="`${uid}-link`" class="mb-1 block text-sm font-medium text-brand-ink">
          Enlace único
        </label>
        <div class="flex flex-col gap-2 sm:flex-row">
          <input
            :id="`${uid}-link`"
            ref="field"
            type="text"
            readonly
            :value="result.link"
            class="min-h-11 w-full min-w-0 flex-1 rounded-lg border border-brand-border bg-brand-surface-soft px-3 text-sm text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            @focus="field?.select()"
          />
          <AdminButton variant="primary" @click="copy">
            <Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" size="20" aria-hidden="true" />
            {{ copied ? 'Enlace copiado' : 'Copiar enlace' }}
          </AdminButton>
        </div>
        <p class="mt-1 text-xs text-brand-muted">
          Este enlace solo se muestra ahora. Si lo pierdes, renueva la solicitud para generar otro.
        </p>
        <p v-if="copyError" role="alert" class="mt-1 text-xs font-medium text-brand-error-text">
          {{ copyError }}
        </p>
        <p role="status" class="sr-only">{{ copied ? 'Enlace copiado' : '' }}</p>
      </div>
    </template>
  </div>
</template>
