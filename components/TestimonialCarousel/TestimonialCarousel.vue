<script setup lang="ts">
  import type { PropType } from 'vue'
  import type { SocialMediaType, Testimonial } from '~/types/common'

  defineProps({
    item: { type: Object as PropType<Testimonial>, required: true },
    color: { type: String, default: 'gray/10' },
    background: { type: String, default: 'black' }
  })

  const iconStyles = {
    base: { color: 'gray' },
    hover: { color: 'oklch(70.7% 0.165 254.624)' }
  }
  const hoverIcon = (item: SocialMediaType) => {
    item.isHovered = true
  }
  const leaveIcon = (item: SocialMediaType) => {
    item.isHovered = false
  }
</script>

<template>
  <section class="relative flex items-center justify-center w-full h-auto py-8 overflow-hidden">
    <div
      class="flex items-center justify-center w-full"
      :style="{
        backgroundColor: color,
        backgroundImage: background ? `url(${background})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
      <div
        class="flex flex-col w-full max-w-xs mx-auto my-4 bg-white border-2 border-gray-200 rounded-lg shadow-xl sm:max-w-md md:max-w-lg lg:max-w-4xl md:h-100 lg:h-90 backdrop-blur-sm"
      >
        <div class="flex flex-col gap-2 px-4 pt-4 md:flex-row">
          <NuxtImg
            :src="item.image"
            :alt="item.name"
            format="webp"
            class="self-center object-cover mb-2 border-4 border-blue-400 rounded-full cursor-pointer size-20 md:mb-0 md:size-25 lg:size-30"
          />
          <div
            class="flex flex-col items-center justify-center w-full lg:justify-baseline lg:items-start md:items-start"
          >
            <h4
              class="flex flex-row flex-wrap items-center justify-center text-base font-bold uppercase md:text-lg md:justify-start"
            >
              {{ item.name }}
              <span class="flex flex-row gap-2 px-2">
                <a
                  v-for="social in item.socialMedia"
                  :key="social.name"
                  :href="social.link"
                  target="_blank"
                  class="flex flex-row"
                >
                  <Icon
                    :name="social.icon"
                    :size="22"
                    :style="social.isHovered ? iconStyles.hover : iconStyles.base"
                    @mouseover="hoverIcon(social)"
                    @mouseleave="leaveIcon(social)"
                  />
                </a>
              </span>
            </h4>
            <p class="mt-1 text-xs text-gray-500 md:text-sm">
              {{ item.position }}
            </p>
            <Badge
              class="py-2 text-xs font-bold md:text-sm"
              :theme="item.type === 'Trabajo' ? 'warning' : 'success'"
              :value="item.type"
            />
          </div>
        </div>
        <div>
          <p class="p-4 text-sm font-light text-center md:p-8 md:text-lg md:text-left">
            <q>{{ item.description }}</q>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
