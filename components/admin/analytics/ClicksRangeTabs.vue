<script setup lang="ts">
  import { CLICK_RANGES, CLICK_RANGE_LABEL, type ClickRange } from '~/utils/admin/analytics'

  // Selector de rango: radios nativos con el mismo `name` (flechas del teclado, un solo tab stop) con
  // aspecto de segmentos de al menos 44 px.
  defineProps<{ modelValue: ClickRange; name: string }>()
  const emit = defineEmits<{ 'update:modelValue': [value: ClickRange] }>()
</script>

<template>
  <fieldset class="min-w-0">
    <legend class="sr-only">Periodo</legend>
    <div class="inline-flex rounded-xl border border-brand-border bg-brand-surface-soft p-1">
      <label
        v-for="option in CLICK_RANGES"
        :key="option"
        class="flex min-h-11 min-w-20 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-medium transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-logo-blue motion-reduce:transition-none"
        :class="
          modelValue === option
            ? 'bg-brand-surface-card text-brand-ink shadow-card'
            : 'text-brand-muted hover:text-brand-ink'
        "
      >
        <input
          type="radio"
          :name="name"
          :value="option"
          :checked="modelValue === option"
          class="sr-only"
          @change="emit('update:modelValue', option)"
        />
        {{ CLICK_RANGE_LABEL[option] }}
      </label>
    </div>
  </fieldset>
</template>
