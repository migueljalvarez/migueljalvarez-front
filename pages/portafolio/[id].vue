<script lang="ts" setup>
import type { TableRowType } from "@components/DynamicTable/DynamicTable";
import type { PortafolioType } from "~/types/common";
definePageMeta({
  layout: "default",
});
const route = useRoute();

const paramId = route.params.id;

const { data } = await useFetch(`/api/portafolio/${paramId}`);

const titlesTables = ["Detalles", "Informacion"];
const { getTechnicalSheet } = useTechnicalSheet();
const rows = getTechnicalSheet(
  data.value as PortafolioType
) as unknown as TableRowType[];
</script>
<template>
  <section
    class="flex justify-center py-8 bg-[url('../../assets/images/64363.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative"
  >
    <div
      class="flex-wrap w-3/5 p-8 bg-white border-2 border-gray-300 shadow-lg rounded-xl"
    >
      <div class="flex items-center gap-4 p-4">
        <img :src="data?.urlImage" :alt="data?.title" class="w-40 h-30" />
        <div class="flex flex-col justify-center p-4">
          <h1 class="font-bold text-slate-800">{{ data?.title }}</h1>
        </div>
      </div>

      <article class="flex justify-center w-auto p-4 text-gray-500">
        {{ data?.description }}
      </article>

      <h3 class="p-4 font-bold text-slate-900">Ficha Tecnica</h3>

      <DynamicTable :headers="titlesTables" :rows="rows" :column-index="0" />

      <div  class="flex flex-wrap justify-center gap-8 px-4 grow">
        <img v-for="image, index of data?.images" :key="index" :src="image.url" alt="" srcset="" class="cursor-pointer size-58" />
        
      </div>
    </div>
  </section>
</template>

<style></style>
