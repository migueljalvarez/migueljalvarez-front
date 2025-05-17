<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  MAIN_DESCRIPTION_PRESENTATION,
  MAIN_SUBTITLE_PRESENTATION,
  MAIN_TITLE_PRESENTATION,
} from "~/constants/common";
const title = ref("");
const subtitle = ref("");
const description = ref("");
const fullTitle = MAIN_TITLE_PRESENTATION;
const fullSubtitle = MAIN_SUBTITLE_PRESENTATION;

const { typeText } = useTypeText(100);
onMounted(() => {
  typeText(fullTitle, title, () => {
    typeText(fullSubtitle, subtitle, () => {
      description.value = MAIN_DESCRIPTION_PRESENTATION;
    });
  });
});
</script>
<template>
  <div class="relative flex justify-between w-full overflow-hidden lg:w-8xl">
    <div
      class="absolute w-full inset-0 z-10 bg-gradient-to-r from-black via-black/95.5 to-transparent h-[500px]"
    ></div>
    <div
      class="relative z-20 flex flex-col w-full px-10 lg:px-24 text-white h-[500px] justify-center 2xl:ml-20"
    >
      <h1 class="justify-start font-bold text-white">
        {{ title }}
      </h1>
      <h2 v-if="title === fullTitle" class="justify-start text-blue-400">
        {{ subtitle }}
      </h2>
      <p v-if="subtitle === fullSubtitle" class="w-3/5 text-gray-400">
        {{ description }}
      </p>
      <div v-if="subtitle === fullSubtitle" class="flex flex-row gap-2 mt-4">
        <span
          class="p-2 font-bold text-center text-white uppercase bg-green-600 rounded cursor-pointer w-36 hover:bg-green-800"
        >
          Contactar
        </span>
        <span
          class="p-2 font-bold text-center text-white uppercase bg-blue-400 rounded cursor-pointer w-36 hover:bg-blue-500"
        >
          Descargar CV
        </span>
      </div>
    </div>
    <div class="relative z-0 w-full overflow-hidden h-[500px]">
      <img
        src="../../assets/images/bg.jpg"
        alt="Ponente"
        class="object-cover w-full h-full overflow-hidden"
      />
    </div>
  </div>
</template>

<style></style>
