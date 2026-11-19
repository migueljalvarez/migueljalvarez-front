<script lang="ts" setup>
  import type { AppLogoProps } from '../atom'

  // Logo de la marca. Elige la variante según el FONDO donde se coloca, no según la sección:
  //   surface="light" → logo a color (fondos claros)
  //   surface="dark"  → logo blanco (fondos oscuros, y sobre foto o degradado SIEMPRE con capa oscura debajo)
  // variant="full" lleva el tagline "Desarrollo de Software"; "compact" es solo hexágono + nombre.
  // Espacio libre mínimo alrededor del logo: la altura del hexágono (en "compact" coincide con la altura del
  // logo). Los SVG se sirven directos (<img>): ipx los rasterizaba a webp.
  const props = withDefaults(defineProps<AppLogoProps>(), {
    surface: 'light',
    variant: 'compact',
    height: 40,
    alt: 'Miguel Álvarez',
    decorative: false
  })

  const SOURCES = {
    full: { light: '/brand.svg', dark: '/brand_white_v2.svg' },
    compact: { light: '/brand-compact.svg', dark: '/brand-compact-white.svg' }
  } as const
  // Proporción (ancho / alto) del viewBox de cada SVG.
  const RATIOS = { full: 560.79 / 94.33, compact: 554.6 / 90.4 } as const

  const src = computed(() => SOURCES[props.variant][props.surface])
  const width = computed(() => Math.round(props.height * RATIOS[props.variant]))
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
