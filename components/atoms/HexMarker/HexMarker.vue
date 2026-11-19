<script lang="ts" setup>
  import type { HexMarkerProps } from '../atom'

  withDefaults(defineProps<HexMarkerProps>(), { active: true, compact: false, tone: 'light' })
</script>

<template>
  <span
    class="hex-marker inline-flex shrink-0 items-center justify-center text-xs font-semibold"
    :class="[
      compact ? 'size-8' : 'size-11',
      active
        ? tone === 'dark'
          ? 'bg-brand-warm text-brand-navy'
          : 'bg-brand-blue text-brand-white'
        : 'bg-brand-border text-brand-muted'
    ]"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel"
    :aria-hidden="ariaLabel ? undefined : 'true'"
  >
    {{ label }}
  </span>
</template>

<style scoped>
  .hex-marker {
    clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%);
  }
</style>
