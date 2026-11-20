<script lang="ts" setup>
  import { computed } from 'vue'
  import Button from '~/components/atoms/Button/Button.vue'
  import { CheckList } from '~/components/molecules'
  import HeroBriefCard from '~/components/organisms/HeroBriefCard/HeroBriefCard.vue'
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
    class="hero-section relative -mt-24 w-full overflow-hidden px-4 pt-28 pb-16 text-brand-text-strong sm:px-6 sm:pt-32 md:pb-20 lg:px-8"
  >
    <span class="hero-dots pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
    <span class="hero-glow pointer-events-none absolute z-0" aria-hidden="true" />

    <div
      class="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-x-14 gap-y-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center"
    >
      <p
        class="hero-rise inline-flex w-fit items-center gap-2 rounded-2xl border border-brand-border-strong bg-brand-surface-contrast/90 px-4 py-2 text-xs font-semibold text-brand-text-soft sm:rounded-full lg:col-start-1"
        style="--hero-delay: 50ms"
      >
        <span
          class="hero-dot relative size-2.5 rounded-full bg-brand-whatsapp"
          aria-hidden="true"
        />
        {{ HOME_COPY.hero.availability }}
      </p>

      <!-- El titular está en el HTML del servidor desde el primer instante: solo cambia el color de dos palabras. -->
      <h1
        class="max-w-full text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.05em] text-brand-text-strong lg:col-start-1"
      >
        <!-- prettier-ignore -->
        <span class="block break-words">{{ HOME_HERO_COPY.title.before }}<span class="hero-code">{{ HOME_HERO_COPY.title.code }}</span>{{ HOME_HERO_COPY.title.middle }}<span class="hero-problem">{{ HOME_HERO_COPY.title.problem }}</span>{{ HOME_HERO_COPY.title.after }}</span>
      </h1>

      <div class="hero-rise max-w-[34rem] lg:col-start-1" style="--hero-delay: 450ms">
        <p class="text-lg leading-7 text-brand-text-strong md:text-xl md:leading-8">
          {{ HOME_HERO_COPY.lead.before }}
          <strong class="font-semibold">{{ HOME_HERO_COPY.lead.strong }}</strong>
          {{ HOME_HERO_COPY.lead.after }}
        </p>
        <p class="mt-3 text-base leading-7 text-brand-text-subtle">
          {{ HOME_HERO_COPY.support.before }}
          <span class="text-brand-text-soft">{{ HOME_HERO_COPY.support.strong }}</span>
          {{ HOME_HERO_COPY.support.after }}
        </p>
      </div>

      <div
        class="hero-rise flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 lg:col-start-1"
        style="--hero-delay: 600ms"
      >
        <Button
          v-track="'wa_hero'"
          as="a"
          :href="WHATSAPP_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full whitespace-nowrap sm:w-auto"
          :on-dark="true"
          size="md"
          icon="mdi:whatsapp"
          icon-position="left"
          theme="whatsapp"
        >
          {{ PRIMARY_CTA_LABEL }}
        </Button>

        <Button
          v-track="'cta_ver_como_trabajo'"
          to="/como-trabajo"
          class="w-full whitespace-nowrap sm:w-auto"
          :on-dark="true"
          size="md"
          theme="secondary"
        >
          {{ HOME_COPY.work.cta }}
        </Button>
      </div>

      <!-- Tarjeta: debajo de los botones en móvil; a la derecha, centrada en vertical, desde lg. -->
      <div
        class="hero-rise relative mt-4 w-full max-w-[32rem] lg:col-start-2 lg:row-span-6 lg:row-start-1 lg:mt-0 lg:max-w-none"
        style="--hero-delay: 500ms"
      >
        <HeroBriefCard />
      </div>

      <div class="hero-rise mt-1 lg:col-start-1" style="--hero-delay: 750ms">
        <CheckList :items="HOME_COPY.contact.benefits" tone="dark" inline />
      </div>

      <div
        class="hero-rise flex w-full max-w-[34rem] items-center gap-4 border-t border-brand-text-soft/30 pt-4 sm:pt-5 lg:col-start-1"
        style="--hero-delay: 900ms"
      >
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
  </section>
</template>

<style scoped>
  .hero-section {
    background-color: var(--color-brand-surface-contrast);
  }

  /* Trama de puntos muy tenue, más visible hacia la derecha. */
  .hero-dots {
    background-image: radial-gradient(
      color-mix(in srgb, var(--color-brand-text-soft) 16%, transparent) 1px,
      transparent 1px
    );
    background-size: 26px 26px;
    opacity: 0.5;
    mask-image: linear-gradient(90deg, transparent 0%, black 55%, black 100%);
  }

  /* Resplandor azul suave detrás de la tarjeta. */
  .hero-glow {
    top: 50%;
    right: -10%;
    width: min(56rem, 120vw);
    aspect-ratio: 16 / 9;
    transform: translateY(-50%);
    background: radial-gradient(
      closest-side,
      color-mix(in srgb, var(--color-brand-blue) 34%, transparent),
      transparent 70%
    );
  }

  /* Entrada escalonada (solo opacity y transform). El h1 no entra animado: debe estar visible al instante. */
  .hero-rise {
    animation: hero-rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) var(--hero-delay, 0ms) both;
  }

  .hero-code {
    animation: hero-code 0.8s ease 0.95s both;
  }

  .hero-problem {
    animation: hero-problem 0.6s ease 1.05s both;
  }

  .hero-dot::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 9999px;
    border: 1px solid var(--color-brand-whatsapp);
    animation: hero-ping 2.4s ease-out infinite;
  }

  @keyframes hero-rise {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
  }

  @keyframes hero-code {
    from {
      color: var(--color-brand-text-strong);
    }
    to {
      color: var(--color-brand-text-dim);
    }
  }

  @keyframes hero-problem {
    from {
      color: var(--color-brand-text-strong);
    }
    to {
      color: var(--color-brand-warm);
    }
  }

  @keyframes hero-ping {
    0% {
      transform: scale(0.6);
      opacity: 0.9;
    }
    100% {
      transform: scale(1.7);
      opacity: 0;
    }
  }

  /* Sin la animación el color final ya es el definitivo. */
  .hero-code {
    color: var(--color-brand-text-dim);
  }

  .hero-problem {
    color: var(--color-brand-warm);
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-rise,
    .hero-code,
    .hero-problem,
    .hero-dot::after {
      animation: none;
    }
  }
</style>
