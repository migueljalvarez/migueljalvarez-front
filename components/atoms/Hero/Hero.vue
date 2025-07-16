<script lang="ts" setup>
  const props = defineProps({
    value: { type: String, required: true },
    color: { type: String, required: true }
  })
  const heroClass = computed(() => ({
    'bg-gray-200': props.color === 'gray' ? true : false,
    'bg-blue-400 text-slate-900': props.color === 'blue' ? true : false
  }))
</script>
<template>
  <section class="flex flex-wrap justify-center p-2" :class="heroClass">
    <p class="p-2 italic text-center sm:w-auto xsm:text-2xl md:text-3xl lg:text-4xl lg:p-10">
      {{ value }}
    </p>
  </section>
</template>

<style></style>
