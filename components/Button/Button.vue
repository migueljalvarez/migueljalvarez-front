<script lang="ts" setup>
  const props = defineProps({
    size: { type: String, default: 'sm' },
    theme: { type: String, default: 'primary' },
    variant: { type: String, default: 'lowercase' },
    icon: { type: String, default: 'lowercase' },
    iconPosition: { type: String, default: 'left' }
  })
  const btnClass = computed(() => ({
    'flex-row-reverse': props.iconPosition !== 'left',
    uppercase: props.variant === 'uppercase' ? true : false,
    ' py-2 px-4 text-sm': props.size === 'sm',
    'bg-blue-400 text-black hover:bg-blue-500': props.theme === 'primary',
    'bg-gray-200 text-black hover:bg-gray-400': props.theme === 'secondary',
    'bg-green-600 text-white hover:bg-green-800': props.theme === 'tertiary'
  }))
</script>
<template>
  <div>
    <button
      class="flex flex-row items-center w-auto gap-2 font-bold rounded-md cursor-pointer"
      :class="btnClass"
    >
      <Icon v-if="icon" :name="icon" :size="size === 'sm' ? 24 : 32" />
      <slot />
    </button>
  </div>
</template>

<style></style>
