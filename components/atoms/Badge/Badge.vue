<script lang="ts" setup>
  import type { BadgeProps } from '../atom'

  const props = withDefaults(defineProps<BadgeProps>(), {
    theme: 'info'
  })
  const bannerClass = computed(() => ({
    'bg-slate-200/60 text-slate-900': props.theme === 'info',
    'bg-green-200/60 text-green-900': props.theme === 'success',
    'bg-yellow-200/60 text-yellow-900': props.theme === 'warning',
    'bg-red-200 text-red-500': props.theme === 'danger'
  }))
</script>
<template>
  <div class="min-w-max">
    <p class="px-3 py-0.5 rounded-full text-sm" :class="bannerClass">{{ value }}</p>
  </div>
</template>

<style></style>
