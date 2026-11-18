<script setup lang="ts">
  import { formatProjectDate } from '~/utils/admin/projects'
  import { formatCop, formatUsd, type PaymentRecord } from '~/utils/admin/team'

  // Fila de un pago: USD pagados, la TRM guardada y el equivalente en COP (calculado por la base).
  defineProps<{ payment: PaymentRecord; memberName: string }>()
</script>

<template>
  <li class="flex items-center justify-between gap-3 px-4 py-3 text-sm">
    <div class="min-w-0">
      <p class="truncate font-medium text-brand-ink">{{ memberName }}</p>
      <p class="text-xs text-brand-muted">
        {{ formatProjectDate(payment.paidOn) }} · TRM
        {{ payment.trm.toLocaleString('es-CO') }}
      </p>
      <p v-if="payment.note" class="truncate text-xs text-brand-muted">{{ payment.note }}</p>
    </div>
    <div class="shrink-0 text-right">
      <p class="font-semibold tabular-nums text-brand-ink">{{ formatUsd(payment.amountUsd) }}</p>
      <p class="text-xs tabular-nums text-brand-muted">{{ formatCop(payment.amountCop) }}</p>
    </div>
  </li>
</template>
