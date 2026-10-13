<script setup lang="ts">
  import PortfolioSection from '~/components/templates/Portfolio/PortfolioSection.vue'
  import { ALL_PORTFOLIO_CARD_PROJECTS } from '~/constants/portfolio'

  definePageMeta({
    layout: 'default',
    title: 'Portafolio'
  })

  useSeoMeta({
    title: 'Portafolio',
    description:
      'Proyectos y soluciones digitales desarrollados para resolver problemas concretos.'
  })
</script>

<template>
  <div class="min-h-screen bg-brand-surface px-4 py-8 md:py-12">
    <div class="mx-auto w-full max-w-7xl">
      <NuxtLink
        to="/"
        class="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
      >
        <Icon name="mdi:arrow-left" size="18" aria-hidden="true" />
        Volver al inicio
      </NuxtLink>

      <PortfolioSection
        title="Portafolio"
        heading="Proyectos y soluciones"
        description="Una selección de productos, plataformas y sistemas construidos para resolver problemas concretos."
        heading-level="h1"
        section-id="portfolio-page"
        :projects="ALL_PORTFOLIO_CARD_PROJECTS"
        :show-view-all="false"
        :reveal="false"
      />
    </div>
  </div>
</template>
