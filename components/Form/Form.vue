<script lang="ts" setup>
  const props = defineProps<{
    title?: string
    description?: string
    successful?: boolean
    validationMessage?: string
  }>()
  const emit = defineEmits(['submit'])
  const validationClass = computed(() => ({
    hidden: !props.successful,
    'flex text-green-900 bg-green-200 ': props.successful
  }))
</script>
<template>
  <div>
    <form class="flex flex-col gap-4" @submit.prevent="emit('submit')">
      <h2 class="mb-4 text-2xl font-bold">{{ title }}</h2>
      <legend class="mb-4">
        {{ description }}
      </legend>
      <div :class="validationClass" class="items-center justify-center gap-2 p-4 mb-4 rounded-lg">
        <Icon :name="successful ? 'mdi:check-circle' : 'mdi:close-circle'" size="20" />
        <p>{{ validationMessage }}</p>
      </div>
      <slot />
    </form>
  </div>
</template>

<style></style>
