t
<script setup lang="ts">
import type { PortafolioType, Testimonial } from "~/types/common";
import { MAIN_HERO } from "~/constants/common";
import Carousel from "../components/Carousel/Carousel.vue";

import bgTestimonialSection from "../assets/images/escritorio-lleno-de-articulos-de-productividad-en-una-casa-vacia.jpg";
definePageMeta({
  layout: "default",
});

const { logos } = useLogos();

const duplicatedLogos = [...logos];
const currentIndex = ref(0);

const testimonial = ref<Testimonial[]>([]);
const { data: testimonialResult } = await useFetch(`/api/testimonials`);
testimonial.value = testimonialResult.value as Testimonial[];

const { data: portafolioResult } = await useFetch(`/api/portafolio`);
const portafolioCurrentIndex = ref(0);
const portafolio = ref<PortafolioType[]>();
portafolio.value = portafolioResult.value as PortafolioType[];

const touchStartX = ref(0);
</script>
<template>
  <section>
    <Main />
    <Hero :value="MAIN_HERO" color="gray" />
    <!--  -->
    <Carousel
      v-model:current-index="currentIndex"
      title="Ellos confían en mí"
      :background="bgTestimonialSection"
      :items="testimonial"
    >
      <template #default="{ goPrev, goNext }">
        <TestimonialCarousel
          :key="currentIndex"
          :item="testimonial[currentIndex]"
          @touchstart="(e) => (touchStartX = e.changedTouches[0].screenX)"
          @touchend="
            (e) => {
              const diff = e.changedTouches[0].screenX - touchStartX;
              if (Math.abs(diff) > 50) {
                if (diff < 0) goNext();
                else goPrev();
              }
            }
          "
        />
      </template>
    </Carousel>
    <!--  -->
    <div class="box-border grid min-w-full">
      <InfiniteCarousel :items="duplicatedLogos" />
    </div>
    <Carousel
      v-model:portafolio-current-index="portafolioCurrentIndex"
      class="min-h-[700px]"
      title="Portafolio"
      background-color="black"
      :show-arrow="true"
      :items="portafolio as unknown as PortafolioType[]"
    >
      <template #default="{ goPrev, goNext }">
        <div
          :key="portafolioCurrentIndex"
          class="flex items-center justify-center w-full h-full select-none"
          @touchstart="(e) => (touchStartX = e.changedTouches[0].screenX)"
          @touchend="
            (e) => {
              const diff = e.changedTouches[0].screenX - touchStartX;
              if (Math.abs(diff) > 50) {
                if (diff < 0) goNext();
                else goPrev();
              }
            }
          "
        >
          <Card
            v-if="portafolio && portafolio.length"
            size="md"
            class="w-full max-w-sm px-4 h-[600px] 2xl:h-[500px]  lg:min-w-2xl 2xl:min-w-4xl"
          >
            <div class="flex flex-col gap-4">
              <img
                :src="portafolio[portafolioCurrentIndex].urlImage"
                :alt="portafolio[portafolioCurrentIndex].title"
                class="self-center object-cover w-40 h-auto rounded md:w-40"
              />
              <div class="flex-1">
                <h4 class="p-2 font-bold text-slate-800">
                  {{ portafolio[portafolioCurrentIndex].title }}
                </h4>
                <div class="flex flex-wrap gap-2 px-2 pt-2">
                  <span
                    v-for="(tech, i) in portafolio[portafolioCurrentIndex]
                      .technologies"
                    :key="i"
                    class="flex flex-row"
                  >
                    <Badge theme="info" :value="tech" />
                  </span>
                </div>
                <p class="p-2 mt-2 text-sm text-gray-800 lg:text-lg">
                  {{ portafolio[portafolioCurrentIndex].description }}
                </p>
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <NuxtLink
                :to="`/portafolio/${portafolio[portafolioCurrentIndex].id}`"
              >
                <Button icon="mdi:file-search-outline">Detalles</Button>
              </NuxtLink>
            </div>
          </Card>
        </div>
      </template>
    </Carousel>
  </section>
</template>
<style scoped></style>
