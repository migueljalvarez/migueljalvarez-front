<script lang="ts" setup>
  import type { ButtonProps } from '../atom'

  const props = withDefaults(defineProps<ButtonProps>(), {
    size: 'sm',
    theme: 'primary',
    uppercase: false
  })
  const btnClass = computed(() => ({
    'flex-row-reverse': props.iconPosition !== 'left',
    uppercase: props.uppercase ? true : false,
    'py-2 px-4 text-xs': props.size === 'sm',
    'bg-blue-400 text-black hover:bg-blue-500': props.theme === 'primary',
    'bg-gray-200 text-black hover:bg-gray-400': props.theme === 'secondary',
    'bg-green-700 text-white hover:bg-green-800': props.theme === 'tertiary'
  }))
</script>
<template>
  <div>
    <button
      class="flex flex-row items-center justify-center w-full gap-2 font-bold rounded-md cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
      :class="btnClass"
      :disabled="disabled"
    >
      <Icon v-if="icon" :name="icon" :size="size === 'sm' ? 24 : 32" />
      <slot />
    </button>
  </div>
</template>

<style></style>
