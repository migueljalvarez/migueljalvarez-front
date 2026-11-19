<script lang="ts" setup>
  import { computed } from 'vue'
  import Button from '~/components/atoms/Button/Button.vue'
  import { CheckList } from '~/components/molecules'
  import {
    ABOUT_FALLBACK,
    HOME_COPY,
    HOME_HERO_COPY,
    PRIMARY_CTA_LABEL,
    WHATSAPP_URL
  } from '~/constants/common'
  import type { AboutContent } from '~/types/about'

  /** Misma fuente que "Sobre mí": la primera cifra y la ubicación salen de `content`. */
  const props = withDefaults(defineProps<{ content?: AboutContent }>(), {
    content: () => ABOUT_FALLBACK
  })

  const proofLine = computed(() => {
    const [firstStat] = props.content.stats
    return [firstStat && `${firstStat.value} ${firstStat.label}`, props.content.location]
      .filter(Boolean)
      .join(' · ')
  })
</script>

<template>
  <section
    class="hero-section relative -mt-20 flex min-h-170 w-full items-center overflow-hidden px-4 pt-24 pb-16 text-brand-text-strong sm:px-6 sm:pt-28 md:min-h-180 md:pb-20 lg:px-8"
  >
    <svg
      class="hero-hexagons pointer-events-none absolute right-[-18%] top-1/2 z-0 w-[78vw] max-w-190 -translate-y-1/2 sm:right-[-8%] md:right-[2%] md:w-[54vw]"
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        class="hero-hexagon hero-hexagon-outer"
        points="150,40 450,40 585,300 450,560 150,560 15,300"
        pathLength="1000"
      />
      <polygon
        class="hero-hexagon hero-hexagon-middle"
        points="170,95 430,95 545,300 430,505 170,505 55,300"
        pathLength="1000"
      />
      <polygon
        class="hero-hexagon hero-hexagon-inner"
        points="190,150 410,150 505,300 410,450 190,450 95,300"
        pathLength="1000"
      />
    </svg>

    <div class="relative z-10 mx-auto flex w-full max-w-7xl">
      <div class="flex w-full max-w-160 flex-col items-start gap-5 text-brand-text-strong">
        <p
          class="inline-flex w-fit items-center gap-2 rounded-2xl border border-brand-border-strong bg-brand-surface-contrast/90 px-4 py-2 text-xs font-semibold sm:rounded-full text-brand-text-soft"
        >
          <span class="size-2.5 rounded-full bg-brand-whatsapp" aria-hidden="true" />
          {{ HOME_COPY.hero.availability }}
        </p>

        <h1
          class="max-w-full text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.05em] text-brand-text-strong"
        >
          <span class="block break-words">{{ HOME_HERO_COPY.title }}</span>
        </h1>

        <p class="max-w-[58ch] text-base font-normal leading-7 text-brand-text-strong">
          {{ HOME_HERO_COPY.description }}
        </p>

        <div
          class="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
        >
          <Button
            as="a"
            :href="WHATSAPP_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full whitespace-nowrap sm:w-auto"
            on-dark
            size="md"
            icon="mdi:whatsapp"
            icon-position="left"
            theme="primary"
          >
            {{ PRIMARY_CTA_LABEL }}
          </Button>

          <Button
            to="/como-trabajo"
            class="w-full whitespace-nowrap sm:w-auto"
            on-dark
            size="md"
            theme="secondary"
          >
            {{ HOME_COPY.work.cta }}
          </Button>
        </div>

        <CheckList :items="HOME_COPY.contact.benefits" tone="dark" inline />

        <div class="flex w-full items-center gap-4 border-t border-brand-text-soft/30 pt-4 sm:pt-5">
          <NuxtImg
            src="ma.webp"
            alt="Miguel Álvarez"
            width="56"
            height="56"
            format="webp"
            loading="lazy"
            class="size-14 shrink-0 rounded-full border border-brand-text-soft/40 object-cover object-center"
          />
          <div class="min-w-0">
            <p class="text-sm font-semibold leading-6 text-brand-text-strong">
              Miguel Álvarez, ingeniero de sistemas
            </p>
            <p v-if="proofLine" class="text-sm leading-6 text-brand-text-soft">
              {{ proofLine }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .hero-section {
    background-color: var(--color-brand-surface-contrast);
    background-image: linear-gradient(
      90deg,
      color-mix(in srgb, var(--color-brand-surface-contrast) 94%, transparent) 0%,
      color-mix(in srgb, var(--color-brand-surface-contrast) 80%, transparent) 43%,
      color-mix(in srgb, var(--color-brand-surface-contrast) 25%, transparent) 100%
    );
  }

  .hero-hexagon {
    fill: none;
    stroke: var(--color-brand-warm);
    stroke-width: 1.5;
    opacity: 0.2;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw-hexagon 1.8s ease-out forwards;
  }

  .hero-hexagon-middle {
    opacity: 0.14;
    animation-delay: 180ms;
  }

  .hero-hexagon-inner {
    fill: var(--color-brand-blue);
    fill-opacity: 0.035;
    opacity: 0.12;
    animation-delay: 360ms;
  }

  @keyframes draw-hexagon {
    to {
      stroke-dashoffset: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-hexagon {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
</style>
