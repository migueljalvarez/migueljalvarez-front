<script setup lang="ts">
  const { persistence } = useAdminData()
</script>

<template>
  <p
    v-if="persistence === 'memoria'"
    role="note"
    class="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand-warning-border bg-brand-warning-bg px-3 py-2 text-xs font-semibold text-brand-warning-text"
  >
    <Icon name="mdi:flask-outline" size="16" aria-hidden="true" />
    Datos de ejemplo (solo desarrollo): los cambios viven en memoria y se pierden al recargar.
  </p>
  <p
    v-else-if="persistence === 'ninguna'"
    role="note"
    class="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand-border bg-brand-surface-soft px-3 py-2 text-xs font-semibold text-brand-muted"
  >
    <Icon name="mdi:cloud-off-outline" size="16" aria-hidden="true" />
    Sin API conectada: este módulo todavía no puede guardar cambios.
  </p>
</template>
