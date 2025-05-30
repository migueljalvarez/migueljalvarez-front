<script lang="ts" setup>
  import { ref, computed } from 'vue'
  type Image = {
    src: string
    alt: string
  }
  const props = defineProps({
    items: { type: Array<Image>, required: true }
  })
  const duplicatedItems = computed(() => [...props.items, ...props.items])
  const isPaused = ref(false)
</script>

<template>
  <section class="flex items-center justify-center w-full py-4 overflow-hidden bg-gray-100 lg:p-4">
    <div class="relative w-full max-w-6xl overflow-hidden bg-gray-100 mx-s">
      <!-- Lado izquierdo difuminado -->
      <div
        class="absolute top-0 left-0 z-10 w-16 h-full pointer-events-none bg-gradient-to-r from-gray-100 to-transparent"
      />
      <!-- Lado derecho difuminado -->
      <div
        class="absolute top-0 right-0 z-10 w-16 h-full pointer-events-none bg-gradient-to-l from-gray-100 to-transparent"
      />
      <div
        class="flex items-center gap-6 sm:gap-10 md:gap-12 animate-marquee"
        :style="{ animationPlayState: isPaused ? 'paused' : 'running' }"
        @mouseenter="isPaused = true"
        @mouseleave="isPaused = false"
      >
        <template v-for="(item, index) in duplicatedItems" :key="index">
          <NuxtImg
            :src="item.src"
            :alt="item.alt"
            class="transition cursor-pointer size-10 sm:size-12 md:size-14 hover:scale-110"
            :title="item.alt"
            draggable="false"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  .animate-marquee {
    animation: marquee 20s linear infinite;
    min-width: max-content;
    will-change: transform;
  }
</style>
