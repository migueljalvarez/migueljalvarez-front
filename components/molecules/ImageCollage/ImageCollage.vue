<script lang="ts" setup>
  import type { ImageCollageProps } from '../molecule'

  // Collage estático (sin JS ni carrusel) de 1 a 3 imágenes. Cada recuadro reserva su proporción con
  // `aspect-ratio` para que nada salte al cargar; la imagen lo rellena (object-cover) y el servidor de
  // imágenes la recorta a la medida. Las variantes `@4xl` responden al ancho del contenedor (la sección),
  // no al de la ventana.
  const props = defineProps<ImageCollageProps>()

  const BIG = { width: 800, height: 1000, sizes: '100vw md:448px lg:480px' }
  const ROW = { width: 800, height: 533, sizes: '100vw md:448px lg:480px' }
  const SMALL = { width: 400, height: 400, sizes: '50vw md:224px lg:240px' }

  const shown = computed(() => props.images.slice(0, 3))

  const tiles = computed(() => {
    const count = shown.value.length
    return shown.value.map((image, index) => {
      if (count === 1) return { ...image, ...BIG, tile: 'aspect-4/5' }
      if (count === 2) return { ...image, ...ROW, tile: 'aspect-3/2' }
      return index === 0
        ? { ...image, ...BIG, tile: 'col-span-2 aspect-4/5 @4xl:row-span-2 @4xl:aspect-auto' }
        : { ...image, ...SMALL, tile: 'aspect-square @4xl:aspect-auto' }
    })
  })
</script>

<template>
  <div
    class="grid gap-4"
    :class="
      shown.length === 3
        ? 'grid-cols-2 @4xl:aspect-5/4 @4xl:grid-cols-3 @4xl:grid-rows-2'
        : 'grid-cols-1'
    "
  >
    <figure
      v-for="item in tiles"
      :key="item.src"
      class="relative m-0 overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-soft"
      :class="item.tile"
    >
      <NuxtImg
        :src="item.src"
        :alt="item.alt"
        :width="item.width"
        :height="item.height"
        :sizes="item.sizes"
        format="webp"
        fit="cover"
        loading="lazy"
        class="absolute inset-0 size-full object-cover object-center"
      />
    </figure>
  </div>
</template>
