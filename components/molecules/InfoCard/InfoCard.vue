<script lang="ts" setup>
  import type { InfoCardProps } from '../molecule'

  // Bloque de texto con título y punto de color, sin contenedor propio: quien lo usa decide el marco.
  withDefaults(defineProps<InfoCardProps>(), { level: 'h3', dot: 'blue' })
</script>

<template>
  <article class="min-w-0">
    <component
      :is="level"
      class="mb-2 flex items-center gap-2 text-lg leading-tight font-semibold text-brand-ink"
    >
      <span
        class="size-2 shrink-0 rounded-full"
        :class="dot === 'warm' ? 'bg-brand-warm-ink' : 'bg-brand-blue'"
        aria-hidden="true"
      />
      {{ title }}
    </component>
    <p class="text-sm leading-6 text-brand-muted md:text-base md:leading-7">
      <slot />
    </p>
  </article>
</template>
