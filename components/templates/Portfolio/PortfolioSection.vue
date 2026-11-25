<script lang="ts" setup>
  import { HOME_COPY } from '~/constants/common'
  import type { PortfolioCardProject } from '~/types/portfolio'
  import PortfolioList from '../PortfolioList/PortfolioList.vue'

  // Portafolio de la home: las mismas tarjetas que `/portafolio` (PortfolioList) con el título de la sección en
  // h2, la animación de entrada y el enlace «Ver todos los proyectos». Este archivo conserva su nombre porque el
  // hook `build:manifest` de nuxt.config.ts (prefetch) depende del chunk `PortfolioSection`.
  defineProps<{ title: string; projects: PortfolioCardProject[] }>()
</script>

<template>
  <PortfolioList
    :projects="projects"
    :eyebrow="title"
    :heading="HOME_COPY.portfolio.heading"
    :description="HOME_COPY.portfolio.description"
    heading-level="h2"
    section-id="portfolio"
    :show-filters="false"
    show-view-all
    reveal
  />
</template>
