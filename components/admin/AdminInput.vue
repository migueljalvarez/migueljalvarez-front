<script setup lang="ts">
  import AdminField from '~/components/admin/AdminField.vue'
  import { ADMIN_CONTROL_BASE, adminControlState } from '~/utils/admin/controlClass'
  import { cn } from '~/utils/cn'

  // Control de texto, número, fecha, correo, contraseña, área de texto o lista desplegable con su campo.
  const props = withDefaults(
    defineProps<{
      id: string
      label: string
      modelValue: string | number | boolean
      type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox'
      options?: { value: string; label: string }[]
      placeholder?: string
      error?: string
      hint?: string
      required?: boolean
      /** Solo en casillas: la explicación de por qué no se puede marcar va en `hint`. */
      disabled?: boolean
      rows?: number
      step?: string
      maxlength?: number
      /** Muestra "actual/máximo" junto a la etiqueta (requiere `maxlength`). */
      counter?: boolean
      inputmode?: 'text' | 'numeric' | 'decimal' | 'email' | 'url'
      autocomplete?: string
      /** Id de un `<datalist>` con sugerencias. */
      list?: string
      /** Clases extra del control (p. ej. el campo grande del código de verificación). */
      inputClass?: string
    }>(),
    { type: 'text', rows: 3 }
  )
  const emit = defineEmits<{ 'update:modelValue': [value: string | number | boolean] }>()

  const stateClass = computed(() => adminControlState(!!props.error))
  // `cn` resuelve conflictos: `inputClass` (p. ej. `text-2xl`) gana sobre `text-sm` de la base.
  const controlClass = computed(() => cn(ADMIN_CONTROL_BASE, stateClass.value, props.inputClass))

  const count = computed(() =>
    props.counter && props.maxlength
      ? { current: String(props.modelValue).length, max: props.maxlength }
      : undefined
  )
  const inputmodeAttr = computed(
    () => props.inputmode ?? (props.type === 'number' ? 'decimal' : undefined)
  )

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', props.type === 'checkbox' ? target.checked : target.value)
  }
</script>

<template>
  <div v-if="type === 'checkbox'" class="flex items-start gap-3">
    <input
      :id="id"
      type="checkbox"
      :checked="Boolean(modelValue)"
      :disabled="disabled"
      class="mt-3 size-5 shrink-0 rounded border-brand-helper accent-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-60"
      :aria-describedby="hint ? `${id}-hint` : undefined"
      @change="onInput"
    />
    <div>
      <label
        :for="id"
        class="flex min-h-11 items-center text-sm font-medium text-brand-ink"
        :class="{ 'opacity-60': disabled }"
      >
        {{ label }}
      </label>
      <p v-if="hint" :id="`${id}-hint`" class="-mt-2 pb-2 text-xs text-brand-muted">{{ hint }}</p>
    </div>
  </div>

  <AdminField
    v-else
    :id="id"
    :label="label"
    :error="error"
    :hint="hint"
    :required="required"
    :count="count"
  >
    <template #default="{ describedBy, invalid }">
      <textarea
        v-if="type === 'textarea'"
        :id="id"
        :value="String(modelValue)"
        :rows="rows"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :required="required"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
        :class="controlClass"
        @input="onInput"
      />
      <select
        v-else-if="type === 'select'"
        :id="id"
        :value="String(modelValue)"
        :required="required"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
        :class="controlClass"
        @change="onInput"
      >
        <option value="" disabled>{{ placeholder ?? 'Selecciona…' }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div v-else class="flex items-start gap-3">
        <slot name="prefix" />
        <input
          :id="id"
          :type="type"
          :value="String(modelValue)"
          :placeholder="placeholder"
          :step="step"
          :maxlength="maxlength"
          :inputmode="inputmodeAttr"
          :autocomplete="autocomplete"
          :list="list"
          :required="required"
          :aria-describedby="describedBy"
          :aria-invalid="invalid"
          :class="cn(controlClass, 'min-w-0 flex-1')"
          @input="onInput"
        />
      </div>
    </template>
  </AdminField>
</template>
