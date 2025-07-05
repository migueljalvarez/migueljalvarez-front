<script lang="ts" setup>
  const props = defineProps<{
    text: string
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }>()
  const titleClass = computed(() => ({
    'text-7xl font-bold': props.variant === 'h1',
    'text-6xl font-bold italic': props.variant === 'h2',
    'text-3xl font-medium italic': props.variant === 'h3',
    'text-2xl font-normal': props.variant === 'h4',
    'text-lg font-light': props.variant === 'h5',
    'text-base font-thin': props.variant === 'h6'
  }))
</script>

<template>
  <div>
    <h1 :class="titleClass">{{ text }}</h1>
  </div>
</template>

<style></style>
