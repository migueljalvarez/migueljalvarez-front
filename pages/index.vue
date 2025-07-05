<script setup lang="ts">
  import About from '~/components/About/About.vue'
  import Contact from '~/components/Contact/Contact.vue'
  import Testimonial from '~/components/Testimonial/Testimonial.vue'
  import Title from '~/components/Title/Title.vue'
  import { MAIN_HERO } from '~/constants/common'
  import { API } from '~/constants/routes'
  import type { PortafolioType, Testimonial as TestimonialType } from '~/types/common'

  definePageMeta({ layout: 'default', keepalive: true })

  const { logos } = useLogos()

  const loopingLogos = [...logos]

  const { data: testimonialResult, error: testimonialError } = await useFetch<TestimonialType[]>(
    API.TESTIMONIALS,
    {
      server: true,
      default: () => []
    }
  )

  if (!testimonialResult.value) {
    console.error('Error fetching testimonials:', testimonialError.value)
  }

  const { data: projects, error: portafolioError } = await useAsyncData<PortafolioType[]>(
    'projects',
    () => $fetch<PortafolioType[]>(API.PORTAFOLIO)
  )

  if (portafolioError.value) {
    console.error('Error fetching portafolio:', portafolioError.value)
  }
</script>
<template>
  <div class="box-border">
    <Main />
    <Hero value="¿Que puedo hacer por ti?" color="blue" class="w-full" />
    <section
      id="services"
      class="flex flex-col items-center justify-center w-full h-auto px-4 py-8 pt-20 text-lg font-bold text-gray-800 bg-white"
    >
      <Title text="Servicios" variant="h2" class="pb-8 mb-4 italic text-center text-gray-800" />
      <div
        class="grid grid-cols-1 gap-8 p-8 rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      ></div>
    </section>
    <div v-if="false" class="box-border grid min-w-full">
      <InfiniteCarousel :items="loopingLogos" />
    </div>
    <Testimonial title="Ellos Confian en Mi" :items="testimonialResult || []" />
    <Portfolio title="Portafolio" :projects="projects || []" class="bg-blue-300" />
    <Hero :value="MAIN_HERO" color="gray" />

    <About title="Sobre mí" />
    <Contact title="Contactame" />
  </div>
</template>
<style scoped></style>
