<script lang="ts" setup>
  import { Button, Card } from '~/components/atoms'
  import {
    ChipList,
    ImageCarousel,
    InfoCard,
    QuoteBlock,
    SectionHeader,
    StatList
  } from '~/components/molecules'
  import { HOME_COPY } from '~/constants/common'
  import type { AboutContent } from '~/types/about'

  // "Sobre mí": encabezado con divisor y dos tarjetas lado a lado (texto 7/12 y foto 5/12 desde `@4xl`;
  // apiladas debajo). Texto: cargo → frase de presentación → cifras → cómo trabajo → principio clave.
  // Foto: carrusel con la cifra principal como etiqueta, nombre y ubicación, y "Fuera del trabajo" con
  // etiquetas. Luego herramientas y cierre con disponibilidad y botón.
  // Sin fotos, el carrusel muestra el placeholder de marca (si hay cargo o nombre; si no, se omite la tarjeta).
  // Solo recibe datos (la home los carga con `useAbout`; el panel pasa los del formulario). Todo bloque
  // sin datos se omite. El diseño responde al ancho del contenedor (`@container`).
  const props = defineProps<{ content: AboutContent }>()

  const place = computed(() =>
    [props.content.location, props.content.workMode].filter(Boolean).join(' · ')
  )
  const mainStat = computed(() => props.content.stats[0])
  const interests = computed(() => props.content.interests ?? [])
  const hasProfile = computed(() => !!props.content.name || !!place.value)
  // Sin fotos, la tarjeta se mantiene (con el placeholder de marca) solo si hay quién la presente:
  // cargo o nombre. Sin ninguno sería un recuadro vacío y la tarjeta de texto ocupa todo el ancho.
  const showPhotoCard = computed(
    () => props.content.images.length > 0 || !!props.content.name || !!props.content.role
  )
  const hasBeyondWork = computed(() => !!props.content.beyondWork || interests.value.length > 0)
  const cta = computed(() => props.content.cta)
  const isInternal = computed(() => !!cta.value && cta.value.href.startsWith('/'))
  const isWhatsapp = computed(() => /wa\.me|wa\.link|whatsapp/i.test(cta.value?.href ?? ''))
</script>

<template>
  <section
    id="about"
    class="@container relative w-full overflow-hidden bg-brand-surface px-4 py-12 text-brand-ink md:py-16"
  >
    <div class="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 md:gap-10">
      <SectionHeader
        :eyebrow="content.eyebrow"
        :heading="content.heading"
        size="lg"
        class="border-b border-brand-border pb-6 md:pb-8"
      />

      <div class="grid min-w-0 grid-cols-1 gap-6 @4xl:grid-cols-12">
        <Card
          class="flex min-w-0 flex-col gap-6 p-5 md:p-8"
          :class="showPhotoCard ? '@4xl:col-span-7' : '@4xl:col-span-12'"
        >
          <div>
            <p
              v-if="content.role"
              class="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-warm-ink uppercase"
            >
              {{ content.role }}
            </p>
            <p
              v-if="content.tagline"
              class="font-display text-2xl leading-tight font-semibold text-balance text-brand-ink md:text-[1.75rem] md:leading-9"
            >
              {{ content.tagline }}
            </p>
            <p
              class="text-sm leading-6 md:text-base md:leading-7"
              :class="
                content.tagline
                  ? 'mt-3 text-brand-muted'
                  : 'font-display text-xl leading-8 font-semibold text-brand-ink'
              "
            >
              {{ content.intro }}
            </p>
          </div>
          <StatList v-if="content.stats.length" :items="content.stats" />
          <InfoCard v-if="content.howIWork" :title="HOME_COPY.about.howIWorkTitle" dot="warm">
            {{ content.howIWork }}
          </InfoCard>
          <QuoteBlock v-if="content.quote" :label="HOME_COPY.about.principleLabel">
            {{ content.quote }}
          </QuoteBlock>
        </Card>

        <Card v-if="showPhotoCard" class="flex min-w-0 flex-col gap-5 p-5 @4xl:col-span-5 md:p-6">
          <ImageCarousel :images="content.images">
            <template v-if="mainStat" #overlay>
              <span
                class="inline-flex items-center gap-2 rounded-full bg-brand-surface-card/95 px-3 py-1.5 text-xs font-semibold text-brand-ink"
              >
                <span class="size-2 rounded-full bg-brand-warm-ink" aria-hidden="true" />
                {{ mainStat.value }} {{ mainStat.label }}
              </span>
            </template>
          </ImageCarousel>
          <div
            v-if="hasProfile"
            class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
          >
            <p v-if="content.name" class="font-display text-lg leading-tight font-semibold">
              {{ content.name }}
            </p>
            <p
              v-if="place"
              class="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-medium text-brand-muted @lg:text-sm"
            >
              <Icon
                name="mdi:map-marker"
                size="16"
                class="shrink-0 text-brand-blue"
                aria-hidden="true"
              />
              {{ place }}
            </p>
          </div>
          <div v-if="hasBeyondWork" class="flex flex-col gap-4 border-t border-brand-border pt-5">
            <InfoCard v-if="content.beyondWork" :title="HOME_COPY.about.beyondWorkTitle">
              {{ content.beyondWork }}
            </InfoCard>
            <ChipList
              v-if="interests.length"
              :items="interests"
              :label="HOME_COPY.about.beyondWorkTitle"
            />
          </div>
        </Card>
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
          class="flex min-w-0 items-center gap-2 text-sm leading-6 font-medium text-brand-ink md:text-base"
        >
          <span class="size-2.5 shrink-0 rounded-full bg-brand-whatsapp" aria-hidden="true" />
          {{ content.availability }}
        </p>
        <Button
          v-if="cta"
          v-track="isWhatsapp ? 'wa_sobre_mi' : undefined"
          :to="isInternal ? cta.href : undefined"
          :href="isInternal ? undefined : cta.href"
          :as="isInternal ? undefined : 'a'"
          :target="isInternal ? undefined : '_blank'"
          :rel="isInternal ? undefined : 'noopener noreferrer'"
          :icon="isWhatsapp ? 'mdi:whatsapp' : undefined"
          class="w-full whitespace-nowrap @2xl:w-auto"
          :theme="isWhatsapp ? 'whatsapp' : 'primary'"
        >
          {{ cta.label }}
        </Button>
      </Card>
    </div>
  </section>
</template>
