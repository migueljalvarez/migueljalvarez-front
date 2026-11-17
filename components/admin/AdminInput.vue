<script setup lang="ts">
  import AdminField from '~/components/admin/AdminField.vue'

  // Control de texto, número, fecha, correo, área de texto o lista desplegable con su campo.
  const props = withDefaults(
    defineProps<{
      id: string
      label: string
      modelValue: string | number | boolean
      type?: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox'
      options?: { value: string; label: string }[]
      placeholder?: string
      error?: string
      hint?: string
      required?: boolean
      rows?: number
      step?: string
    }>(),
    { type: 'text', rows: 3 }
  )
  const emit = defineEmits<{ 'update:modelValue': [value: string | number | boolean] }>()

  const base =
    'w-full rounded-xl border bg-brand-surface px-3 py-2.5 text-sm text-brand-ink outline-none transition placeholder:text-brand-helper focus:border-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue'
  const stateClass = computed(() =>
    props.error ? 'border-brand-error-border' : 'border-brand-border'
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
      class="mt-1 size-5 rounded border-brand-border accent-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      :aria-describedby="hint ? `${id}-hint` : undefined"
      @change="onInput"
    />
    <div>
      <label :for="id" class="text-sm font-medium text-brand-ink">{{ label }}</label>
      <p v-if="hint" :id="`${id}-hint`" class="text-xs text-brand-helper">{{ hint }}</p>
    </div>
  </div>

  <AdminField v-else :id="id" :label="label" :error="error" :hint="hint" :required="required">
    <template #default="{ describedBy, invalid }">
      <textarea
        v-if="type === 'textarea'"
        :id="id"
        :value="String(modelValue)"
        :rows="rows"
        :placeholder="placeholder"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
        :class="[base, stateClass]"
        @input="onInput"
      />
      <select
        v-else-if="type === 'select'"
        :id="id"
        :value="String(modelValue)"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
        :class="[base, stateClass]"
        @change="onInput"
      >
        <option value="" disabled>{{ placeholder ?? 'Selecciona…' }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <input
        v-else
        :id="id"
        :type="type"
        :value="String(modelValue)"
        :placeholder="placeholder"
        :step="step"
        :inputmode="type === 'number' ? 'decimal' : undefined"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
        :class="[base, stateClass]"
        @input="onInput"
      />
    </template>
  </AdminField>
</template>
