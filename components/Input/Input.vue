<script lang="ts" setup>
  import { defineProps, defineEmits, ref } from 'vue'

  const props = defineProps<{
    inputType?: string
    name?: string
    label?: string
    required?: boolean
    placeHolder?: string
    modelValue?: string
    disabled?: boolean
  }>()

  const emit = defineEmits(['update:modelValue'])
  const modelValue = ref(props.modelValue ?? '')
  const handleInput = (event: Event) => {
    modelValue.value = (event.target as HTMLInputElement).value

    emit('update:modelValue', modelValue.value)
  }
  const requiredClass = computed(() => ({
    'after:content-["*"] after:text-red-500 after:ml-1': props.required
  }))
  const inputClass = computed(() => ({
    'text-gray-700': !props.disabled,
    'text-gray-400': props.disabled
  }))
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
    <input
      :id="name"
      :type="inputType"
      :name="name"
      :class="inputClass"
      class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
      :placeholder="placeHolder"
      :required="required"
      :disabled="disabled"
      :value="modelValue"
      autocomplete="false"
      @input="handleInput"
    />
  </div>
</template>

<style></style>
