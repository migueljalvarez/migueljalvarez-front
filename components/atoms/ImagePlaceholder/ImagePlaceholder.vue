<script lang="ts" setup>
  import type { ImagePlaceholderProps } from '../atom'

  // Imagen de ejemplo de marca: fondo azul marino con un resplandor azul suave, el marco de hexágonos del hero y
  // la marca (hexágono del logo) al centro. Estática y sin texto, no simula capturas ni fotos. Llena a su
  // contenedor (que fija la proporción); no reserva tamaño propio. Sin `label` es decorativa.
  defineProps<ImagePlaceholderProps>()
</script>

<template>
  <div
    class="relative size-full overflow-hidden bg-linear-to-br from-brand-surface-contrast via-brand-navy to-brand-mid"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,color-mix(in_srgb,var(--color-brand-blue)_32%,transparent),transparent_58%)]"
      aria-hidden="true"
    />
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
        class="fill-brand-blue/15 stroke-brand-warm/20"
        stroke-width="1.5"
        points="190,150 410,150 505,300 410,450 190,450 95,300"
      />
    </svg>
    <img
      src="/only-brand.svg"
      width="417"
      height="349"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      class="pointer-events-none absolute top-1/2 left-1/2 h-auto w-[30%] -translate-x-1/2 -translate-y-1/2 opacity-90 select-none"
    />
  </div>
</template>
