<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import {
    despensaKindLabel,
    despensaKindTone,
    despensaPlatformLabel,
    formatDespensaDate
  } from '~/utils/admin/despensa'
  import type { DespensaFeedbackItem } from '~/utils/despensa'

  // Lista de comentarios, solo lectura. El texto se pinta como texto (nunca como HTML) y conserva los saltos de línea.
  defineProps<{ items: DespensaFeedbackItem[] }>()
</script>

<template>
  <ul class="space-y-3" aria-label="Comentarios">
    <li
      v-for="item in items"
      :key="item.id"
      class="rounded-2xl border border-brand-border bg-brand-surface-card p-4 md:p-5"
    >
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <AdminBadge :tone="despensaKindTone(item.kind)">
          {{ despensaKindLabel(item.kind) }}
        </AdminBadge>
        <time :datetime="item.createdAt" class="text-sm text-brand-muted">
          {{ formatDespensaDate(item.createdAt) }}
        </time>
      </div>
      <p class="mt-3 whitespace-pre-wrap break-words text-base leading-7 text-brand-ink">
        {{ item.message }}
      </p>
      <dl class="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-brand-muted">
        <div class="flex gap-1">
          <dt>Plataforma:</dt>
          <dd class="font-medium text-brand-ink">{{ despensaPlatformLabel(item.platform) }}</dd>
        </div>
        <div class="flex gap-1">
          <dt>Versión:</dt>
          <dd class="font-medium text-brand-ink">{{ item.appVersion ?? 'Sin dato' }}</dd>
        </div>
        <div v-if="item.userRef" class="flex gap-1">
          <dt>Usuario:</dt>
          <dd class="font-medium tabular-nums text-brand-ink">{{ item.userRef }}</dd>
        </div>
      </dl>
    </li>
  </ul>
</template>
