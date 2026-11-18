<script setup lang="ts">
  import AdminIconButton from '~/components/admin/AdminIconButton.vue'
  import { formatProjectDate } from '~/utils/admin/projects'
  import { formatHours, type TimeEntryRecord } from '~/utils/admin/team'

  // Fila de un registro de horas. Eliminar sirve para corregir un error de captura.
  defineProps<{ entry: TimeEntryRecord; memberName: string; projectName: string }>()
  const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <li class="flex items-center justify-between gap-3 px-4 py-3 text-sm">
    <div class="min-w-0">
      <p class="truncate font-medium text-brand-ink">{{ memberName }}</p>
      <p class="text-xs text-brand-muted">
        {{ projectName }} · {{ formatProjectDate(entry.workDate) }}
      </p>
      <p v-if="entry.note" class="truncate text-xs text-brand-muted">{{ entry.note }}</p>
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <span class="font-semibold tabular-nums text-brand-ink">
        {{ formatHours(entry.hours) }} h
      </span>
      <AdminIconButton
        label="Eliminar registro de horas"
        icon="mdi:trash-can-outline"
        tone="danger"
        @click="emit('remove')"
      />
    </div>
  </li>
</template>
