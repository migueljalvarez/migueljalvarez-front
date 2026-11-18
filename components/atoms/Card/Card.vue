<script lang="ts" setup>
  import type { CardProps } from '../atom'

  withDefaults(defineProps<CardProps>(), { tone: 'light', as: 'div', elevated: false })
</script>

<template>
  <component
    :is="as"
    class="border"
    :class="[
      tone === 'light' && 'rounded-2xl border-brand-border bg-brand-surface-card text-brand-ink',
      tone === 'soft' && 'rounded-xl border-brand-border bg-brand-surface-soft text-brand-ink',
      tone === 'dark' &&
        'rounded-2xl border-brand-border-strong/70 bg-brand-surface-panel text-brand-text-strong',
      elevated && 'shadow-card'
    ]"
  >
    <slot />
  </component>
</template>
