<script setup lang="ts">
  import { hoursProgress } from '~/utils/admin/projects'
  import { formatHours } from '~/utils/admin/team'

  // Horas usadas frente a lo previsto, con barra y porcentaje sin tope: pasarse se ve y se dice con
  // texto (`overLabel`), no solo con el color.
  const props = defineProps<{
    used: number
    total: number
    /** Nombre accesible de la barra, p. ej. «Horas usadas de Tienda». */
    label: string
    /** Texto junto al porcentaje cuando se pasa (p. ej. «excede el presupuesto»). */
    overLabel: string
    /** Fuerza el estado de exceso (la API ya lo calcula en las asignaciones). */
    over?: boolean
  }>()

  const progress = computed(() => hoursProgress(props.used, props.total))
  const isOver = computed(() => props.over ?? progress.value.over)
</script>

<template>
  <div>
    <div class="flex justify-between gap-3 text-xs text-brand-muted">
      <span class="tabular-nums">Horas {{ formatHours(used) }} / {{ formatHours(total) }}</span>
      <span class="tabular-nums" :class="{ 'font-semibold text-brand-error-text': isOver }">
        {{ progress.percent }} %{{ isOver ? ` · ${overLabel}` : '' }}
      </span>
    </div>
    <div
      class="mt-1 h-2 overflow-hidden rounded-full bg-brand-surface-soft"
      role="progressbar"
      :aria-valuenow="used"
      aria-valuemin="0"
      :aria-valuemax="total"
      :aria-label="label"
    >
      <div
        class="h-full rounded-full"
        :class="isOver ? 'bg-brand-error-text' : 'bg-brand-blue'"
        :style="{ width: `${progress.bar}%` }"
      />
    </div>
  </div>
</template>
