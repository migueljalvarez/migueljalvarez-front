<script lang="ts" setup>
  const props = defineProps<{
    name: string
    label: string
    required?: boolean
    placeHolder: string
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
</script>

<template>
  <div class="relative flex flex-col gap-1">
    <label :for="name" :class="['block mb-2 text-sm font-medium text-black', requiredClass]">
      {{ label }}
    </label>
    <textarea
      :id="name"
      v-model="modelValue"
      :name="name"
      :placeholder="placeHolder"
      class="w-full p-2 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
      rows="8"
      :required="required"
      @input="handleInput"
    />
  </div>
</template>

<style></style>
