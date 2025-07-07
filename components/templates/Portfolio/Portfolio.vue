<script lang="ts" setup>
  import { Title } from '~/components/atoms'

  import type { PortfolioProps } from '../templates'
  import PortfolioItem from './PortfolioItem.vue'

  defineProps<PortfolioProps>()
</script>
<template>
  <section
    id="portfolio"
    class="flex flex-col items-center justify-center w-full h-auto px-4 py-8 pt-20 text-lg font-bold text-gray-800 bg-slate-300"
  >
    <Title text="Portafolio" variant="h2" class="pb-8 mb-4 italic text-center text-gray-800" />
    <div class="grid grid-cols-1 gap-8 p-8 rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <PortfolioItem
        v-for="project in projects"
        :id="project?.id"
        :key="project?.id"
        :title="project?.title"
        :type="project?.type"
        :portfolio-type="project?.portafolioType"
        :technologies="project?.technologies"
      />
    </div>
  </section>
</template>

<style></style>
