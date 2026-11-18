<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminHoursProgress from '~/components/admin/AdminHoursProgress.vue'
  import {
    deadlineInfo,
    formatProjectDate,
    projectStatusBadge,
    type ProjectRecord
  } from '~/utils/admin/projects'

  // Tarjeta de un proyecto: cliente, estado, horas usadas frente al presupuesto, tarifa y fechas.
  const props = defineProps<{ project: ProjectRecord; clientName: string }>()
  const emit = defineEmits<{ edit: []; remove: [] }>()

  const badge = computed(() => projectStatusBadge(props.project.status))
  const deadline = computed(() => deadlineInfo(props.project.deadline, props.project.status))
  const DEADLINE_TONE = {
    success: 'text-brand-success-text',
    danger: 'text-brand-error-text',
    warning: 'text-brand-warning-text',
    muted: 'text-brand-muted'
  } as const
</script>

<template>
  <article class="rounded-2xl border border-brand-border bg-brand-surface-card p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="truncate text-lg font-semibold text-brand-ink">{{ project.name }}</h3>
        <p class="truncate text-sm text-brand-muted">{{ clientName }}</p>
      </div>
      <div class="flex shrink-0 flex-wrap justify-end gap-2">
        <AdminBadge :tone="badge.tone">{{ badge.label }}</AdminBadge>
        <AdminBadge v-if="project.publishable" icon="mdi:eye-outline">Publicable</AdminBadge>
      </div>
    </div>

    <AdminHoursProgress
      class="mt-4"
      :used="project.usedHours"
      :total="project.budgetHours"
      :label="`Horas usadas de ${project.name}`"
      over-label="excede el presupuesto"
    />

    <dl class="mt-4 grid grid-cols-3 gap-3 text-sm">
      <div>
        <dt class="text-xs text-brand-muted">Tarifa</dt>
        <dd class="font-medium tabular-nums text-brand-ink">${{ project.rateUsd }}/h</dd>
      </div>
      <div>
        <dt class="text-xs text-brand-muted">Inicio</dt>
        <dd class="font-medium text-brand-ink">{{ formatProjectDate(project.startDate) }}</dd>
      </div>
      <div>
        <dt class="text-xs text-brand-muted">Deadline</dt>
        <dd class="font-medium text-brand-ink">{{ formatProjectDate(project.deadline) }}</dd>
        <dd
          v-if="deadline.text"
          class="text-xs font-semibold"
          :class="DEADLINE_TONE[deadline.tone]"
        >
          {{ deadline.text }}
        </dd>
      </div>
    </dl>

    <div class="mt-4 flex flex-wrap justify-between gap-2 border-t border-brand-border pt-4">
      <AdminButton
        variant="danger"
        :aria-label="`Eliminar ${project.name}`"
        @click="emit('remove')"
      >
        Eliminar
      </AdminButton>
      <AdminButton :aria-label="`Editar ${project.name}`" @click="emit('edit')">Editar</AdminButton>
    </div>
  </article>
</template>
