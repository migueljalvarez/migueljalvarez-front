<script lang="ts" setup>
  import { Section } from '~/components/organisms'
  import { DEVELOPMENT_PHASES } from '~/constants/common'
</script>

<template>
  <Section id="services" class="services-section gap-8 px-4 py-12 text-white md:gap-10 md:py-16">
    <div class="mx-auto w-full max-w-7xl">
      <h5 class="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-sky-400">Servicios</h5>
      <h2 class="max-w-3xl text-2xl font-semibold leading-tight text-white md:text-3xl">
        Un proceso completo, en cada etapa
      </h2>
      <p class="mt-3 max-w-3xl text-sm leading-6 text-white/80 md:text-base md:leading-7">
        Acompaño cada proyecto desde entender el problema hasta poner la solución en marcha y
        mejorarla con el uso real.
      </p>
    </div>

    <ol
      class="service-list mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
    >
      <li v-for="(phase, index) in DEVELOPMENT_PHASES" :key="phase.title" class="min-w-0">
        <article
          class="service-card h-full rounded-2xl border border-white/10 bg-[#071523]/85 p-5 text-white shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-200 hover:border-sky-400/45 hover:bg-[#0a1c2d]/90 md:p-6"
        >
          <div class="mb-5 flex items-center justify-between">
            <span
              class="flex size-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400"
            >
              <Icon :name="phase.icon" size="22" aria-hidden="true" />
            </span>
            <span class="text-xs font-semibold tracking-[0.08em] text-white/50">
              FASE {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>
          <h3 class="mb-2 text-base font-semibold text-white">{{ phase.title }}</h3>
          <p class="text-sm leading-6 text-white/75">{{ phase.description }}</p>
        </article>
      </li>
    </ol>
  </Section>
</template>

<style scoped>
  .services-section {
    background-image:
      linear-gradient(rgba(3, 10, 18, 0.82), rgba(3, 10, 18, 0.86)), url('/testimonial-bg.webp');
    background-position: center;
    background-size: cover;
  }

  @media (prefers-reduced-motion: reduce) {
    .service-card {
      transition: none;
    }
  }
</style>
