<script setup lang="ts">
  import {
    About,
    HowWorkTeaser,
    Main,
    PortfolioSection,
    ProcessSection,
    Services
  } from '~/components/templates'

  import { META, WORK_ITEMS } from '~/constants/common'
  import { HOME_PORTFOLIO_PROJECTS } from '~/constants/portfolio'

  import { useRuntimeConfig } from '#imports'
  import { Section } from '~/components/organisms'
  import { Button } from '~/components/atoms'
  const aboutImage = 'og-image.jpg'
  definePageMeta({ layout: 'default', keepalive: true })
  const runtime = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  const origin = nuxtApp.payload.serverRendered
    ? typeof window !== 'undefined'
      ? window.location.origin
      : runtime.public.baseUrl
    : runtime.public.baseUrl
  useSeoMeta({
    title: META.TITLE,
    description: META.DESCRIPTION,
    ogTitle: META.TITLE,
    ogDescription: META.DESCRIPTION,
    ogImage: `${origin}/${aboutImage}`,
    ogImageAlt: 'Imagen destacada de Miguel Alvarez',
    ogType: 'website',
    ogUrl: origin,
    twitterCard: 'summary_large_image',
    twitterTitle: META.TITLE,
    twitterDescription: META.DESCRIPTION,
    twitterImage: `${origin}/${aboutImage}`
  })
  const profile = {
    id: 'local-profile',
    name: 'Miguel',
    profession: 'Desarrollador backend/full-stack independiente',
    jobDescription: ''
  }
  const featuredPortfolioProjects = HOME_PORTFOLIO_PROJECTS.slice(0, 4)
</script>

<template>
  <div>
    <Main :me="profile" />

    <Section id="before-work" class="gap-4 px-4 py-12 md:py-16">
      <div class="w-full max-w-7xl mx-auto">
        <div
          class="rounded-2xl border border-brand-border bg-brand-surface-card p-6 shadow-[0_10px_24px_var(--color-brand-shadow-card)] md:p-8"
        >
          <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div class="flex flex-col gap-4">
              <h5 class="text-brand-blue font-semibold text-sm tracking-[0.08em] uppercase">
                Antes de construir
              </h5>

              <h2 class="text-2xl font-semibold text-brand-ink md:text-3xl">
                La tecnología es importante. Entender el problema, todavía más.
              </h2>

              <p class="text-brand-muted text-base leading-7">
                Mi trabajo no empieza escogiendo un framework. Empieza entendiendo qué quieres
                lograr, qué tienes hoy, y qué es realmente
                <span class="text-accent">viable con tu presupuesto y tus tiempos</span>
                — no todo lo que suena bien técnicamente es lo correcto para tu negocio.
              </p>

              <NuxtLink to="#contact" class="w-fit">
                <Button size="lg" theme="primary">Hablemos de tu caso</Button>
              </NuxtLink>
            </div>

            <div class="rounded-2xl border border-brand-border bg-brand-surface-soft p-5">
              <ol
                class="custom-list grid grid-cols-1 gap-3 text-sm text-brand-muted sm:grid-cols-2"
              >
                <li
                  v-for="(item, index) in WORK_ITEMS"
                  :key="index"
                  class="custom-list-item rounded-xl bg-brand-surface-card px-3 py-3 shadow-sm"
                >
                  {{ item.step }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Section>
    <Services />
    <ProcessSection />
    <HowWorkTeaser />
    <Section id="portfolio-background" class="gap-4 bg-brand-surface px-4 py-12 md:py-16">
      <div class="mx-auto w-full max-w-7xl">
        <PortfolioSection title="Portafolio" :projects="featuredPortfolioProjects" />
      </div>
    </Section>
    <About title="Sobre mí" />
  </div>
</template>

<style scoped>
  .custom-list {
    counter-reset: step-counter; /* Inicializa el contador */
  }

  .custom-list-item {
    counter-increment: step-counter; /* Incrementa en cada elemento */
    position: relative;
  }

  /* El truco 'decimal-leading-zero' fuerza el formato 01, 02, 03... */
  .custom-list-item::before {
    content: counter(step-counter, decimal-leading-zero) '. ';
    font-weight: 700;
    color: var(--color-brand-blue);
    margin-right: 0.5rem;
  }
</style>
