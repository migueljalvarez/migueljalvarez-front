<script lang="ts" setup>
  import type { CheckboxProps } from '../atom'

  withDefaults(defineProps<CheckboxProps>(), { tone: 'dark' })

  const emit = defineEmits(['update:modelValue'])

  const onChange = (event: Event) => {
    emit('update:modelValue', (event.target as HTMLInputElement).checked)
  }
</script>

<template>
  <label
    :for="name"
    class="flex min-h-11 cursor-pointer items-start gap-3 py-1"
    :class="[
      tone === 'light'
        ? 'text-sm leading-6 text-brand-ink'
        : 'text-xs leading-5 text-brand-text-subtle',
      { 'cursor-not-allowed opacity-60': disabled }
    ]"
  >
    <input
      :id="name"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      :required="required"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedby"
      class="size-5 shrink-0 cursor-pointer rounded transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
      :class="
        tone === 'light'
          ? [
              'mt-0.5 accent-brand-accent focus-visible:outline-brand-blue',
              invalid ? 'border-brand-error-text' : 'border-brand-helper'
            ]
          : 'mt-0.5 border-brand-border-strong accent-brand-blue focus-visible:outline-brand-white'
      "
      @change="onChange"
    />
    <span class="text-pretty">
      <slot />
    </span>
  </label>
</template>
