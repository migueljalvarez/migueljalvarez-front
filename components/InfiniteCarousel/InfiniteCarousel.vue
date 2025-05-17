<script lang="ts" setup>
import { ref } from 'vue';
type Image = {
  src: string;
  alt: string;
};
defineProps({
  items: { type: Array<Image>, required: true },
});


const isPaused = ref(false);
</script>
<template>
     <section class="flex items-center justify-center w-full p-4 overflow-hidden bg-gray-100 lg:8xl ">
      <div class="relative w-5/6 overflow-hidden bg-gray-100">
        <!-- Lado izquierdo difuminado -->
        <div
          class="absolute top-0 left-0 z-10 w-1/6 h-full pointer-events-none bg-gradient-to-r from-gray-100 to-transparent"
        />

        <!-- Lado derecho difuminado -->
        <div
          class="absolute top-0 right-0 z-10 w-1/6 h-full pointer-events-none bg-gradient-to-l from-gray-100 to-transparent"
        />

        <div
          class="flex items-center gap-12 animate-marquee"
          :style="{ animationPlayState: isPaused ? 'paused' : 'running' }"
          @mouseenter="isPaused = true"
          @mouseleave="isPaused = false"
        >
          <template v-for="(item, index) in items" :key="index">
            <img 
              :src="item.src"
              :alt="item.alt"
              class="transition size-10 hover:cursor-pointer"
              :title="item.alt"
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
}
</style>