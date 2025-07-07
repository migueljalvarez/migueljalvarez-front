<script lang="ts" setup>
  import Title from '../atoms/Title/Title.vue'

  type SectionType = {
    id: string
    title: string
    background: string
  }
  const props = defineProps<SectionType>()
  const sectionClass = computed(() => ({
    'text-gray-800': props.background === 'bg-white'
  }))
</script>
<template>
  <section
    :id="id"
    :class="sectionClass"
    class="flex flex-col items-center justify-center w-full h-auto px-4 py-8 pt-20 text-lg font-bold text-gray-800 bg-white"
  >
    <Title :text="title" variant="h2" />
    <slot />
  </section>
</template>
<style></style>
