<script setup lang="ts">
  import { Button, Card } from '~/components/atoms'
  import { SectionHeader } from '~/components/molecules'
  import { Section, ServiceOfferCard } from '~/components/organisms'
  import { WHATSAPP_URL } from '~/constants/common'
  import { PRICING_COPY } from '~/data/pricing'
  import type { PricingContentProps } from '../template'

  /** Ofertas con su precio (API con respaldo sin precios); las condiciones de cobro son texto de marca. */
  defineProps<PricingContentProps>()
</script>

<template>
  <Section id="como-cobro" class="gap-8 bg-brand-surface px-4 py-12 md:gap-10 md:py-16">
    <div class="mx-auto w-full max-w-7xl">
      <SectionHeader
        :eyebrow="PRICING_COPY.eyebrow"
        :heading="PRICING_COPY.heading"
        :description="PRICING_COPY.description"
        level="h1"
        class="max-w-3xl"
      />
    </div>

    <div class="mx-auto w-full max-w-7xl">
      <h2 class="text-2xl font-semibold text-brand-ink">{{ PRICING_COPY.offersHeading }}</h2>
      <ul class="mt-5 grid gap-4 md:grid-cols-2 md:gap-5" aria-label="Servicios y precios">
        <li v-for="offer in offers" :key="offer.id" class="min-w-0">
          <ServiceOfferCard :offer="offer" :unpriced-label="PRICING_COPY.unpriced" />
        </li>
      </ul>
    </div>

    <div class="mx-auto w-full max-w-7xl">
      <h2 class="text-2xl font-semibold text-brand-ink">{{ PRICING_COPY.termsHeading }}</h2>
      <div class="mt-5 grid gap-4 md:grid-cols-2 md:gap-5">
        <Card v-for="term in terms" :key="term.title" as="article" class="p-5 md:p-6">
          <h3 class="text-lg font-semibold text-brand-ink">{{ term.title }}</h3>
          <p class="mt-3 text-sm leading-6 text-brand-muted">{{ term.text }}</p>
        </Card>
      </div>
    </div>

    <div class="mx-auto w-full max-w-7xl">
      <aside
        class="flex flex-col gap-6 rounded-[1.25rem] bg-surface-inverse p-7 text-brand-text-strong md:flex-row md:items-center md:justify-between md:p-12"
        aria-labelledby="pricing-cta-heading"
      >
        <div class="max-w-xl">
          <h2 id="pricing-cta-heading" class="text-2xl font-semibold leading-tight md:text-3xl">
            {{ PRICING_COPY.ctaHeading }}
          </h2>
          <p class="mt-3 text-base leading-7 text-brand-text-soft">{{ PRICING_COPY.ctaText }}</p>
        </div>
        <Button
          v-track="{ id: 'wa_como_trabajo' }"
          as="a"
          :href="WHATSAPP_URL"
          target="_blank"
          rel="noopener noreferrer"
          theme="whatsapp"
          size="lg"
          icon="mdi:whatsapp"
          icon-position="left"
          :on-dark="true"
          class="md:shrink-0"
        >
          Hablemos por WhatsApp
        </Button>
      </aside>
    </div>
  </Section>
</template>
