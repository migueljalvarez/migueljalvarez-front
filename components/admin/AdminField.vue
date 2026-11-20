<script setup lang="ts">
  // Campo de formulario accesible: etiqueta, ayuda y error asociados al control por id.
  const props = defineProps<{
    id: string
    label: string
    error?: string
    hint?: string
    required?: boolean
    /** Oculta la etiqueta a la vista (sigue leyéndola el lector de pantalla): filas compactas con encabezado propio. */
    labelHidden?: boolean | 'desktop'
    /** Contador "actual/máximo" junto a la etiqueta (p. ej. textos con límite). */
    count?: { current: number; max: number }
  }>()

  const describedBy = computed(() =>
    [props.hint ? `${props.id}-hint` : '', props.error ? `${props.id}-error` : '']
      .filter(Boolean)
      .join(' ')
  )
</script>

<template>
  <div>
    <div class="mb-1 flex items-end justify-between gap-3">
      <label
        :for="id"
        class="text-sm font-medium text-brand-ink"
        :class="
          labelHidden === true
            ? 'sr-only'
            : labelHidden === 'desktop'
              ? 'block md:sr-only'
              : 'block'
        "
      >
        {{ label }}
        <span v-if="required" class="text-brand-error-text" aria-hidden="true">*</span>
      </label>
      <span v-if="count" class="text-xs tabular-nums text-brand-muted" aria-hidden="true">
        {{ count.current }}/{{ count.max }}
      </span>
    </div>
    <slot :described-by="describedBy || undefined" :invalid="!!error" />
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
