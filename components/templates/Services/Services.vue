<script setup lang="ts">
  import { Card } from '~/components/atoms'
  import { SectionHeader } from '~/components/molecules'
  import { Section, ServiceCard } from '~/components/organisms'
  import { SERVICE_OFFERINGS } from '~/data/services'
  import { HOME_COPY } from '~/constants/common'
</script>

<template>
  <Section
    id="services"
    class="gap-8 bg-brand-surface px-4 pt-12 pb-12 md:gap-10 md:pb-16"
    aria-labelledby="services-heading"
  >
    <Card class="relative z-10 -mt-25 mx-auto w-full max-w-7xl p-6 md:p-8">
      <SectionHeader
        :eyebrow="HOME_COPY.services.eyebrow"
        :heading="HOME_COPY.services.heading"
        heading-id="services-heading"
      >
        {{ HOME_COPY.services.descriptionStart }}
        <span class="text-brand-accent-text">{{ HOME_COPY.services.viable }}</span>
        {{ HOME_COPY.services.descriptionEnd }}
      </SectionHeader>
    </Card>

    <div class="mx-auto w-full max-w-7xl">
      <h3 class="mb-6 text-xl font-semibold text-brand-ink md:text-2xl">
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
