<script setup lang="ts">
  import { About, Contact, Main, Portfolio } from '~/components/templates/'
  import { Hero, Title } from '~/components/atoms/'

  import Section from '~/components/Section/Section.vue'
  import Testimonial from '~/components/Testimonial/Testimonial.vue'

  import { MAIN_HERO, SERVICES } from '~/constants/common'
  import { API } from '~/constants/routes'
  import type { Me, Testimonial as TestimonialType } from '~/types/common'
  import type { PortafolioType } from '~/components/templates/templates'

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
    <Section id="services" title="Servicios" background="bg-white" class="gap-4">
      <div class="grid w-full grid-cols-1 gap-8 p-8 rounded-lg lg:grid-cols-3">
        <div
          v-for="service in SERVICES"
          :key="service.title"
          class="flex flex-col items-center gap-4"
        >
          <div class="flex flex-row items-center justify-center w-full gap-2 text-blue-400">
            <Icon :name="service.icon" size="40" />
            <Title :text="service.title" variant="h4" class="italic text-center" />
          </div>

          <div v-for="(item, index) in service.items" :key="index" class="w-3/5 mx-auto">
            <ul class="space-y-2 font-light text-gray-700 list-none">
              <li
                v-if="item"
                class="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-green-500 before:font-bold"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>

    <div class="box-border grid min-w-full">
      <InfiniteCarousel :items="loopingLogos" />
    </div>
    <Testimonial title="Ellos Confian en Mi" :items="testimonials" />
    <Portfolio title="Portafolio" :projects="projects || []" />
    <Hero :value="MAIN_HERO" color="gray" />

    <About title="Sobre mí" />
    <Contact title="Contactame" />
  </div>
</template>
<style scoped></style>
