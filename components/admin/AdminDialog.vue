<script setup lang="ts">
  // Diálogo modal con el elemento nativo <dialog>: foco atrapado, Esc para cerrar y lector de pantalla.
  const props = defineProps<{ open: boolean; title: string; description?: string }>()
  const emit = defineEmits<{ close: [] }>()

  const dialog = ref<HTMLDialogElement | null>(null)
  const uid = useId()

  watch(
    () => props.open,
    value => {
      const element = dialog.value
      if (!element) return
      if (value && !element.open) element.showModal()
      if (!value && element.open) element.close()
    },
    { flush: 'post' }
  )

  onMounted(() => {
    if (props.open) dialog.value?.showModal()
  })
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-brand-border bg-brand-surface-card p-0 text-brand-ink shadow-[0_24px_60px_var(--color-brand-shadow-card)] backdrop:bg-brand-navy/60"
    :aria-labelledby="`${uid}-title`"
    @close="emit('close')"
    @cancel.prevent="emit('close')"
  >
    <div class="p-5 md:p-6">
      <div class="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 :id="`${uid}-title`" class="text-xl font-semibold text-brand-ink">{{ title }}</h2>
          <p v-if="description" class="mt-1 text-sm text-brand-muted">{{ description }}</p>
        </div>
        <button
          type="button"
          class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-brand-muted hover:bg-brand-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          aria-label="Cerrar"
          @click="emit('close')"
        >
          <Icon name="mdi:close" size="22" aria-hidden="true" />
        </button>
      </div>
      <slot />
    </div>
  </dialog>
</template>
