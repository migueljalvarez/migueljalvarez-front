<script setup lang="ts">
  import { Section } from '~/components/organisms'
  import { SERVICE_OFFERINGS } from '~/data/services'
  import ServiceCard from './ServiceCard.vue'
</script>

<template>
  <Section
    id="services"
    class="gap-8 bg-brand-surface px-4 py-12 md:gap-10 md:py-16"
    aria-labelledby="services-heading"
  >
    <div class="mx-auto w-full max-w-7xl">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent-text">
        Servicios
      </p>
      <h2
        id="services-heading"
        class="max-w-3xl text-2xl font-semibold leading-tight text-brand-ink md:text-3xl"
      >
        Cómo puedo ayudarte
      </h2>
      <p class="mt-3 max-w-3xl text-sm leading-6 text-brand-muted md:text-base md:leading-7">
        Empezamos por lo que necesitas resolver y definimos juntos el siguiente paso.
      </p>
    </div>

    <div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ServiceCard v-for="offering in SERVICE_OFFERINGS" :key="offering.id" :offering="offering" />
    </div>
  </Section>
</template>
