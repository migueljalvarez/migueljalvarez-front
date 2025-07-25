<script lang="ts" setup>
  import type { TableRowType } from '@components/DynamicTable/DynamicTable'
  import { NuxtImg } from '#components'
  import type { PortafolioType } from '~/types/common'
  import { Title } from '~/components/atoms'
  definePageMeta({
    layout: 'default',
    keepalive: true,
    title: 'Portafolio'
  })
  const route = useRoute()

  const titlesTables = ['Detalles', 'Informacion']
  const { getTechnicalSheet } = useTechnicalSheet()
  const cleanNotApply = (rows: TableRowType[]): TableRowType[] => {
    return rows.filter(row => !row.includes('N/A'))
  }
  const rows = ref()
  const porfolioDetails = ref()
  const showPreviewImage = ref(false)
  const previewImage = ref('')
  const handleClickImage = (event: MouseEvent) => {
    previewImage.value = (event.target as HTMLImageElement).src
    showPreviewImage.value = true
  }
  const handleClose = () => {
    showPreviewImage.value = false
  }

  const paramId = route.params.id
  const { data } = await useFetch(`/api/portafolio/${paramId}`)
  if (data) {
    porfolioDetails.value = data.value
    const technicalSheet = getTechnicalSheet(
      data.value as PortafolioType
    ) as unknown as TableRowType[]
    if (technicalSheet) {
      rows.value = cleanNotApply(technicalSheet)
    }
  }

  onUnmounted(() => {
    porfolioDetails.value = null
  })
</script>
<template>
  <section
    class="flex bg-[url('/contact-bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed relative"
  >
    <div
      class="flex justify-center w-full min-h-screen pt-2 shadow-lg md:p-4 lg:p-8 bg-black/60 backdrop-blur-md z-1"
    >
      <div
        class="w-[95%] sm:w-11/12 md:w-full lg:w-full max-w-6xl p-2 sm:p-6 bg-white border-2 border-gray-300 shadow-lg rounded-xl"
      >
        <div>
          <span class="flex items-center gap-2 cursor-pointer hover:text-blue-400 w-min">
            <nuxt-link to="/" aria-label="back">
              <Icon name="mdi:arrow-left" size="30" />
            </nuxt-link>
          </span>

          <div class="p-4">
            <Title text="Portafolio" variant="h1" class="italic text-gray-800" />
            <div class="py-4 pb-4 text-sm text-justify text-gray-500 sm:text-base">
              <p v-if="porfolioDetails?.portfolioType === 'Cliente'">
                Resumen del problema, objetivos y solución técnica implementada. Descubre cómo se
                transformó una necesidad en un proyecto funcional y bien estructurado.
              </p>

              <p v-if="porfolioDetails?.portfolioType === 'Practica'">
                Práctica desarrollada para aplicar y consolidar conocimientos adquiridos en
                distintas tecnologías como parte del proceso de aprendizaje.
              </p>
            </div>
          </div>
        </div>
        <!-- Header -->
        <div class="flex flex-col items-center gap-4 p-4 sm:flex-row">
          <NuxtImg
            :src="porfolioDetails?.urlImage"
            :alt="porfolioDetails?.title"
            format="webp"
            width="300"
            height="250"
            class="rounded-lg"
            :preload="true"
          />
          <div
            v-if="porfolioDetails?.title"
            class="flex flex-col justify-center text-center sm:text-left"
          >
            <Title :text="porfolioDetails.title" variant="h2" class="italic text-gray-800" />
          </div>
        </div>

        <!-- Descripción -->
        <article
          v-if="!porfolioDetails?.description || porfolioDetails?.description !== 'N/A'"
          class="px-4 pb-4 text-sm text-justify text-gray-500 sm:text-base"
        >
          {{ porfolioDetails?.description }}
        </article>

        <!-- Ficha técnica -->
        <Title text="Ficha Tecnica" variant="h3" class="p-6 italic text-gray-800" />
        <DynamicTable :headers="titlesTables" :rows="rows" :column-index="0" />

        <!-- Capturas de pantalla -->
        <div
          v-if="porfolioDetails?.images && porfolioDetails?.images.length > 0"
          class="flex flex-col gap-4 px-4 mt-8"
        >
          <h3 class="text-base font-medium">Capturas de pantalla</h3>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            <NuxtImg
              v-for="(image, index) of porfolioDetails?.images"
              :key="index"
              :src="image.url"
              :alt="image.title"
              class="object-cover w-full transition-transform duration-300 cursor-pointer aspect-video rounded-xl hover:scale-105"
              :preload="true"
              format="webp"
              @click="handleClickImage"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Vista previa de imagen -->
    <div
      v-if="showPreviewImage"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 cursor-pointer bg-black/90"
      @click="handleClose"
    >
      <div class="relative max-w-[90vw] max-h-[80vh]">
        <NuxtImg
          :src="previewImage"
          alt="preview"
          class="w-full h-auto cursor-auto rounded-3xl"
          :preload="true"
          format="webp"
          @click.stop
        />
      </div>
    </div>
  </section>
</template>
