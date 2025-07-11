<script lang="ts" setup>
  import Title from '~/components/atoms/Title/Title.vue'

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
      <div class="flex flex-col items-start w-full gap-2 md:gap-4 xl:w-4/6 text-wrap">
        <div class="flex flex-col justify-center w-full p-2 lg:w-full lg:flex-row">
          <div class="flex justify-center lg:w-4/6">
            <NuxtImg
              src="about-me.png"
              alt="Miguel Alvarez"
              class="self-center rounded-lg lg:self-start"
              width="500"
              loading="lazy"
            />
          </div>
          <div class="flex flex-col items-start gap-4 text-justify lg:p-4 lg:w-5/6">
            <Title
              text="¡Hola 👋, soy Miguel!"
              variant="h3"
              class="self-start p-2 mb-4 font-bold text-gray-800"
            />
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
            <Title text="Formacion Complementaria" variant="h3" class="py-2 italic text-gray-800" />
            <div
              class="flex flex-col self-center gap-8 p-2 md:flex-row lg:gap-4 lg:justify-around lg:w-full lg:flex-wrap"
            >
              <NuxtImg src="academia-geek.jpeg" alt="Estudios" width="150" loading="lazy" />
              <NuxtImg src="FreeCodeCamp.svg" alt="Estudios" width="150" loading="lazy" />
              <NuxtImg src="Platzi.svg" alt="Estudios" width="150" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
