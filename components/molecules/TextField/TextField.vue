<script lang="ts" setup>
  type TextFieldProps = {
    id: string
    label: string
    modelValue: string
    /** `textarea` para textos largos (con contador si hay `maxlength`). */
    tag?: 'input' | 'textarea'
    required?: boolean
    error?: string
    hint?: string
    maxlength?: number
    rows?: number
    placeholder?: string
    autocomplete?: string
  }

  // Campo de formulario para superficies claras: etiqueta siempre visible, ayuda y error asociados al
  // control, alto táctil de 44 px y borde con contraste de componente (3:1). Con `maxlength` en un
  // textarea muestra el contador "actual/máximo".
  const props = withDefaults(defineProps<TextFieldProps>(), { tag: 'input', rows: 6 })
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

  const describedBy = computed(
    () =>
      [props.hint ? `${props.id}-hint` : '', props.error ? `${props.id}-error` : '']
        .filter(Boolean)
        .join(' ') || undefined
  )
  const onInput = (event: Event) =>
    emit('update:modelValue', (event.target as HTMLInputElement | HTMLTextAreaElement).value)
</script>

<template>
  <div>
    <div class="mb-1 flex items-end justify-between gap-3">
      <label :for="id" class="block text-sm font-medium text-brand-ink">
        {{ label }}
        <span v-if="required" class="text-brand-error-text" aria-hidden="true">*</span>
      </label>
      <span
        v-if="tag === 'textarea' && maxlength"
        class="text-xs tabular-nums text-brand-muted"
        aria-hidden="true"
      >
        {{ modelValue.length }}/{{ maxlength }}
      </span>
    </div>
    <component
      :is="tag"
      :id="id"
      :value="modelValue"
      :rows="tag === 'textarea' ? rows : undefined"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :aria-required="required || undefined"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      :type="tag === 'input' ? 'text' : undefined"
      class="min-h-11 w-full rounded-lg border bg-brand-surface-card px-3 py-2.5 text-base text-brand-ink transition placeholder:text-brand-helper focus:border-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue motion-reduce:transition-none"
      :class="[
        error ? 'border-brand-error-text' : 'border-brand-helper',
        { 'leading-7': tag === 'textarea' }
      ]"
      @input="onInput"
    />
    <p v-if="hint" :id="`${id}-hint`" class="mt-1 text-xs text-brand-muted">{{ hint }}</p>
    <p
      v-if="error"
      :id="`${id}-error`"
      role="alert"
      class="mt-1 text-xs font-medium text-brand-error-text"
    >
      {{ error }}
    </p>
  </div>
</template>
