<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import { formatProjectDate } from '~/utils/admin/projects'
  import { formatUsd, type TrmRecord } from '~/utils/admin/team'

  // Resumen del equipo: total por pagar y TRM vigente (con acceso para registrarla).
  defineProps<{ dueUsd: number; trm: TrmRecord | null }>()
  const emit = defineEmits<{ editTrm: [] }>()
</script>

<template>
  <div class="mb-6 grid gap-4 sm:grid-cols-2">
    <div class="rounded-2xl border border-brand-border bg-brand-surface-card p-5">
      <p class="text-sm text-brand-muted">Total por pagar al equipo</p>
      <p class="mt-1 text-3xl font-semibold tabular-nums text-brand-ink">{{ formatUsd(dueUsd) }}</p>
    </div>
    <div class="rounded-2xl border border-brand-border bg-brand-surface-card p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm text-brand-muted">TRM vigente</p>
          <template v-if="trm">
            <p class="mt-1 text-3xl font-semibold tabular-nums text-brand-ink">
              {{ trm.copPerUsd.toLocaleString('es-CO') }}
              <span class="block text-sm font-normal text-brand-muted">COP por USD</span>
            </p>
            <p class="text-xs text-brand-muted">Del {{ formatProjectDate(trm.rateDate) }}</p>
          </template>
          <p v-else class="mt-1 text-sm leading-6 text-brand-muted">
            Aún no hay una TRM registrada. Regístrala para pagar en USD con su equivalente en pesos.
          </p>
        </div>
        <AdminButton class="shrink-0" @click="emit('editTrm')">
          {{ trm ? 'Actualizar' : 'Registrar TRM' }}
        </AdminButton>
      </div>
    </div>
  </div>
</template>
