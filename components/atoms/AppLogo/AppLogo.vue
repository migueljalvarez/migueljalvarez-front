<script lang="ts" setup>
  import type { AppLogoProps } from '../atom'

  // Logo de la marca. Elige la variante según el FONDO donde se coloca, no según la sección:
  //   surface="light" → logo a color (fondos claros)
  //   surface="dark"  → logo blanco (fondos oscuros, y sobre foto o degradado SIEMPRE con capa oscura debajo)
  // Siempre el logo original de la marca, con su tagline. No se recorta ni se reescribe.
  // Espacio libre mínimo alrededor del logo: la altura del hexágono. Los SVG se sirven directos (<img>):
  // ipx los rasterizaba a webp.
  const props = withDefaults(defineProps<AppLogoProps>(), {
    surface: 'light',
    height: 40,
    alt: 'Miguel Álvarez',
    decorative: false
  })

  const SOURCES = { light: '/brand.svg', dark: '/brand_white_v2.svg' } as const
  // Proporción (ancho / alto) del viewBox del SVG.
  const RATIO = 560.79 / 94.33

  const src = computed(() => SOURCES[props.surface])
  const width = computed(() => Math.round(props.height * RATIO))
</script>

<template>
  <img
    :src="src"
    :width="width"
    :height="height"
    :alt="decorative ? '' : alt"
    :aria-hidden="decorative ? 'true' : undefined"
    decoding="async"
    class="block object-contain"
  />
</template>
