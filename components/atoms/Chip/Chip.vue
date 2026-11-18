<script lang="ts" setup>
  import type { ChipProps } from '../atom'

  withDefaults(defineProps<ChipProps & { pill?: boolean; uppercase?: boolean }>(), {
    tone: 'neutral',
    size: 'md',
    pill: false,
    uppercase: false
  })

  const tones = {
    neutral: 'border-brand-border bg-brand-surface-soft text-brand-muted',
    brand: 'border-brand-blue bg-brand-blue text-brand-white',
    success: 'border-brand-whatsapp bg-brand-whatsapp text-brand-white',
    warning: 'border-brand-warning-border bg-brand-warning-bg text-brand-warning-text'
  }
</script>

<template>
  <span
    class="inline-flex items-center border text-xs font-medium"
    :class="[
      tones[tone],
      pill ? 'rounded-full' : 'rounded-md',
      size === 'md' ? 'px-2.5 py-1' : 'px-2 py-0.5',
      uppercase ? 'font-semibold uppercase tracking-wide' : ''
    ]"
  >
    <slot />
  </span>
</template>
