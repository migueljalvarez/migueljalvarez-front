<script lang="ts" setup>
  import type { ImageCollageProps } from '../molecule'

  // Collage estático (sin JS ni carrusel) de 1 a 3 imágenes. En pantallas estrechas cada recuadro reserva
  // su proporción con `aspect-ratio` (nada salta al cargar). Desde `@4xl` el collage rellena el alto de la
  // columna (la foto queda a la altura del texto, con un tope) y los recuadros reparten ese alto. La imagen
  // se pide solo por ancho (sin recorte del servidor) y `object-cover` + `object-position` la encuadra
  // priorizando la parte alta, donde suele estar el rostro. Las variantes `@…` responden al ancho del
  // contenedor (la sección), no al de la ventana.
  const props = defineProps<ImageCollageProps>()

  const BIG = { width: 960, sizes: '100vw lg:512px' }
  const SMALL = { width: 480, sizes: '50vw lg:256px' }

  const shown = computed(() => props.images.slice(0, 3))

  const layout = computed(() => {
    const count = shown.value.length
    if (count === 1) return 'grid-cols-1 @4xl:grid-rows-1'
    if (count === 2) return 'grid-cols-2 @4xl:grid-rows-1'
    return 'grid-cols-2 @4xl:grid-rows-[2fr_1fr]'
  })

  const tiles = computed(() => {
    const count = shown.value.length
    return shown.value.map((image, index) => {
      if (count === 1) {
        return { ...image, ...BIG, tile: 'aspect-4/3 @2xl:aspect-video @4xl:aspect-auto' }
      }
      if (count === 2) {
        return { ...image, ...SMALL, tile: 'aspect-4/5 @2xl:aspect-square @4xl:aspect-auto' }
      }
      return index === 0
        ? { ...image, ...BIG, tile: 'col-span-2 aspect-4/3 @2xl:aspect-2/1 @4xl:aspect-auto' }
        : { ...image, ...SMALL, tile: 'aspect-4/3 @2xl:aspect-3/2 @4xl:aspect-auto' }
    })
  })
</script>

<template>
  <div class="grid gap-4 @4xl:h-full @4xl:max-h-160 @4xl:min-h-80" :class="layout">
    <figure
      v-for="item in tiles"
      :key="item.src"
      class="relative m-0 min-h-0 overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-soft"
      :class="item.tile"
    >
      <NuxtImg
        :src="item.src"
        :alt="item.alt"
        :width="item.width"
        :sizes="item.sizes"
        format="webp"
        loading="lazy"
        class="absolute inset-0 size-full object-cover object-[50%_30%]"
      />
    </figure>
  </div>
</template>
