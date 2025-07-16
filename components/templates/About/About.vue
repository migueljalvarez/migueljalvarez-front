<script lang="ts" setup>
  import Title from '~/components/atoms/Title/Title.vue'
  import { COMPLEMETARY_COURSE } from '~/constants/common'

  defineProps<{
    title: string
  }>()
</script>
<template>
  <section
    id="about"
    class="box-border flex flex-col items-center justify-center w-full h-auto px-4 py-8 pt-20 text-lg font-bold text-gray-800 bg-white"
  >
    <Title :text="title" variant="h2" class="pb-8 mb-4 italic text-center text-gray-800" />

    <div
      class="flex flex-col items-center justify-center w-full gap-2 text-gray-800 rounded-lg md:gap-4 lg:p-8"
    >
      <div class="flex flex-col items-start w-full gap-2 md:gap-4 xl:w-4/5 text-wrap">
        <div class="flex flex-col justify-center w-full p-2 lg:w-full lg:flex-row">
          <div class="flex justify-center lg:w-4/6">
            <NuxtImg
              src="about-me.webp"
              alt="Miguel Alvarez"
              width="600"
              height="700"
              sizes="lg:600px sm:300px"
              format="webp"
              loading="lazy"
              class="w-full sm:w-1/2 lg:w-[600px] self-center rounded-lg lg:self-start"
            />
          </div>
          <div class="flex flex-col items-start gap-4 text-justify lg:p-4 lg:w-5/6">
            <span>
              <h3 class="italic font-medium">
                ¡Hola
                <NuxtImg
                  src="waving.webp"
                  alt="👋"
                  class="inline-block mx-1 align-middle rotate-16 translate-y-[-8px] size-8"
                  draggable="false"
                  loading="lazy"
                  format="webp"
                />
                , soy Miguel!
              </h3>
            </span>

            <p class="font-normal">
              Soy
              <strong>Ingeniero de Sistemas</strong>
              y me dedico al desarrollo de software desde hace más de
              <strong>9 años</strong>
              . Me apasiona crear soluciones tecnológicas que ayuden a las personas y empresas a
              alcanzar sus objetivos.
            </p>
            <p class="font-normal text-justify">
              Fui
              <strong>Microsoft Student Partner (MSP)</strong>
              para
              <strong>Microsoft de Venezuela</strong>
              durante mi epoca de estudiante, lo que me permitió aprender, liderar y compartir
              conocimientos con otros estudiantes y profesionales del sector.
            </p>
            <p class="font-normal">
              Cuando no estoy programando, disfruto de la música, el cine, salir a caminar, ver
              videos y tutoriales, siempre estoy en constante aprendizaje.
            </p>
            <Title
              text="Formacion Complementaria"
              variant="h3"
              class="w-full py-2 italic text-center text-gray-800 md:text-center"
            />
            <div
              class="flex flex-col self-center gap-8 p-2 md:flex-row lg:gap-4 lg:justify-around lg:w-full lg:flex-wrap"
            >
              <NuxtImg
                v-for="course in COMPLEMETARY_COURSE"
                :src="course.logo"
                :alt="course.name"
                loading="lazy"
                format="webp"
                width="200"
                class="object-contain w-auto"
                sizes="lg:200px 200px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
