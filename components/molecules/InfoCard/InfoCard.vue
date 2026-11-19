<script lang="ts" setup>
  import type { InfoCardProps } from '../molecule'

  // Bloque de texto con título, sin contenedor propio: quien lo usa decide si va suelto o dentro de una
  // tarjeta (en "Sobre mí", dos bloques comparten una sola tarjeta con separador).
  withDefaults(defineProps<InfoCardProps>(), { level: 'h3' })
</script>

<template>
  <article class="min-w-0 p-5 md:p-6">
    <component :is="level" class="mb-3 text-lg font-semibold leading-tight text-brand-ink">
      {{ title }}
    </component>
    <p class="text-sm leading-6 text-brand-muted md:text-base md:leading-7">
      <slot />
    </p>
  </article>
</template>
