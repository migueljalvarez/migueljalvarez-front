<script lang="ts" setup>
  import { Button, Card } from '~/components/atoms'
  import {
    ChipList,
    ImageCollage,
    InfoCard,
    QuoteBlock,
    SectionHeader,
    StatList
  } from '~/components/molecules'
  import { HOME_COPY } from '~/constants/common'
  import type { AboutContent } from '~/types/about'

  // "Sobre mí": quién soy → qué me mueve → cifras → cómo trabajo / fuera del trabajo → herramientas → CTA.
  // Solo recibe datos (la home los carga con `useAbout`; el panel pasa los del formulario). Todo bloque
  // opcional se omite si no tiene contenido. El diseño responde al ancho del contenedor (`@container`).
  const props = defineProps<{ content: AboutContent }>()

  const place = computed(() =>
    [props.content.location, props.content.workMode].filter(Boolean).join(' · ')
  )
  const hasCards = computed(() => !!props.content.howIWork || !!props.content.beyondWork)
  const cta = computed(() => props.content.cta)
  const isInternal = computed(() => !!cta.value && cta.value.href.startsWith('/'))
  const isWhatsapp = computed(() => /wa\.me|wa\.link|whatsapp/i.test(cta.value?.href ?? ''))
</script>

<template>
  <section id="about" class="@container w-full bg-brand-surface px-4 py-12 text-brand-ink md:py-16">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 md:gap-10">
      <SectionHeader :eyebrow="content.eyebrow" :heading="content.heading" size="lg" />

      <div class="grid min-w-0 grid-cols-1 gap-8 @4xl:grid-cols-5 @4xl:items-center @4xl:gap-12">
        <div class="min-w-0 @4xl:col-span-2">
          <div class="w-full max-w-md @4xl:max-w-none">
            <ImageCollage :images="content.images" />
            <p
              v-if="place"
              class="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface-card px-3 py-1.5 text-xs font-medium text-brand-ink"
            >
              <Icon name="mdi:map-marker" size="18" class="text-brand-blue" aria-hidden="true" />
              {{ place }}
            </p>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-5 @4xl:col-span-3 md:gap-6">
          <p class="text-base leading-7 text-brand-muted md:text-lg md:leading-8">
            {{ content.intro }}
          </p>
          <QuoteBlock v-if="content.quote">{{ content.quote }}</QuoteBlock>
          <StatList v-if="content.stats.length" :items="content.stats" />
        </div>
      </div>

      <div
        v-if="hasCards"
        class="grid grid-cols-1 gap-4 md:gap-5"
        :class="content.howIWork && content.beyondWork ? '@2xl:grid-cols-2' : ''"
      >
        <InfoCard v-if="content.howIWork" :title="HOME_COPY.about.howIWorkTitle">
          {{ content.howIWork }}
        </InfoCard>
        <InfoCard v-if="content.beyondWork" :title="HOME_COPY.about.beyondWorkTitle">
          {{ content.beyondWork }}
        </InfoCard>
      </div>

      <div v-if="content.tools.length">
        <h3 class="mb-3 text-lg font-semibold leading-tight text-brand-ink">
          {{ HOME_COPY.about.toolsTitle }}
        </h3>
        <ChipList :items="content.tools" :label="HOME_COPY.about.toolsTitle" />
      </div>

      <Card
        v-if="cta || content.availability"
        class="flex flex-col items-start gap-4 p-5 md:p-6 @2xl:flex-row @2xl:items-center @2xl:justify-between"
      >
        <p
          v-if="content.availability"
          class="min-w-0 text-sm leading-6 text-brand-muted md:text-base"
        >
          {{ content.availability }}
        </p>
        <Button
          v-if="cta"
          :to="isInternal ? cta.href : undefined"
          :href="isInternal ? undefined : cta.href"
          :as="isInternal ? undefined : 'a'"
          :target="isInternal ? undefined : '_blank'"
          :rel="isInternal ? undefined : 'noopener noreferrer'"
          :icon="isWhatsapp ? 'mdi:whatsapp' : undefined"
          class="w-full whitespace-nowrap @2xl:w-auto"
          theme="primary"
        >
          {{ cta.label }}
        </Button>
      </Card>
    </div>
  </section>
</template>
