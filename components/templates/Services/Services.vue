<script setup lang="ts">
  import { Section } from '~/components/organisms'
  import { SERVICE_OFFERINGS } from '~/data/services'
  import { HOME_COPY } from '~/constants/common'
  import ServiceCard from './ServiceCard.vue'
</script>

<template>
  <Section
    id="services"
    class="gap-8 bg-brand-surface px-4 pt-12 pb-12 md:gap-10 md:pt-12 md:pb-16"
    aria-labelledby="services-heading"
  >
    <div
      class="relative z-10 -mt-25 mx-auto w-full max-w-7xl rounded-2xl border border-brand-border bg-brand-surface-card p-6 md:p-8"
    >
      <p class="text-sm font-semibold uppercase tracking-[0.08em] text-brand-accent-text">
        {{ HOME_COPY.services.eyebrow }}
      </p>
      <div class="mt-4 flex flex-col gap-4">
        <h2
          id="services-heading"
          class="max-w-5xl text-2xl font-semibold leading-tight text-brand-ink md:text-3xl"
        >
          {{ HOME_COPY.services.heading }}
        </h2>
        <p class="max-w-6xl text-base leading-7 text-brand-muted">
          {{ HOME_COPY.services.descriptionStart }}
          <span class="text-brand-accent-text">{{ HOME_COPY.services.viable }}</span>
          {{ HOME_COPY.services.descriptionEnd }}
        </p>
      </div>
    </div>

    <div class="mx-auto w-full max-w-7xl">
      <h3 class="mb-5 text-xl font-semibold text-brand-ink md:text-2xl">
        {{ HOME_COPY.services.prompt }}
      </h3>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ServiceCard
          v-for="offering in SERVICE_OFFERINGS"
          :key="offering.id"
          :offering="offering"
        />
      </div>
    </div>
  </Section>
</template>
