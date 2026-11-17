<script setup lang="ts">
  // Campo de formulario accesible: etiqueta, ayuda y error asociados al control por id.
  const props = defineProps<{
    id: string
    label: string
    error?: string
    hint?: string
    required?: boolean
  }>()

  const describedBy = computed(() =>
    [props.hint ? `${props.id}-hint` : '', props.error ? `${props.id}-error` : '']
      .filter(Boolean)
      .join(' ')
  )
</script>

<template>
  <div>
    <label :for="id" class="mb-1 block text-sm font-medium text-brand-ink">
      {{ label }}
      <span v-if="required" class="text-brand-error-text" aria-hidden="true">*</span>
    </label>
    <slot :described-by="describedBy || undefined" :invalid="!!error" />
    <p v-if="hint" :id="`${id}-hint`" class="mt-1 text-xs text-brand-helper">{{ hint }}</p>
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
