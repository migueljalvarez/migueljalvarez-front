<script lang="ts" setup>
  import { computed } from 'vue'
  import type { HeadingProps } from '../atom'

  // Única fuente de la escala de títulos del sitio (excepto el h1 de la portada, que es de display):
  //   page    → título de una página interior (h1)           30 px → 36 px
  //   section → título de una sección o de una tarjeta de login (h2)  24 px → 30 px
  //   card    → título de una tarjeta o subsección (h3, h4)   18 px → 20 px
  // El nivel semántico (`level`) y el tamaño visual (`variant`) van separados, pero por defecto el tamaño
  // sale del nivel, así que un h1 de página interior siempre mide lo mismo.
  const props = withDefaults(defineProps<HeadingProps>(), { level: 'h2', tone: 'light' })

  const resolvedVariant = computed(
    () =>
      props.variant ?? (props.level === 'h1' ? 'page' : props.level === 'h2' ? 'section' : 'card')
  )

  const sizeClass = computed(
    () =>
      ({
        page: 'text-3xl md:text-4xl',
        section: 'text-2xl md:text-3xl',
        card: 'text-lg md:text-xl'
      })[resolvedVariant.value]
  )
</script>

<template>
  <component
    :is="level"
    class="font-semibold leading-tight"
    :class="[sizeClass, tone === 'dark' ? 'text-brand-text-strong' : 'text-brand-ink']"
  >
    <slot />
  </component>
</template>
