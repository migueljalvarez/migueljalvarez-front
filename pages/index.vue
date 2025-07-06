<script setup lang="ts">
  import About from '~/components/About/About.vue'
  import Contact from '~/components/Contact/Contact.vue'
  import Section from '~/components/Section/Section.vue'
  import Testimonial from '~/components/Testimonial/Testimonial.vue'
  import Title from '~/components/Title/Title.vue'
  import { MAIN_HERO } from '~/constants/common'
  import { API } from '~/constants/routes'
  import type { Me, PortafolioType, Testimonial as TestimonialType } from '~/types/common'

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
    <Section id="services" title="Servicios" background="bg-white">
      <div
        class="grid grid-cols-1 gap-8 p-8 rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      ></div>
    </Section>

    <div v-if="false" class="box-border grid min-w-full">
      <InfiniteCarousel :items="loopingLogos" />
    </div>
    <Testimonial title="Ellos Confian en Mi" :items="testimonials" />
    <Portfolio title="Portafolio" :projects="projects || []" class="bg-blue-300" />
    <Hero :value="MAIN_HERO" color="gray" />

    <About title="Sobre mí" />
    <Contact title="Contactame" />
  </div>
</template>
<style scoped></style>
