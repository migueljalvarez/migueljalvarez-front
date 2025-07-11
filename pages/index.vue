<script setup lang="ts">
  import { About, Contact, Main, Portfolio, Services, Testimonial } from '~/components/templates/'
  import { Hero } from '~/components/atoms/'

  import { MAIN_HERO } from '~/constants/common'
  import { API } from '~/constants/routes'
  import type { Me, Testimonial as TestimonialType } from '~/types/common'
  import type { PortafolioType } from '~/components/templates/templates'
  import { InfiniteCarousel } from '~/components/molecules'

  definePageMeta({ layout: 'default', keepalive: true })

  const { logos } = useLogos()

  const loopingLogos = [...logos]
  const [profileData, testimonialsData, projectsData] = await Promise.all([
    $fetch<Me>(API.ME),
    $fetch<TestimonialType[]>(API.TESTIMONIALS),
    $fetch<PortafolioType[]>(API.PORTAFOLIO)
  ])

  const profile = profileData ?? {
    id: '',
    name: '',
    profession: '',
    jobDescription: ''
  }

  const testimonials = testimonialsData ?? []
  const projects = projectsData ?? []
</script>
<template>
  <div class="box-border">
    <Main :me="profile" />
    <Hero value="¿Que puedo hacer por ti?" color="blue" class="w-full" />

    <Services />
    <div class="box-border grid min-w-full">
      <InfiniteCarousel :items="loopingLogos" />
    </div>

    <Portfolio title="Portafolio" :projects="projects || []" />
    <Hero :value="MAIN_HERO" color="gray" />
    <Testimonial :testimonials="testimonials" />
    <About title="Sobre mí" />
    <Contact title="Contactame" />
  </div>
</template>
<style scoped></style>
