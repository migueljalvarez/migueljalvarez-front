<script lang="ts" setup>
  import type { StatListProps } from '../molecule'

  const props = defineProps<StatListProps>()

  // Una sola franja con separadores finos (el "gap-px" deja ver el fondo `brand-border` entre celdas), en
  // lugar de una tarjeta por cifra. Columnas según cuántas haya (sin celdas vacías). Las variantes `@…`
  // responden al ancho del contenedor (`@container` de la sección), no al de la ventana.
  const columns = computed(() => {
    const count = props.items.length
    if (count === 1) return 'grid-cols-1'
    if (count === 3) return 'grid-cols-3'
    return count === 4 ? 'grid-cols-2 @lg:grid-cols-4' : 'grid-cols-2'
  })
</script>

<template>
  <dl
    class="grid gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border"
    :class="columns"
  >
    <!-- La etiqueta va primero en el DOM (término) y la cifra se ve arriba (flex-col-reverse). -->
    <div
      v-for="item in items"
      :key="`${item.value}-${item.label}`"
      class="flex min-w-0 flex-col-reverse justify-end gap-1 bg-brand-surface-card p-3 @lg:p-5"
    >
      <dt class="text-xs leading-5 text-brand-muted @lg:text-sm">{{ item.label }}</dt>
      <dd
        class="font-display text-2xl leading-tight font-bold break-words text-brand-warm-ink @lg:text-3xl"
      >
        {{ item.value }}
      </dd>
    </div>
  </dl>
</template>
