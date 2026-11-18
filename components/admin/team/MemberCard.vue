<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import {
    formatHours,
    formatUsd,
    memberStatusBadge,
    type TeamMemberRecord
  } from '~/utils/admin/team'

  // Tarjeta de un colaborador: rol, tarifa y su saldo (horas, causado, pagado y por pagar) en USD.
  const props = defineProps<{ member: TeamMemberRecord }>()
  const emit = defineEmits<{ edit: []; remove: [] }>()

  const badge = computed(() => memberStatusBadge(props.member))
</script>

<template>
  <article class="rounded-2xl border border-brand-border bg-brand-surface-card p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="truncate text-lg font-semibold text-brand-ink">{{ member.name }}</h3>
        <p class="truncate text-sm text-brand-muted">{{ member.role }}</p>
        <p v-if="member.email" class="truncate text-xs text-brand-muted">{{ member.email }}</p>
      </div>
      <AdminBadge :tone="badge.tone">{{ badge.label }}</AdminBadge>
    </div>

    <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
      <div>
        <dt class="text-xs text-brand-muted">Tarifa</dt>
        <dd class="font-medium tabular-nums text-brand-ink">{{ formatUsd(member.rateUsd) }}/h</dd>
      </div>
      <div>
        <dt class="text-xs text-brand-muted">Horas registradas</dt>
        <dd class="font-medium tabular-nums text-brand-ink">{{ formatHours(member.hours) }}</dd>
      </div>
      <div>
        <dt class="text-xs text-brand-muted">Causado</dt>
        <dd class="font-medium tabular-nums text-brand-ink">{{ formatUsd(member.earnedUsd) }}</dd>
      </div>
      <div>
        <dt class="text-xs text-brand-muted">Pagado</dt>
        <dd class="font-medium tabular-nums text-brand-ink">{{ formatUsd(member.paidUsd) }}</dd>
      </div>
    </dl>

    <div
      class="mt-4 flex items-baseline justify-between gap-3 rounded-xl px-3 py-2"
      :class="member.dueUsd > 0 ? 'bg-brand-warning-bg' : 'bg-brand-success-bg'"
    >
      <span
        class="text-sm font-medium"
        :class="member.dueUsd > 0 ? 'text-brand-warning-text' : 'text-brand-success-text'"
      >
        {{ member.dueUsd > 0 ? 'Por pagar' : 'Al día' }}
      </span>
      <span
        class="text-lg font-semibold tabular-nums"
        :class="member.dueUsd > 0 ? 'text-brand-warning-text' : 'text-brand-success-text'"
      >
        {{ formatUsd(member.dueUsd) }}
      </span>
    </div>

    <div class="mt-4 flex flex-wrap justify-between gap-2 border-t border-brand-border pt-4">
      <AdminButton
        variant="danger"
        :aria-label="`Eliminar a ${member.name}`"
        @click="emit('remove')"
      >
        Eliminar
      </AdminButton>
      <AdminButton :aria-label="`Editar a ${member.name}`" @click="emit('edit')">
        Editar
      </AdminButton>
    </div>
  </article>
</template>
