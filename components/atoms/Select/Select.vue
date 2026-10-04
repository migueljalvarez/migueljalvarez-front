<script lang="ts" setup>
  import type { SelectProps } from '../atom'

  const props = defineProps<SelectProps>()

  const emit = defineEmits(['update:modelValue'])

  function onChange(event: Event) {
    emit('update:modelValue', (event.target as HTMLSelectElement).value)
  }
  const requiredClass = computed(() => ({
    'after:content-["*"] after:text-red-500 after:ml-1': props.required
  }))
</script>

<template>
  <div class="relative flex flex-col gap-1">
    <label
      v-if="label"
      :for="name"
      :class="requiredClass"
      class="block mb-2 text-sm font-medium text-[#EAF1FF] tracking-[0.01em]"
    >
      {{ label }}
    </label>
    <select
      :id="name"
      :name="name"
      class="w-full h-10 p-2 pr-10 text-sm font-normal text-[#030507] bg-white border border-[#E9EEF5] rounded-lg appearance-none shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D9E2F2] focus:border-[#243B62]"
      :required="required"
      :value="modelValue"
      @change="onChange"
    >
      <option class="text-[#7E8897]" value="" disabled selected hidden>
        {{ placeholder || 'Selecciona una opción' }}
      </option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span class="absolute pointer-events-none right-3 top-11">
      <svg class="w-4 h-4" fill="none" stroke="#4D5868" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </div>
</template>
