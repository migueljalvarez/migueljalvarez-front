<script lang="ts" setup>
  import type { TitleProps } from '../atom'

  const props = withDefaults(defineProps<TitleProps>(), {
    variant: 'h1'
  })
  const titleClass = computed(() => ({
    'text-5xl lg:text-6xl font-bold tracking-[-0.04em] text-brand-blue': props.variant === 'h1',
    'text-2xl lg:text-3xl font-medium tracking-[-0.03em] text-brand-blue': props.variant === 'h2',
    'text-2xl lg:text-3xl font-semibold tracking-[-0.03em] text-brand-blue': props.variant === 'h3',
    'text-lg lg:text-xl font-semibold tracking-[-0.02em] text-brand-blue': props.variant === 'h4',
    'text-xl lg:text-2xl font-normal tracking-[-0.02em] text-brand-navy': props.variant === 'h5',
    'text-base font-medium tracking-[0.02em] text-brand-muted uppercase': props.variant === 'h6'
  }))
</script>

<template>
  <div>
    <component :is="variant" :class="titleClass">
      {{ text }}
    </component>
  </div>
</template>

<style></style>
