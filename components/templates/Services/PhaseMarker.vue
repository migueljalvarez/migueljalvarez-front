<script setup lang="ts">
  withDefaults(
    defineProps<{
      phase: number
      active?: boolean
      compact?: boolean
    }>(),
    {
      active: true,
      compact: false
    }
  )
</script>

<template>
  <span
    class="phase-hexagon inline-flex shrink-0 items-center justify-center font-semibold"
    :class="[
      compact ? 'size-7 text-[10px]' : 'size-11 text-xs',
      active ? 'bg-brand-blue text-brand-white' : 'bg-brand-border text-brand-muted'
    ]"
    role="img"
    :aria-label="`Fase ${String(phase).padStart(2, '0')}${active ? ', incluida' : ', no incluida'}`"
  >
    {{ String(phase).padStart(2, '0') }}
  </span>
</template>

<style scoped>
  .phase-hexagon {
    clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%);
  }
</style>
