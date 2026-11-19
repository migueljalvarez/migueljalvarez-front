<script lang="ts" setup>
  import type { ImagePlaceholderProps } from '../atom'

  // Imagen de ejemplo de marca: fondo azul marino con los hexágonos del hero, estáticos y sin texto.
  // Llena a su contenedor (que fija la proporción); no reserva tamaño propio. Sin `label` es decorativa.
  defineProps<ImagePlaceholderProps>()
</script>

<template>
  <div
    class="relative size-full overflow-hidden bg-linear-to-br from-brand-surface-contrast via-brand-navy to-brand-mid"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <svg
      class="absolute inset-0 size-full p-[6%]"
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        class="stroke-brand-warm/30"
        stroke-width="1.5"
        points="150,40 450,40 585,300 450,560 150,560 15,300"
      />
      <polygon
        class="stroke-brand-warm/20"
        stroke-width="1.5"
        points="170,95 430,95 545,300 430,505 170,505 55,300"
      />
      <polygon
        class="fill-brand-blue/15 stroke-brand-warm/15"
        stroke-width="1.5"
        points="190,150 410,150 505,300 410,450 190,450 95,300"
      />
    </svg>
  </div>
</template>
