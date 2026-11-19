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

  // "Sobre mí": quién soy (título, ubicación y presentación junto a la foto) → qué me mueve (cita) → cifras →
  // cómo trabajo / fuera del trabajo → herramientas → cierre con disponibilidad y botón.
  // Solo recibe datos (la home los carga con `useAbout`; el panel pasa los del formulario). Todo bloque
  // opcional se omite si no tiene contenido. El diseño responde al ancho del contenedor (`@container`).
  const props = defineProps<{ content: AboutContent }>()

  const place = computed(() =>
    [props.content.location, props.content.workMode].filter(Boolean).join(' · ')
  )
  const hasImages = computed(() => props.content.images.length > 0)
  const hasCards = computed(() => !!props.content.howIWork || !!props.content.beyondWork)
  const cta = computed(() => props.content.cta)
  const isInternal = computed(() => !!cta.value && cta.value.href.startsWith('/'))
  const isWhatsapp = computed(() => /wa\.me|wa\.link|whatsapp/i.test(cta.value?.href ?? ''))
</script>

<template>
  <section
    id="about"
    class="@container relative w-full overflow-hidden bg-brand-surface px-4 py-12 text-brand-ink md:py-16"
  >
    <!-- Marca a color como fondo decorativo: opacidad baja, recortada por la sección (sin desborde) y bajo
         el contenido. Las tarjetas blancas la tapan donde se cruzan. -->
    <img
      src="/only-brand-color.svg"
      width="417"
      height="349"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      class="pointer-events-none absolute -top-6 -right-20 z-0 h-auto w-64 opacity-[0.05] select-none @4xl:-top-16 @4xl:-right-32 @4xl:w-120"
    />
    <div class="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 md:gap-10">
      <div class="grid min-w-0 grid-cols-1 gap-x-12 gap-y-6 @4xl:grid-cols-5 @4xl:gap-y-5">
        <div
          class="min-w-0 @4xl:row-start-1"
          :class="hasImages ? '@4xl:col-span-3 @4xl:col-start-3' : '@4xl:col-span-5'"
        >
          <SectionHeader :eyebrow="content.eyebrow" :heading="content.heading" size="lg" />
          <p v-if="place" class="mt-4 flex items-center gap-2 text-sm font-medium text-brand-muted">
            <Icon
              name="mdi:map-marker"
              size="18"
              class="shrink-0 text-brand-blue"
              aria-hidden="true"
            />
            {{ place }}
          </p>
        </div>

        <div
          v-if="hasImages"
          class="min-w-0 @4xl:col-span-2 @4xl:col-start-1 @4xl:row-span-2 @4xl:row-start-1"
        >
          <ImageCollage :images="content.images" />
        </div>

        <div
          class="flex min-w-0 flex-col gap-5 @4xl:row-start-2 md:gap-6"
          :class="hasImages ? '@4xl:col-span-3 @4xl:col-start-3' : '@4xl:col-span-5'"
        >
          <p
            class="text-lg leading-7 text-brand-ink md:text-xl md:leading-8"
            :class="hasImages ? '' : 'max-w-3xl'"
          >
            {{ content.intro }}
          </p>
          <QuoteBlock v-if="content.quote">{{ content.quote }}</QuoteBlock>
          <StatList v-if="content.stats.length" :items="content.stats" />
        </div>
      </div>

      <Card
        v-if="hasCards"
        class="grid grid-cols-1 divide-y divide-brand-border overflow-hidden"
        :class="
          content.howIWork && content.beyondWork
            ? '@2xl:grid-cols-2 @2xl:divide-x @2xl:divide-y-0'
            : ''
        "
      >
        <InfoCard v-if="content.howIWork" :title="HOME_COPY.about.howIWorkTitle">
          {{ content.howIWork }}
        </InfoCard>
        <InfoCard v-if="content.beyondWork" :title="HOME_COPY.about.beyondWorkTitle">
          {{ content.beyondWork }}
        </InfoCard>
      </Card>

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
          class="flex min-w-0 items-center gap-2 text-sm leading-6 font-medium text-brand-ink md:text-base"
        >
          <span class="size-2.5 shrink-0 rounded-full bg-brand-whatsapp" aria-hidden="true" />
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
