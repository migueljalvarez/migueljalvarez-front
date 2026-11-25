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
    title: 'Portafolio',
    description:
      'Productos y plataformas digitales, propios y de clientes, construidos para resolver problemas concretos. Mira el contexto y la solución de cada proyecto.',
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
