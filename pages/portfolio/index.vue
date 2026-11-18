<script setup lang="ts">
  import { BackLink } from '~/components/molecules'
  import PortfolioSection from '~/components/templates/Portfolio/PortfolioSection.vue'

  const { allCards } = await usePortfolio()

  definePageMeta({
    path: '/portafolio',
    layout: 'default',
    title: 'Portafolio'
  })

  usePageSeo({
    title: 'Portafolio',
    description:
      'Proyectos y soluciones digitales desarrollados para resolver problemas concretos.',
    path: '/portafolio'
  })
</script>

<template>
  <div class="bg-brand-surface px-4 py-8 md:py-12">
    <div class="mx-auto w-full max-w-7xl">
      <BackLink to="/" class="mb-8">Volver al inicio</BackLink>

      <PortfolioSection
        title="Portafolio"
        heading="Soluciones que generan impacto"
        description="Una selección de productos, plataformas y sistemas construidos para resolver problemas concretos."
        heading-level="h1"
        section-id="portfolio-page"
        :projects="allCards"
        :show-view-all="false"
        :reveal="false"
      />
    </div>
  </div>
</template>
