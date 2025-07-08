<script lang="ts" setup>
  import { defineProps, defineEmits, ref } from 'vue'
  import type { InputProps } from '../atom'

  const props = withDefaults(defineProps<InputProps>(), {
    type: 'text',
    tag: 'input'
  })

  const emit = defineEmits(['update:modelValue'])
  const error = ref(false)
  const modelValue = ref(props.modelValue ?? '')
  const handleInput = (event: Event) => {
    modelValue.value = (event.target as HTMLInputElement).value
    validate(modelValue.value)
    emit('update:modelValue', modelValue.value)
  }
  const requiredClass = computed(() => ({
    'after:content-["*"] after:text-red-500 after:ml-1': props.required
  }))
  const inputClass = computed(() => ({
    'text-gray-700': !props.disabled,
    'text-gray-400': props.disabled,
    'resize-none': props.tag === 'textarea',
    'border-red-500 focus:ring-0 focus:ring-red-500 focus:outline-none': error.value,
    'focus:ring-0 focus:ring-blue-500 border-gray-300 focus:outline-1 outline-blue-400':
      !error.value
  }))
  const rows = computed(() => {
    if (props.tag === 'textarea') {
      return 4
    }
    return undefined
  })
  function validate(value: string) {
    console.log(value)
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
      class="block mb-2 text-sm font-medium text-black"
    >
      {{ label }}
    </label>
    <component
      :is="tag"
      :id="name"
      :type="type"
      :name="name"
      :class="inputClass"
      class="w-full p-2 rounded-lg border-1 placeholder:text-gray-400"
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
