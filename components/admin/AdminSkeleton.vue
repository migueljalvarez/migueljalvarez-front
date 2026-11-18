<script setup lang="ts">
  // Esqueleto de carga: cada bloque reserva el alto final (`heightClass`) para que nada salte al cargar.
  withDefaults(
    defineProps<{
      rows?: number
      heightClass?: string
      label?: string
    }>(),
    { rows: 3, heightClass: 'h-32', label: 'Cargando…' }
  )
</script>

<template>
  <div class="space-y-3" role="status" aria-busy="true">
    <span class="sr-only">{{ label }}</span>
    <div
      v-for="row in rows"
      :key="row"
      class="rounded-2xl border border-brand-border bg-brand-surface-soft motion-safe:animate-pulse"
      :class="heightClass"
      aria-hidden="true"
    />
  </div>
</template>
