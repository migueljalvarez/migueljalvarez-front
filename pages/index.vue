<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { logos } = useLogos();
const { testimonial } = useTestimonial();
const duplicatedLogos = [...logos, ...logos, ];
</script>
<template>
  <section class="">
    <Main />
    <section class="flex items-center justify-center w-full bg-gray-200 lg:w-8xl">
      <p class="p-10 text-4xl italic">
        Con mas de 9 años de Experiencia en el Sector
      </p>
    </section>
    <!--  -->
    <section
      class="flex h-auto bg-[url('/assets/images/escritorio-lleno-de-articulos-de-productividad-en-una-casa-vacia.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
    >
      <div
        class="flex flex-col items-center justify-center w-full px-6 py-12 shadow-lg lg:w-8xl bg-black/10 backdrop-blur-md"
      >
        <h3 class="self-center py-8 italic text-white">Ellos confian en mi</h3>
        <TestimonialCarousel :slides="testimonial" />
      </div>
    </section>
    <!--  -->
    <section class="flex flex-col items-center w-full">
    <InfiniteCarousel :items="duplicatedLogos" />
    
    </section>

    <section
      class="flex flex-col items-center justify-center w-full p-10 bg-white lg:w-8xl h-96"
    >
      <h3 class="italic">Portafolio</h3>
    </section>
  </section>
</template>
<style scoped></style>
