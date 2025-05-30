<script lang="ts" setup>
  import type { TableRowType } from '@components/DynamicTable/DynamicTable'
  import type { PortafolioType } from '~/types/common'
  definePageMeta({
    layout: 'default'
  })
  const route = useRoute()

  const paramId = route.params.id

  const { data } = await useFetch(`/api/portafolio/${paramId}`)

  const titlesTables = ['Detalles', 'Informacion']
  const { getTechnicalSheet } = useTechnicalSheet()
  const rows = getTechnicalSheet(data.value as PortafolioType) as unknown as TableRowType[]
  const showPreviewImage = ref(false)
  const previewImage = ref('')
  const handleClickImage = (event: MouseEvent) => {
    previewImage.value = (event.target as HTMLImageElement).src
    showPreviewImage.value = true
  }
  const handleClose = () => {
    showPreviewImage.value = false
  }
</script>
<template>
  <section
    class="flex justify-center py-8 bg-[url('../../assets/images/64363.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative"
  >
    <div class="flex-wrap w-3/5 p-8 bg-white border-2 border-gray-300 shadow-lg rounded-xl">
      <div class="flex items-center gap-4 p-4">
        <NuxtImg :src="data?.urlImage" :alt="data?.title" width="160" height="120" format="webp" />
        <div class="flex flex-col justify-center p-4">
          <h1 class="font-bold text-slate-800">{{ data?.title }}</h1>
        </div>
      </div>

      <article class="flex justify-center w-auto p-4 text-gray-500">
        {{ data?.description }}
      </article>

      <h3 class="p-4 font-bold text-slate-900">Ficha Tecnica</h3>

      <DynamicTable :headers="titlesTables" :rows="rows" :column-index="0" />

      <div class="flex flex-col flex-wrap justify-center gap-6 px-4 mt-8 grow">
        <h3>Capturas de pantalla</h3>
        <div class="flex flex-row flex-wrap justify-between gap-4 grow">
          <img
            v-for="(image, index) of data?.images"
            :key="index"
            :src="image.url"
            :alt="image.title"
            class="flex-row object-cover cursor-pointer h-45 w-50 rounded-xl"
            @click="handleClickImage"
          />
        </div>
      </div>
    </div>
    <div v-if="showPreviewImage" class="absolute top-0 z-20 w-full h-full bg-black/90">
      <div class="relative flex justify-center h-full cursor-pointer" @click="handleClose">
        <img
          :src="previewImage"
          alt=""
          srcset=""
          class="w-[800px] cursor-auto h-[600px] rounded-3xl"
        />
      </div>
    </div>
  </section>
</template>

<style></style>
