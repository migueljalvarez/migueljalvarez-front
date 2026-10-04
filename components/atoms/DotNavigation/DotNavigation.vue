<script lang="ts" setup>
  defineProps<{
    currentIndex: number
    visibleDots: number[]
  }>()
  const emit = defineEmits(['onclick'])
</script>
<template>
  <div>
    <Button
      v-for="i in visibleDots"
      :key="i"
      type="button"
      theme="secondary"
      class="mx-2 h-3 w-3 rounded-full border-0 bg-transparent p-0 shadow-none hover:bg-transparent"
      :class="
        i === currentIndex
          ? 'scale-125 bg-brand-accent hover:scale-150'
          : 'bg-[#D5DCE6] hover:scale-150'
      "
      aria-label="Go to slide"
      @click="emit('onclick', i)"
    />
  </div>
</template>
<style></style>
