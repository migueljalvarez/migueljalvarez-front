<script lang="ts" setup>
  import type { EyebrowProps } from '../atom'

  withDefaults(defineProps<EyebrowProps>(), { tone: 'light', as: 'p' })
</script>

<template>
  <component
    :is="as"
    class="text-xs font-semibold uppercase tracking-[0.14em]"
    :class="tone === 'dark' ? 'text-brand-text-soft' : 'text-brand-accent-text'"
  >
    <slot />
  </component>
</template>
