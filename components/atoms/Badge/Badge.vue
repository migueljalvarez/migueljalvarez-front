<script lang="ts" setup>
  import type { BadgeProps } from '../atom'

  const props = withDefaults(defineProps<BadgeProps>(), {
    theme: 'info'
  })
  const bannerClass = computed(() => ({
    'bg-brand-surface-soft text-navy border border-brand-border shadow-[0_2px_6px_rgba(18,30,48,0.04)]':
      props.theme === 'info',
    'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-semibold shadow-[0_2px_6px_rgba(18,30,48,0.04)]':
      props.theme === 'brand',
    'bg-brand-success-bg text-brand-success-text border border-brand-success-border shadow-[0_2px_6px_rgba(18,30,48,0.04)]':
      props.theme === 'success',
    'bg-brand-warning-bg text-brand-warning-text border border-brand-warning-border shadow-[0_2px_6px_rgba(18,30,48,0.04)]':
      props.theme === 'warning',
    'bg-brand-danger-bg text-brand-danger-text border border-brand-danger-border shadow-[0_2px_6px_rgba(18,30,48,0.04)]':
      props.theme === 'danger'
  }))
</script>
<template>
  <div class="min-w-max">
    <p
      class="px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.02em]"
      :class="bannerClass"
    >
      {{ value }}
    </p>
  </div>
</template>

<style></style>
