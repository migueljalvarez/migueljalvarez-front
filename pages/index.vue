<script setup lang="ts">
  import { About, Main, PortfolioSection, ProcessSection, Services } from '~/components/templates'

  import { META } from '~/constants/common'
  import { HOME_PORTFOLIO_PROJECTS } from '~/constants/portfolio'

  import { useRuntimeConfig } from '#imports'
  import { Section } from '~/components/organisms'
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
    ogImageAlt: 'Imagen destacada de Miguel Álvarez',
    ogType: 'website',
    ogUrl: origin,
    twitterCard: 'summary_large_image',
    twitterTitle: META.TITLE,
    twitterDescription: META.DESCRIPTION,
    twitterImage: `${origin}/${aboutImage}`
  })
  useHead({
    titleTemplate: titleChunk =>
      titleChunk
        ? `${titleChunk} | Desarrollo de Software y Soluciones Digitales`
        : 'Desarrollo de Software y Soluciones Digitales'
  })
  const featuredPortfolioProjects = HOME_PORTFOLIO_PROJECTS.slice(0, 4)
</script>

<template>
  <div>
    <Main />

    <Services />
    <ProcessSection />
    <Section id="portfolio-background" class="gap-4 bg-brand-surface px-4 py-12 md:py-16">
      <div class="mx-auto w-full max-w-7xl">
        <PortfolioSection title="Portafolio" :projects="featuredPortfolioProjects" />
      </div>
    </Section>
    <About title="Sobre mí" />
  </div>
</template>
