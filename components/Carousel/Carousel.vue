<script lang="ts" setup>
  import { computed, onMounted, onBeforeUnmount } from 'vue'

  // Emits for v-model support
  const emit = defineEmits(['update:currentIndex', 'update:portafolioCurrentIndex'])

  // Props definition
  const props = defineProps({
    title: { type: String, default: '' },
    items: { type: Array, required: true },
    currentIndex: { type: Number, default: 0 },
    portafolioCurrentIndex: { type: Number, default: 0 },
    background: { type: String, default: '' },
    backgroundColor: { type: String, default: '' },
    showArrow: { type: Boolean, default: true }
  })

  // Navigation handlers
  const prevSlide = () => {
    if (props.title === 'Portafolio') {
      const newIndex = (props.portafolioCurrentIndex - 1 + props.items.length) % props.items.length
      emit('update:portafolioCurrentIndex', newIndex)
    } else {
      const newIndex = (props.currentIndex - 1 + props.items.length) % props.items.length
      emit('update:currentIndex', newIndex)
    }
  }
  const nextSlide = () => {
    if (props.title === 'Portafolio') {
      const newIndex = (props.portafolioCurrentIndex + 1) % props.items.length
      emit('update:portafolioCurrentIndex', newIndex)
    } else {
      const newIndex = (props.currentIndex + 1) % props.items.length
      emit('update:currentIndex', newIndex)
    }
  }

  // Background style computed
  const backgroundStyle = computed(() => {
    const style: Record<string, string> = {}
    if (props.backgroundColor) {
      style.backgroundColor = `color-mix(in oklab, ${props.backgroundColor} 90%, transparent)`
    }
    if (props.background) {
      style.backgroundImage = `url(${props.background})`
      style.backgroundSize = 'cover'
      style.backgroundPosition = 'center'
      style.backgroundRepeat = 'no-repeat'
      style.backgroundAttachment = 'fixed'
    }
    return style
  })

  // Current dot index for dots navigation
  const currentDotIndex = computed(() =>
    props.title === 'Portafolio' ? props.portafolioCurrentIndex : props.currentIndex
  )

  // Calculate visible dots (max 5)
  const visibleDots = computed(() => {
    const total = props.items.length
    const current = currentDotIndex.value
    if (total <= 5) return Array.from({ length: total }, (_, i) => i)

    if (current <= 2) return [0, 1, 2, 3, 4]
    if (current >= total - 3) return [total - 5, total - 4, total - 3, total - 2, total - 1]
    return [current - 2, current - 1, current, current + 1, current + 2]
  })

  // Go to a specific slide
  function goToSlide(i: number) {
    if (props.title === 'Portafolio') {
      emit('update:portafolioCurrentIndex', i)
    } else {
      emit('update:currentIndex', i)
    }
  }

  // Autoplay logic (only when arrows are hidden)
  let autoplayInterval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    if (!props.showArrow) {
      if (autoplayInterval) clearInterval(autoplayInterval)
      autoplayInterval = setInterval(() => {
        if (props.title === 'Portafolio') {
          emit(
            'update:portafolioCurrentIndex',
            (props.portafolioCurrentIndex + 1) % (props.items.length || 1)
          )
        } else {
          emit('update:currentIndex', (props.currentIndex + 1) % (props.items.length || 1))
        }
      }, 4000)
    }
  })
  onBeforeUnmount(() => {
    if (autoplayInterval) clearInterval(autoplayInterval)
  })
</script>

<template>
  <section :style="backgroundStyle" class="flex flex-col min-h-[400px]">
    <div
      class="relative flex flex-col items-center justify-center w-full px-2 py-8 mx-auto shadow-lg max-w-8xl sm:px-6 bg-black/30 backdrop-blur-md"
    >
      <h3 v-if="title" class="py-6 text-xl italic text-center text-white sm:text-2xl md:text-3xl">
        {{ title }}
      </h3>
      <div class="flex items-center justify-center w-full min-h-[700px] relative overflow-hidden">
        <Transition name="fade" mode="out-in">
          <slot :go-prev="prevSlide" :go-next="nextSlide" />
        </Transition>
      </div>
      <!-- Navigation arrows -->
      <button
        v-if="showArrow"
        class="absolute z-10 flex items-center justify-center text-white -translate-y-1/2 rounded-full cursor-pointer left-2 md:left-4 lg:left-30 2xl:left-42 top-1/2 size-10 md:size-12 bg-white/20 backdrop-blur-md hover:bg-white/40"
        @click="prevSlide"
      >
        <Icon name="mdi:chevron-left" size="24" />
      </button>

      <button
        v-if="showArrow"
        class="absolute z-10 flex items-center justify-center text-white -translate-y-1/2 rounded-full cursor-pointer right-2 md:right-4 lg:right-30 2xl:right-42 top-1/2 size-10 md:size-12 bg-white/20 backdrop-blur-md hover:bg-white/40"
        @click="nextSlide"
      >
        <Icon name="mdi:chevron-right" size="24" />
      </button>
      <!-- Dots navigation -->
      <div class="flex items-center justify-center gap-2 mt-6">
        <template v-if="items.length <= 5">
          <button
            v-for="(item, i) in items"
            :key="i"
            class="w-3 h-3 transition-all duration-200 rounded-full"
            :class="i === currentDotIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300 opacity-60'"
            aria-label="Go to slide"
            @click="goToSlide(i)"
          />
        </template>
        <template v-else>
          <button
            v-for="i in visibleDots"
            :key="i"
            class="w-3 h-3 transition-all duration-200 rounded-full"
            :class="i === currentDotIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300 opacity-60'"
            aria-label="Go to slide"
            @click="goToSlide(i)"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.4s,
      transform 0.4s;
    position: absolute;
    width: 100%;
  }
  .fade-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  .fade-enter-to {
    opacity: 1;
    transform: translateX(0);
  }
  .fade-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  .fade-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }
</style>
