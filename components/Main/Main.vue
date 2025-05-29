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
  <section class="relative flex justify-between overflow-hidden">
    <div
      class="sm:hidden absolute 2xl:w-full inset-0 z-10 lg:flex 2xl:flex lg:bg-gradient-to-r lg:from-black lg:via-black lg:to-black/10 2xl:bg-gradient-to-r 2xl:from-black 2xl:via-black 2xl:to-black/10 h-[600px]"
    />

    <div
      class="relative z-20 flex flex-col w-4/6 lg:w-full px-8 2xl:px-24 text-white h-[600px] justify-center 2xl:ml-20 grow bg-black flex-wrap lg:bg-transparent"
    >
      <h1 class="justify-start font-bold text-white">
        {{ title }}
      </h1>
      <h2 v-if="title === fullTitle" class="justify-start p-1 text-blue-400">
        {{ subtitle }}
      </h2>
      <p
        v-if="subtitle === fullSubtitle"
        class="p-1 pr-2 text-gray-400 lg:w-4/5 2xl:w-4/5"
      >
        {{ description }}
      </p>
      <div v-if="subtitle === fullSubtitle" class="flex flex-row gap-2 mt-4">
        <Button variant="uppercase" icon="mdi:whatsapp" theme="tertiary"
          >Contactar</Button
        >
        <Button variant="uppercase" icon="mdi:download">Descargar CV</Button>
      </div>
    </div>
    <div
      class="hidden relative z-0 2xl:w-full overflow-hidden h-[600px] ml-25 lg:flex 2xl:flex"
    >
      <NuxtImg
        src="bg.jpg"
        alt="Ponente"
        class="object-cover w-full h-full overflow-hidden mask-linear-at-left mask-l-from-black mask-l-to-transparent mask-l-from-50% mask-l-to-95%"
        format="webp"
        quality="80"
      />
    </div>
  </section>
</template>

<style></style>
