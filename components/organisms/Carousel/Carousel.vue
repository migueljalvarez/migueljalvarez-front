<script setup lang="ts">
  import { ref } from 'vue'
  import { DotNavigation, Title } from '~/components/atoms'
  import type { Testimonial } from '~/types/common'
  import type { CarouselProps } from '../organisms'

  const props = withDefaults(defineProps<CarouselProps>(), {
    currentIndex: 0,
    showArrow: true
  })
  defineSlots<{ card: { props: { item: Testimonial } } }>()
  const emit = defineEmits(['update:currentIndex'])
  const index = ref(props.currentIndex)

  watch(
    () => props.currentIndex,
    newVal => {
      index.value = newVal
    }
  )
  const transitionName = ref('slide-left')

  function next() {
    let newIndex = index.value < props.items.length - 1 ? index.value + 1 : 0
    transitionName.value = 'slide-left'
    index.value = newIndex
    emit('update:currentIndex', newIndex)
  }

  function prev() {
    let newIndex = index.value > 0 ? index.value - 1 : props.items.length - 1
    transitionName.value = 'slide-right'
    index.value = newIndex
    emit('update:currentIndex', newIndex)
  }
  const visibleDots = computed(() => {
    const total = props.items.length
    const current = props.currentIndex
    if (total <= 5) return Array.from({ length: total }, (_, i) => i)

    if (current <= 2) return [0, 1, 2, 3, 4]
    if (current >= total - 3) return [total - 5, total - 4, total - 3, total - 2, total - 1]
    return [current - 2, current - 1, current, current + 1, current + 2]
  })
  const touchStartX = ref(0)
  const touchEndX = ref(0)

  function handleTouchStart(e: TouchEvent) {
    touchStartX.value = e.changedTouches[0].clientX
  }

  function handleTouchEnd(e: TouchEvent) {
    touchEndX.value = e.changedTouches[0].clientX
    handleSwipe()
  }

  function handleSwipe() {
    const deltaX = touchEndX.value - touchStartX.value
    const threshold = 50 // mínimo para considerar swipe

    if (deltaX > threshold) {
      // Swipe hacia derecha
      prev()
    } else if (deltaX < -threshold) {
      // Swipe hacia izquierda
      next()
    }
  }
  function goToSlide(i: number) {
    if (i === index.value) return
    transitionName.value = i > index.value ? 'slide-left' : 'slide-right'
    index.value = i
    emit('update:currentIndex', i)
  }
</script>

<template>
  <section
    class="relative flex flex-col items-center justify-center w-full gap-2 px-2 mx-auto shadow-lg carousel-container max-w-8xl sm:px-6 bg-black/30 backdrop-blur-md"
  >
    <div>
      <button
        v-if="showArrow"
        aria-label="prev"
        class="absolute z-10 items-center justify-center hidden text-white -translate-y-1/2 rounded-full cursor-pointer md:flex left-2 md:left-4 lg:left-30 2xl:left-42 top-1/2 size-10 md:size-12 bg-white/20 backdrop-blur-md hover:bg-white/40"
        @click="prev"
      >
        <Icon name="mdi:chevron-left" size="24" />
      </button>
      <div
        class="relative flex flex-col items-center justify-center w-full gap-2 overflow-hidden h-fit"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <Title :text="title" variant="h2" class="pt-10 text-center md:py-18" />
        <Transition :name="transitionName" mode="out-in">
          <div :key="index" class="slide min-h-[500px]">
            <slot name="card" :item="items[index]" />
          </div>
        </Transition>
      </div>
      <button
        v-if="showArrow"
        aria-label="next"
        class="absolute z-10 items-center justify-center hidden text-white -translate-y-1/2 rounded-full cursor-pointer md:flex right-2 md:right-4 lg:right-30 2xl:right-42 top-1/2 size-10 md:size-12 bg-white/20 backdrop-blur-md hover:bg-white/40"
        @click="next"
      >
        <Icon name="mdi:chevron-right" size="24" />
      </button>
    </div>

    <div class="flex items-center justify-center gap-2 my-6">
      <DotNavigation :current-index="index" :visible-dots="visibleDots" @onclick="goToSlide" />
    </div>
  </section>
</template>

<style scoped>
  .carousel-container {
    position: relative;
    width: 100%;

    overflow: hidden;
  }

  .slide {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Animación hacia la izquierda */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition:
      transform 0.6s ease-in-out,
      opacity 0.6s ease-in-out;
    opacity: 1;
  }
  .slide-left-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  .slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  /* Animación hacia la derecha */
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition:
      transform 0.6s ease-in-out,
      opacity 0.6s ease-in-out;
    opacity: 1;
  }
  .slide-right-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }
  .slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
</style>
