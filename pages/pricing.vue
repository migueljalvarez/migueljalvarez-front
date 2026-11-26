<script setup lang="ts">
  import PricingContent from '~/components/templates/Pricing/PricingContent.vue'
  import { PRICING_TERMS } from '~/data/pricing'

  const { offers } = await useServiceOffers()

  definePageMeta({ path: '/como-cobro' })

  usePageSeo({
    title: 'Cómo cobro: precios de mis servicios',
    description:
      'Servicios acotados con precio «desde» en USD: consultoría, diagnóstico, revisión de código y descubrimiento. Sabes cuánto cuesta cada paso antes de empezar.',
    path: '/como-cobro'
  })
  useBreadcrumbJsonLd([{ name: 'Cómo cobro', path: '/como-cobro' }])
</script>

<template>
  <div>
    <PricingContent :offers="offers" :terms="PRICING_TERMS" />
  </div>
</template>
