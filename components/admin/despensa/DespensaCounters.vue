<script setup lang="ts">
  import { despensaCounters } from '~/utils/admin/despensa'

  // Contadores por tipo (de TODOS los comentarios, sin filtro) y el total.
  const props = defineProps<{ porTipo: Record<string, number> }>()
  const counters = computed(() => despensaCounters(props.porTipo))
</script>

<template>
  <dl class="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Comentarios por tipo">
    <div class="rounded-2xl border border-brand-border bg-brand-surface-card p-4">
      <dt class="text-sm text-brand-muted">Todos</dt>
      <dd class="mt-1 text-3xl font-semibold tabular-nums text-brand-ink">{{ counters.total }}</dd>
    </div>
    <div
      v-for="item in counters.items"
      :key="item.kind"
      class="rounded-2xl border border-brand-border bg-brand-surface-card p-4"
    >
      <dt class="text-sm text-brand-muted">{{ item.label }}</dt>
      <dd class="mt-1 text-3xl font-semibold tabular-nums text-brand-ink">{{ item.count }}</dd>
    </div>
  </dl>
</template>
