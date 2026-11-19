<script lang="ts" setup>
  import { Card } from '~/components/atoms'
  import type { StatListProps } from '../molecule'

  const props = defineProps<StatListProps>()

  // Columnas según cuántas cifras haya (sin filas con huecos). Las variantes `@…` responden al ancho del
  // contenedor (`@container` de la sección), no al de la ventana: la vista previa del panel es fiel.
  const columns = computed(() =>
    props.items.length === 3
      ? 'grid-cols-1 @lg:grid-cols-3'
      : props.items.length === 1
        ? 'grid-cols-1'
        : 'grid-cols-2'
  )
</script>

<template>
  <dl class="grid gap-4 @2xl:gap-5" :class="columns">
    <!-- La etiqueta va primero en el DOM (término) y la cifra se ve arriba (flex-col-reverse). -->
    <Card
      v-for="item in items"
      :key="`${item.value}-${item.label}`"
      class="flex min-w-0 flex-col-reverse justify-end gap-1 p-4"
    >
      <dt class="text-xs leading-5 text-brand-muted">{{ item.label }}</dt>
      <dd class="font-display text-2xl leading-tight font-bold break-words text-brand-warm-ink">
        {{ item.value }}
      </dd>
    </Card>
  </dl>
</template>
