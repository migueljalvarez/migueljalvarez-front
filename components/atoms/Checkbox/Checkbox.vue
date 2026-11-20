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
      class="app-checkbox mt-0.5 size-5 shrink-0 cursor-pointer rounded-md border-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed motion-reduce:transition-none"
      :class="
        tone === 'light'
          ? [
              'is-light focus-visible:outline-brand-blue',
              invalid ? 'border-brand-error-text' : 'border-brand-helper'
            ]
          : 'border-brand-text-subtle focus-visible:outline-brand-white'
      "
      @change="onChange"
    />
    <span class="text-pretty">
      <slot />
    </span>
  </label>
</template>

<style scoped>
  /* Casilla propia (la nativa se ve como un cuadro blanco sobre fondo oscuro). Marcada: ámbar sobre oscuro
     y navy sobre claro, con la marca en el color de texto del botón correspondiente. */
  .app-checkbox {
    appearance: none;
    position: relative;
    background: transparent;
  }

  .app-checkbox:hover:not(:disabled):not(:checked) {
    background: color-mix(in srgb, var(--color-brand-text-soft) 12%, transparent);
  }

  .app-checkbox:checked {
    border-color: var(--color-brand-warm);
    background: var(--color-brand-warm);
  }

  .app-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid var(--color-brand-navy);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .app-checkbox.is-light:hover:not(:disabled):not(:checked) {
    background: var(--color-brand-surface-soft);
  }

  .app-checkbox.is-light:checked {
    border-color: var(--color-brand-accent);
    background: var(--color-brand-accent);
  }

  .app-checkbox.is-light:checked::after {
    border-color: var(--color-brand-white);
  }
</style>
