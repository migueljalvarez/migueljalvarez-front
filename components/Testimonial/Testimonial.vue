<script lang="ts" setup>
import type { Testimonial } from "~/common/types";
const testimonial = ref<Testimonial[]>([]);
const { data: testimonialResult } = await useFetch(`/api/testimonials`);

testimonial.value = testimonialResult.value as Testimonial[];
</script>
<template>
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
</template>

<style></style>
