<script lang="ts" setup>
  import Title from '../atoms/Title/Title.vue'

  const props = defineProps<{
    title: string
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
  <section>
    <form @submit.prevent="emit('submit')">
      <div class="flex flex-col mb-4">
        <Title :text="title" variant="h3" class="mb-4 font-bold text-gray-800" />
        <legend class="mb-4">
          {{ description }}
        </legend>
      </div>

      <div :class="validationClass" class="items-center justify-center gap-2 p-4 mb-4 rounded-lg">
        <Icon :name="successful ? 'mdi:check-circle' : 'mdi:close-circle'" size="20" />
        <p>{{ validationMessage }}</p>
      </div>
      <div class="flex flex-col h-auto gap-4 py-4">
        <slot />
      </div>
    </form>
  </section>
</template>

<style></style>
