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
    'after:content-["*"] after:text-red-500 after:ml-1': props.required
  }))
  const inputClass = computed(() => ({
    'text-brand-ink': !props.disabled,
    'text-brand-helper': props.disabled,
    'resize-none': props.tag === 'textarea',
    'border-red-400 bg-brand-error-bg text-brand-error-text placeholder:text-brand-error-border focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none':
      error.value,
    'border-brand-border bg-brand-surface-card text-brand-ink placeholder:text-brand-muted focus:border-brand-accent focus:ring-2 focus:ring-brand-blue/20 focus:outline-none':
      !error.value
  }))
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
      class="block mb-2 text-sm font-medium text-[#EAF1FF] tracking-[0.01em]"
    >
      {{ label }}
    </label>
    <component
      :is="tag"
      :id="name"
      :type="type"
      :name="name"
      :class="inputClass"
      class="w-full p-2 text-sm font-normal rounded-lg border shadow-sm transition-colors duration-200"
      :placeholder="placeHolder"
      :required="required"
      :disabled="disabled"
      :value="modelValue"
      autocomplete="false"
      :rows="tag === 'textarea' ? rows : 4"
      @input="handleInput"
      @paste="handlePaste"
    />
    <p v-if="error" class="py-1 text-xs text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<style></style>
