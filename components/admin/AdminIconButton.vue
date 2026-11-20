<script setup lang="ts">
  // Botón de solo icono de 44 × 44 px. `label` es obligatorio: es su nombre accesible y su tooltip.
  withDefaults(
    defineProps<{
      label: string
      icon: string
      tone?: 'default' | 'danger'
      /** `sm` (36 px) para filas compactas; `md` (44 px) por defecto. */
      size?: 'md' | 'sm'
      disabled?: boolean
    }>(),
    { tone: 'default', size: 'md' }
  )
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :aria-label="label"
    :title="label"
    class="inline-flex items-center justify-center rounded-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
    :class="[
      size === 'sm' ? 'min-h-9 min-w-9' : 'min-h-11 min-w-11',
      tone === 'danger'
        ? 'text-brand-error-text hover:bg-brand-error-bg'
        : 'text-brand-muted hover:bg-brand-surface-soft'
    ]"
  >
    <Icon :name="icon" :size="size === 'sm' ? 18 : 22" aria-hidden="true" />
  </button>
</template>
