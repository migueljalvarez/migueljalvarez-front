<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { logos } = useLogos();
const { testimonial } = useTestimonial();
const duplicatedLogos = [...logos, ...logos];

const portafolio = [
  {
    title: "AR Stereo",
    description:
      "AR Stereo es una estación de radio digital que se distingue por su propuesta musical innovadora y fresca, respaldada con el sello oficial de Alfredo Rojas. Su programación de estilo Crossover ofrece una fusión de géneros cuidadosamente seleccionados, logrando una experiencia sonora única, balanceada y con calidad digital superior. Es una alternativa moderna a lo convencional, ideal para quienes buscan una radio en línea con personalidad, visión y autenticidad.",
    technologies: ["Nuxtjs", "Vuejs", "Tailwindcss"],
    urlImage: "https://www.arstereo.com/_nuxt/banner.BeTGo23t.png",
    url: "https://www.arstereo.com/",
  },
];
</script>
<template>
  <section class="">
    <Main />
    <section
      class="flex items-center justify-center w-full bg-gray-200 lg:w-8xl"
    >
      <p class="p-10 text-4xl italic">
        Con mas de 9 años de Experiencia en el Sector
      </p>
    </section>
    <!--  -->
    <section
      class="flex flex-col h-auto bg-[url('/assets/images/escritorio-lleno-de-articulos-de-productividad-en-una-casa-vacia.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
    >
      <div
        class="flex flex-col items-center justify-center w-full px-6 shadow-lg lg:w-8xl bg-black/10 backdrop-blur-md"
      >
        <h3 class="self-center py-8 italic text-white">Ellos confian en mi</h3>

        <div class="flex items-center justify-center w-full h-120">
          <TestimonialCarousel :slides="testimonial" />
        </div>
      </div>
    </section>
    <!--  -->
    <InfiniteCarousel :items="duplicatedLogos" class="w-full lg:w-8xl" />

    <section
      class="flex flex-col items-center justify-center w-full p-4 bg-black/95 lg:w-8xl h-150"
    >
      <h3 class="self-center py-8 italic text-white">Portafolio</h3>
      <Card  v-for="(item, index) in portafolio" :key="index" size="md" >
      
      <div class="flex gap-4">
          <img :src="item.urlImage" alt="" class="w-40 h-30" />
          <div>
            <h4 class="font-bold text-slate-800">{{ item.title }}</h4>

            <div class="flex flex-row gap-2 pt-2 pr-2">
              <span
                v-for="(tech, i) in item.technologies"
                :key="i"
                class="flex flex-row"
                ><Badge theme="info" :value="tech"
              /></span>
            </div>
            <p class="h-40 mt-2 text-gray-800">{{ item.description }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-2 ">

          <Button icon="mdi:file-search-outline"  >Detalles</Button>
        </div>
      </Card>
<!--       <div
        v-for="(item, index) in portafolio"
        :key="index"
        class="flex flex-col gap-8 p-8 bg-white border-2 border-transparent shadow-lg rounded-xl w-200"
      >
        <div class="flex gap-4">
          <img :src="item.urlImage" alt="" class="w-40 h-30" />
          <div>
            <h4 class="font-bold text-slate-800">{{ item.title }}</h4>

            <div class="flex flex-row gap-2 pt-2 pr-2">
              <span
                v-for="(tech, i) in item.technologies"
                :key="i"
                class="flex flex-row"
                ><Banner theme="info" :value="tech"
              /></span>
            </div>
            <p class="h-40 mt-2 text-gray-800">{{ item.description }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-2 ">

          <Button icon="mdi:file-search-outline" >Detalles</Button>
        </div>
      </div> -->
    </section>
  </section>
</template>
<style scoped></style>
