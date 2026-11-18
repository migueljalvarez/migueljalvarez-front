<script setup lang="ts">
  // Etiqueta de estado: el significado va en el texto (y en el icono), nunca solo en el color.
  withDefaults(
    defineProps<{
      tone?: 'success' | 'neutral' | 'warning' | 'info'
      icon?: string
    }>(),
    { tone: 'neutral' }
  )

  const tones = {
    success: 'border-brand-success-border bg-brand-success-bg text-brand-success-text',
    neutral: 'border-brand-border bg-brand-surface-soft text-brand-muted',
    warning: 'border-brand-warning-border bg-brand-warning-bg text-brand-warning-text',
    info: 'border-brand-blue/40 bg-brand-blue/10 text-brand-accent-text'
  }
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
    :class="tones[tone]"
  >
    <Icon v-if="icon" :name="icon" size="14" aria-hidden="true" />
    <slot />
  </span>
</template>
