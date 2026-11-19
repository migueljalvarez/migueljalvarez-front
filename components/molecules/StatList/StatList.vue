<script lang="ts" setup>
  import type { StatListProps } from '../molecule'

  const props = defineProps<StatListProps>()

  // Franja en un recuadro tenue con divisores verticales finos entre cifras. Hasta 3 van en una fila; con 4,
  // dos filas en pantallas estrechas y una desde `@lg`. Las variantes `@…` responden al ancho del
  // contenedor (`@container` de la sección), no al de la ventana.
  const columns = computed(() => {
    const count = props.items.length
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-2'
    return count === 4 ? 'grid-cols-2 @lg:grid-cols-4' : 'grid-cols-3'
  })
  const divider = (index: number) => {
    if (index === 0) return ''
    if (props.items.length !== 4) return 'border-l border-brand-border'
    if (index === 1) return 'border-l border-brand-border'
    if (index === 2) return 'border-t border-brand-border @lg:border-t-0 @lg:border-l'
    return 'border-t border-l border-brand-border @lg:border-t-0'
  }
</script>

<template>
  <dl class="m-0 grid rounded-xl border border-brand-border bg-brand-surface" :class="columns">
    <!-- La etiqueta va primero en el DOM (término) y la cifra se ve arriba (flex-col-reverse). -->
    <div
      v-for="(item, index) in items"
      :key="`${item.value}-${item.label}`"
      class="flex min-w-0 flex-col-reverse justify-end gap-1 px-3 py-4 @lg:px-4"
      :class="divider(index)"
    >
      <dt class="text-xs leading-4 text-brand-muted first-letter:uppercase">{{ item.label }}</dt>
      <dd
        class="font-display text-xl leading-tight font-bold break-words text-brand-warm-ink @lg:text-3xl"
      >
        {{ item.value }}
      </dd>
    </div>
  </dl>
</template>
