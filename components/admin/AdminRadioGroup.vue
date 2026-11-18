<script setup lang="ts">
  // Elección única entre pocas opciones, cada una con su explicación. Cada opción es un bloque de al
  // menos 44 px; las flechas del teclado cambian la selección (radios nativos con el mismo `name`).
  defineProps<{
    legend: string
    name: string
    modelValue: string
    options: { value: string; label: string; description: string }[]
  }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <fieldset>
    <legend class="mb-1 text-sm font-medium text-brand-ink">{{ legend }}</legend>
    <div class="space-y-2">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border p-3 transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-blue"
        :class="
          modelValue === option.value
            ? 'border-brand-accent bg-brand-surface-soft'
            : 'border-brand-border hover:bg-brand-surface-soft'
        "
      >
        <input
          type="radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          class="mt-0.5 size-5 shrink-0 accent-brand-accent"
          @change="emit('update:modelValue', option.value)"
        />
        <span>
          <span class="block text-sm font-medium text-brand-ink">{{ option.label }}</span>
          <span class="mt-1 block text-xs text-brand-muted">{{ option.description }}</span>
        </span>
      </label>
    </div>
  </fieldset>
</template>
