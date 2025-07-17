<script setup lang="ts">
  import { About, Contact, Main, Portfolio, Services, Testimonial } from '~/components/templates'
  import { Hero } from '~/components/atoms'

  import { MAIN_HERO, META } from '~/constants/common'
  import { API } from '~/constants/routes'
  import type { Me, Testimonial as TestimonialType } from '~/types/common'
  import type { PortafolioType } from '~/components/templates/templates'
  import { InfiniteCarousel } from '~/components/molecules'
  import { useRuntimeConfig } from '#imports'
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
  const { logos } = useLogos()
  const loopingLogos = [...logos]

  const fallbackProfile: Me = {
    id: '',
    name: '',
    profession: '',
    jobDescription: ''
  }

  const fallbackTestimonials: TestimonialType[] = []
  const fallbackProjects: PortafolioType[] = []

  async function fetchWithFallback<T>(promise: Promise<T>, fallback: T): Promise<T> {
    try {
      return await promise
    } catch (error) {
      console.error('[Fetch error]:', (error as Error).message)
      return fallback
    }
  }

  const [profile, testimonials, projects] = await Promise.all([
    fetchWithFallback($fetch<Me>(API.ME), fallbackProfile),
    fetchWithFallback($fetch<TestimonialType[]>(API.TESTIMONIALS), fallbackTestimonials),
    fetchWithFallback($fetch<PortafolioType[]>(API.PORTAFOLIO), fallbackProjects)
  ])
</script>

<template>
  <div>
    <Main :me="profile" />
    <!--  <Hero value="¿Qué puedo hacer por ti?" color="blue" class="w-full" /> -->

    <Services />
    <div class="box-border grid min-w-full">
      <InfiniteCarousel :items="loopingLogos" />
    </div>

    <Portfolio title="Portafolio" :projects="projects" />
    <Hero :value="MAIN_HERO" color="gray" />
    <Testimonial :testimonials="testimonials" />
    <About title="Sobre mí" />
    <Contact title="Contáctame" />
  </div>
</template>

<style scoped></style>
