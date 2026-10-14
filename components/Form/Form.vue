<script lang="ts" setup>
  const props = defineProps<{
    title?: string
    description?: string
    successful?: boolean
    validationMessage?: string
  }>()
  const emit = defineEmits(['submit'])
  const validationClass = computed(() => ({
    hidden: !props.successful && !props.validationMessage,
    'flex text-brand-success-text bg-brand-success-bg border border-brand-success-border':
      props.successful,
    'flex text-brand-error-text bg-brand-error-bg border border-brand-error-border':
      !props.successful && !!props.validationMessage
  }))
</script>
<template>
  <section>
    <form @submit.prevent="emit('submit')">
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
