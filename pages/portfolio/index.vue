<script setup lang="ts">
  import { BackLink } from '~/components/molecules'
  import PortfolioList from '~/components/templates/PortfolioList/PortfolioList.vue'

  const { allCards } = await usePortfolio()

  definePageMeta({
    path: '/portafolio',
    layout: 'default',
    title: 'Portafolio'
  })

  usePageSeo({
    title: 'Portafolio: aplicaciones que he construido',
    description:
      'Productos propios en beta construidos para resolver problemas concretos. Mira el problema, mis decisiones y dónde está cada uno hoy.',
    path: '/portafolio'
  })
  useBreadcrumbJsonLd([{ name: 'Portafolio', path: '/portafolio' }])
</script>

<template>
  <div class="bg-brand-surface px-4 py-12 md:py-16">
    <div class="mx-auto w-full max-w-7xl">
      <BackLink to="/" class="mb-6">Volver al inicio</BackLink>
      <PortfolioList :projects="allCards" />
    </div>
  </div>
</template>
