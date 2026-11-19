<script lang="ts" setup>
  import type { SelectProps } from '../atom'

  const props = defineProps<SelectProps>()

  const emit = defineEmits(['update:modelValue'])

  function onChange(event: Event) {
    emit('update:modelValue', (event.target as HTMLSelectElement).value)
  }
  const requiredClass = computed(() => ({
    'after:content-["*"] after:text-brand-error-border after:ml-1': props.required
  }))
</script>

<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      :for="name"
      :class="requiredClass"
      class="block mb-1 text-sm font-medium text-brand-label tracking-[0.01em]"
    >
      {{ label }}
    </label>
    <div class="relative">
      <select
        :id="name"
        :name="name"
        class="w-full min-h-11 px-3 py-2 pr-10 text-base font-normal text-brand-ink bg-brand-surface-card border border-brand-border rounded-lg appearance-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-text-soft focus:border-brand-white motion-reduce:transition-none"
        :required="required"
        :value="modelValue"
        @change="onChange"
      >
        <option class="text-brand-muted" value="" disabled selected hidden>
          {{ placeholder || 'Selecciona una opción' }}
        </option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <span
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-ink"
        aria-hidden="true"
      >
        <svg
          class="size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          focusable="false"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  </div>
</template>
