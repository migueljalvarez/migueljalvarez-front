<script lang="ts" setup>
  import type { QuoteBlockProps } from '../molecule'

  // Recuadro de cita: única excepción de ámbar sobre fondo claro (fondo y borde tenues); la etiqueta va en navy.
  defineProps<QuoteBlockProps>()
</script>

<template>
  <figure class="m-0 rounded-xl border border-brand-warm/50 bg-brand-warm/10 p-4 @lg:p-5">
    <figcaption
      v-if="label"
      class="mb-2 text-xs font-semibold tracking-[0.14em] text-brand-accent-text uppercase"
    >
      {{ label }}
    </figcaption>
    <blockquote class="m-0 text-sm leading-6 text-brand-ink italic @lg:text-base @lg:leading-7">
      <slot />
    </blockquote>
  </figure>
</template>
