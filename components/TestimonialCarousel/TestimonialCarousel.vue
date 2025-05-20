<script setup lang="ts">
import { ref } from "vue";

import type { SocialMediaType, Testimonial } from "~/common/types";

const currentIndex = ref(0);
const props = defineProps({
  slides: { type: Array<Testimonial>, required: true },
  color: { type: String, default: "gray/10" },
  background: { type: String, default: "black" },
});

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.slides.length) % props.slides.length;
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length;
};
const iconStyles = {
  base: {
    color: "gray",
  },
  hover: {
    color: "oklch(70.7% 0.165 254.624)",
  },
};

const hoverIcon = (item: SocialMediaType) => {
  item.isHovered = true;
};
const leaveIcon = (item: SocialMediaType) => {
  item.isHovered = false;
};
</script>

<template>
  <section class="relative w-5/6 h-auto overflow-hidden rounded-xl">
    <!-- Slides wrapper -->

    <div
      ref="track"
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="flex items-center justify-center min-w-full"
        :style="{
          backgroundColor: color,
          backgroundImage: background ? `url(${background})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      >
        <div
          class="flex flex-col w-full text-black bg-white border-2 border-gray-200 rounded-lg shadow-xl lg:w-5/6 h-72 backdrop-blur-sm"
        >
          <div class="flex gap-2 px-4">
            <img
              :src="slide.image"
              :alt="slide.name"
              class="self-center object-cover mt-4 border-4 border-blue-400 rounded-full cursor-pointer size-16"
            />
            <div class="flex flex-col items-start justify-center">
              <h4
                class="flex flex-row text-lg font-bold uppercase place-items-center"
              >
                {{ slide.name }}
                <span class="flex flex-row gap-2 px-2">
                  <a
                    v-for="social in slide.socialMedia"
                    :key="social.name"
                    :href="social.link"
                    target="_blank"
                    class="flex flex-row"
                  >
                    <Icon
                      :name="social.icon"
                      :size="24"
                      :style="
                        social.isHovered ? iconStyles.hover : iconStyles.base
                      "
                      @mouseover="hoverIcon(social)"
                      @mouseleave="leaveIcon(social)"
                    />
                  </a> </span
                ><Banner
                  class="text-sm"
                  :theme="slide.type === 'Trabajo' ? 'warning' : 'success'"
                  :value="slide.type"
                />
              </h4>

              <p class="text-sm text-gray-500">{{ slide.position }}</p>
            </div>
          </div>
          <div>
            <p class="h-auto p-8 m-4 text-lg font-light">
              <q>{{ slide.description }}</q>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Arrows -->
    <button
      class="absolute flex items-center justify-center px-2 text-white transform -translate-y-1/2 rounded-full cursor-pointer left-4 size-12 top-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-7xl"
      @click="prevSlide"
    >
      <Icon name="mdi:chevron-left" size="24" />
    </button>
    <button
      class="absolute flex items-center justify-center text-2xl text-white transform -translate-y-1/2 rounded-full cursor-pointer right-4 size-12 top-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20"
      @click="nextSlide"
    >
      <Icon name="mdi:chevron-right" size="24" />
    </button>
  </section>
</template>

<style scoped>
/* No extra styles needed; Tailwind takes care of it */
</style>
