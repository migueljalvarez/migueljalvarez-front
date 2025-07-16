<script lang="ts" setup>
  import type { TitleProps } from '../atom'

  const props = withDefaults(defineProps<TitleProps>(), {
    variant: 'h1'
  })
  const titleClass = computed(() => ({
    'text-6xl lg:text-6xl font-bold': props.variant === 'h1',
    'text-5xl lg:text-5xl font-bold italic': props.variant === 'h2',
    'text-3xl lg:text-4xl font-medium italic': props.variant === 'h3',
    'text-lg lg:text-xl font-black': props.variant === 'h4',
    'text-xl lg:text-2xl font-normal': props.variant === 'h5',
    'text-base font-thin': props.variant === 'h6'
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
