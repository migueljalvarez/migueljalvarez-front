<script lang="ts" setup>
  defineProps<{
    currentIndex: number
    visibleDots: number[]
  }>()
  const emit = defineEmits(['onclick'])
</script>
<template>
  <div>
    <button
      v-for="i in visibleDots"
      :key="i"
      class="w-3 h-3 mx-2 transition-all duration-200 rounded-full"
      :class="i === currentIndex ? 'bg-blue-500 scale-125 hover:scale-150' : 'bg-gray-300/60'"
      aria-label="Go to slide"
      @click="emit('onclick', i)"
    />
  </div>
</template>
<style></style>
