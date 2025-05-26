<script setup lang="ts">
import type { PortafolioType } from "~/common/types";
import { MAIN_HERO } from "~/constants/common";
definePageMeta({
  layout: "default",
});

const { logos } = useLogos();

const duplicatedLogos = [...logos, ...logos];

const { data: portafolioResult } = await useFetch(`/api/portafolio`);
const portafolio = ref<PortafolioType[]>();
portafolio.value = portafolioResult.value as PortafolioType[];
</script>
<template>
  <section class="">
    <Main />
    <Hero :value="MAIN_HERO" color="gray" />
    <!--  -->
    <Testimonial/>
    <!--  -->
    <InfiniteCarousel :items="duplicatedLogos" class="w-full lg:w-8xl" />

    <section
      class="flex flex-col items-center justify-center w-full p-4 bg-black/95 lg:w-8xl h-150"
    >
      <h3 class="self-center py-8 italic text-white">Portafolio</h3>
      <Card v-for="(item, index) in portafolio" :key="index" size="md">
        <div class="flex gap-4">
          <img :src="item.urlImage" :alt="item.title" class="w-40 h-30" />
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
        <div class="flex justify-end gap-2">
          <NuxtLink :to="`/portafolio/${item.id}`">
            <Button icon="mdi:file-search-outline">Detalles</Button>
          </NuxtLink>
        </div>
      </Card>
    </section>
  </section>
</template>
<style scoped></style>
