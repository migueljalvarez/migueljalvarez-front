<script lang="ts" setup>
  import type { QuoteBlockProps } from '../molecule'

  // Recuadro de cita: fondo tenue, borde sutil y etiqueta ámbar (`brand-warm-ink` sobre claro).
  defineProps<QuoteBlockProps>()
</script>

<template>
  <figure class="m-0 rounded-xl border border-brand-border bg-brand-surface p-4 @lg:p-5">
    <figcaption
      v-if="label"
      class="mb-2 text-xs font-semibold tracking-[0.14em] text-brand-warm-ink uppercase"
    >
      {{ label }}
    </figcaption>
    <blockquote class="m-0 text-sm leading-6 text-brand-ink italic @lg:text-base @lg:leading-7">
      <slot />
    </blockquote>
  </figure>
</template>
