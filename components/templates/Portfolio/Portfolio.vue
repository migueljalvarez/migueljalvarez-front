<script lang="ts" setup>
  import { Title } from '~/components/atoms'

  import type { PortfolioProps } from '../templates'
  import PortfolioItem from './PortfolioItem.vue'

  defineProps<PortfolioProps>()
</script>
<template>
  <section
    id="portfolio"
    class="flex flex-col items-center justify-center w-full h-auto px-4 py-8 pt-20 text-lg font-bold text-gray-800 bg-white-300"
  >
    <Title text="Portafolio" variant="h2" class="pb-8 mb-4 italic text-center text-gray-800" />
    <!-- TODO: Cuando se pueda agregar otro colocar 4 columnas -->
    <div class="grid grid-cols-1 gap-8 p-8 rounded-lg md:grid-cols-2 lg:grid-cols-3">
      <PortfolioItem
        v-for="project in projects"
        :id="project?.id"
        :key="project?.id"
        :title="project?.title"
        :type="project?.type"
        :image="project.urlImage"
        :portfolio-type="project?.portfolioType"
        :technologies="project?.technologies"
      />
    </div>
  </section>
</template>

<style></style>
