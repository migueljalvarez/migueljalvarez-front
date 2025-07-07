<script setup lang="ts">
  import type { PropType } from 'vue'
  import type { Testimonial } from '~/types/common'

  import { AvatarCard } from '../molecules'

  defineProps({
    title: { type: String, default: '' },
    item: { type: Object as PropType<Testimonial>, required: true },
    color: { type: String, default: 'gray/10' },
    background: { type: String, default: 'black' }
  })
</script>

<template>
  <section class="relative flex items-center justify-center w-full h-auto py-8 overflow-hidden">
    <div
      class="flex items-center justify-center w-full"
      :style="{
        backgroundColor: color,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
      <div
        class="flex flex-col w-full max-w-xs mx-auto my-4 bg-white border-2 border-gray-200 rounded-lg shadow-xl min-h-max sm:max-w-md md:max-w-lg lg:max-w-2xl md:h-100 lg:h-90 backdrop-blur-sm"
      >
        <div class="w-full py-4 md:p-8 max-w-[600px] my-5 mx-auto lg:mx-8">
          <blockquote
            class="relative px-8 text-sm italic text-gray-800 md:p-8 md:text-lg md:text-left"
          >
            <span
              class="absolute text-5xl left-[6px] top-[-20px] md:top-2.5 lg:left-[-30px] lg:top-[0px] lg:text-8xl text-gray-600 opacity-20 font-mono"
            >
              “
            </span>
            <p>{{ item.description }}</p>
          </blockquote>
          <div class="flex flex-col gap-2 px-4 pt-4 md:flex-row">
            <AvatarCard
              :image="item.image"
              :name="item.name"
              :social-media="item.socialMedia"
              :sub-title="item.position"
              :type="item.type"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
  .cita-card .text-6xl {
    font-size: 6rem; /* Ajuste del tamaño */
    opacity: 0.15;
    font-weight: 700; /* Comillas más prominentes */
  }
</style>
