<script setup lang="ts">
  import { formatPercent, type ClickRow } from '~/utils/admin/analytics'

  // Tabla accesible de conteos (título, filas ordenadas, totales). La fila `footer` (p. ej. «formulario
  // enviado») se muestra aparte, sin porcentaje, para compararla sin mezclarla con los clics.
  defineProps<{
    caption: string
    labelHeader: string
    rows: ClickRow[]
    showPercent?: boolean
    footer?: { label: string; clicks: number; note: string }
  }>()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-72 border-collapse text-left text-sm">
      <caption class="pb-2 text-left text-sm font-semibold text-brand-ink">
        {{ caption }}
      </caption>
      <thead>
        <tr
          class="border-b border-brand-border text-xs uppercase tracking-[0.08em] text-brand-muted"
        >
          <th scope="col" class="py-2 pr-3 font-semibold">{{ labelHeader }}</th>
          <th scope="col" class="px-3 py-2 text-right font-semibold">Clics</th>
          <th v-if="showPercent" scope="col" class="py-2 pl-3 text-right font-semibold">
            % del total
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.key" class="border-b border-brand-border last:border-0">
          <th scope="row" class="min-h-11 py-3 pr-3 font-medium text-brand-ink break-words">
            {{ row.label }}
          </th>
          <td class="px-3 py-3 text-right tabular-nums text-brand-ink">{{ row.clicks }}</td>
          <td v-if="showPercent" class="py-3 pl-3 text-right tabular-nums text-brand-muted">
            <span class="inline-flex items-center justify-end gap-2">
              <span
                class="hidden h-1.5 rounded-full bg-logo-blue sm:inline-block"
                :style="{ width: `${Math.max(2, Math.round((row.percent ?? 0) * 0.6))}px` }"
                aria-hidden="true"
              />
              {{ formatPercent(row.percent ?? 0) }}
            </span>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="footer">
        <tr class="border-t-2 border-brand-border-soft">
          <th scope="row" class="py-3 pr-3 font-medium text-brand-ink">
            {{ footer.label }}
            <span class="block text-xs font-normal text-brand-muted">{{ footer.note }}</span>
          </th>
          <td class="px-3 py-3 text-right tabular-nums text-brand-ink">{{ footer.clicks }}</td>
          <td v-if="showPercent" class="py-3 pl-3 text-right text-brand-muted">
            <span aria-hidden="true">—</span>
            <span class="sr-only">sin porcentaje</span>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
