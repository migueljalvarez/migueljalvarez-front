<script lang="ts" setup>
  import type { InputProps } from '../atom'

  const props = withDefaults(defineProps<InputProps>(), {
    type: 'text',
    tag: 'input'
  })

  const emit = defineEmits(['update:modelValue'])
  const error = ref(false)
  const modelValue = ref(props.modelValue ?? '')
  watch(
    () => props.modelValue,
    value => {
      modelValue.value = value ?? ''
    }
  )
  const handleInput = (event: Event) => {
    modelValue.value = (event.target as HTMLInputElement).value
    validate(modelValue.value)
    emit('update:modelValue', modelValue.value)
  }
  const requiredClass = computed(() => ({
    'after:content-["*"] after:text-brand-error-border after:ml-1': props.required
  }))
  const inputClass = computed(() => ({
    'text-brand-ink': !props.disabled,
    'text-brand-helper': props.disabled,
    'resize-none': props.tag === 'textarea',
    'border-brand-error-border bg-brand-error-bg text-brand-error-text placeholder:text-brand-error-border focus:border-brand-error-border focus:ring-2 focus:ring-brand-error-border focus:outline-none':
      error.value,
    'border-brand-border bg-brand-surface-card text-brand-ink placeholder:text-brand-muted focus:border-brand-white focus:ring-2 focus:ring-brand-text-soft focus:outline-none':
      !error.value
  }))
  const autocompleteValue = computed(() =>
    props.name === 'name' || props.name === 'email' ? props.name : 'off'
  )
  const rows = computed(() => {
    if (props.tag === 'textarea') {
      return 4
    }
    return undefined
  })
  function validate(value: string) {
    error.value = !props.pattern.test(value)
  }
  function handlePaste(e: ClipboardEvent) {
    const clipboard = e.clipboardData
    if (clipboard) {
      const pasted = clipboard.getData('text')
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      const newValue = target.value + pasted

      validate(newValue)
      emit('update:modelValue', newValue)
    }
  }
</script>
<template>
  <div>
    <label
      v-if="name"
      :for="name"
      :class="requiredClass"
      class="block mb-1 text-sm font-medium text-brand-label tracking-[0.01em]"
    >
      {{ label }}
    </label>
    <component
      :is="tag"
      :id="name"
      :type="type"
      :name="name"
      :class="inputClass"
      class="w-full min-h-11 px-3 py-2 text-base font-normal rounded-lg border transition-colors duration-200 motion-reduce:transition-none"
      :placeholder="placeHolder"
      :required="required"
      :disabled="disabled"
      :value="modelValue"
      :autocomplete="autocompleteValue"
      :aria-invalid="error || undefined"
      :aria-describedby="error ? `${name}-error` : undefined"
      :rows="tag === 'textarea' ? rows : 4"
      @input="handleInput"
      @paste="handlePaste"
    />
    <p v-if="error" :id="`${name}-error`" role="alert" class="mt-1 text-xs text-brand-error-border">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style></style>
