<script setup lang="ts">
  import { NuxtLink } from '#components'
  import { Badge } from '~/components/atoms'
  import type { PorfolioItemProps } from '../templates'

  // Define or import PorfolioType

  const props = defineProps<PorfolioItemProps>()

  const portfolioTypeClass = computed(() => ({
    'text-white bg-green-700': props.portfolioType === 'Cliente',
    'text-white bg-gray-500': props.portfolioType === 'Practica'
  }))
</script>
<template>
  <div
    class="relative flex flex-col h-full overflow-hidden border border-gray-300 hover:shadow-2xl w-70 2xl:w-80 rounded-xl hover:scale-110"
  >
    <NuxtLink :to="`/portafolio/${id}`" class="flex flex-col h-full">
      <div
        :class="portfolioTypeClass"
        class="absolute px-2 py-1 text-xs font-bold rounded shadow-md top-2 right-2"
      >
        {{ !portfolioType ? 'PROYECTO' : portfolioType.toUpperCase() }}
      </div>
      <div class="flex items-center justify-center w-full bg-gray-100">
        <div class="w-full">
          <NuxtImg
            :src="image"
            :alt="title"
            width="278"
            height="209"
            class="object-center rounded-lg rounded-b-none w-80"
            format="webp"
            loading="lazy"
          />
        </div>
      </div>
      <div class="flex items-center justify-between w-full p-4 rounded-b-lg bg-gray-50">
        <span class="flex-col text-black">
          <p class="font-sans italic font-medium">{{ title }}</p>
          <span
            v-for="technology of technologies"
            :key="technology"
            class="inline-flex items-center gap-1 py-2"
          >
            <Badge :value="technology" theme="info" class="px-1 font-medium" />
          </span>
        </span>
      </div>
    </NuxtLink>
  </div>
</template>
<style scoped></style>
