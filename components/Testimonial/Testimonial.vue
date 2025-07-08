<script lang="ts" setup>
  import Carousel from '../Carousel/Carousel.vue'
  import type { Testimonial } from '~/types/common'
  const currentIndex = ref(0)
  const touchStartX = ref(0)
  defineProps({
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array as () => Testimonial[],
      required: true
    }
  })
</script>
<template>
  <section>
    <Carousel
      v-model:current-index="currentIndex"
      title="Ellos confían en mí"
      background="/testimonial-bg.webp"
      :items="items"
    >
      <template #default="{ goPrev, goNext }">
        <TestimonialCarousel
          :key="currentIndex"
          :item="items[currentIndex]"
          @touchstart="(e: TouchEvent) => (touchStartX = e.changedTouches[0].screenX)"
          @touchend="
            (e: TouchEvent) => {
              const diff = e.changedTouches[0].screenX - touchStartX
              if (Math.abs(diff) > 50) {
                if (diff < 0) goNext()
                else goPrev()
              }
            }
          "
        />
      </template>
    </Carousel>
  </section>
</template>

<style></style>
