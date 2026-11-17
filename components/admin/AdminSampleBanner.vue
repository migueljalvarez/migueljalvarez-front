<script setup lang="ts">
  import { USE_ADMIN_SAMPLES } from '~/constants/admin.samples'
</script>

<template>
  <p
    v-if="USE_ADMIN_SAMPLES"
    role="note"
    class="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand-warning-border bg-brand-warning-bg px-3 py-2 text-xs font-semibold text-brand-warning-text"
  >
    <Icon name="mdi:flask-outline" size="16" aria-hidden="true" />
    Datos de ejemplo (solo desarrollo)
  </p>
</template>
