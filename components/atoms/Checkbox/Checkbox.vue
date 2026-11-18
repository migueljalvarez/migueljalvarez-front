<script lang="ts" setup>
  import type { CheckboxProps } from '../atom'

  defineProps<CheckboxProps>()

  const emit = defineEmits(['update:modelValue'])

  const onChange = (event: Event) => {
    emit('update:modelValue', (event.target as HTMLInputElement).checked)
  }
</script>

<template>
  <label
    :for="name"
    class="flex min-h-11 cursor-pointer items-start gap-3 py-1 text-xs leading-5 text-brand-text-subtle"
    :class="{ 'cursor-not-allowed opacity-60': disabled }"
  >
    <input
      :id="name"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      :required="required"
      :disabled="disabled"
      class="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-brand-border-strong accent-brand-blue transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white disabled:cursor-not-allowed"
      @change="onChange"
    />
    <span class="text-pretty">
      <slot />
    </span>
  </label>
</template>
