<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminHoursProgress from '~/components/admin/AdminHoursProgress.vue'
  import type { AssignmentRecord } from '~/utils/admin/team'

  // Asignación de un colaborador a un proyecto: horas usadas frente a las pactadas (el exceso se avisa).
  defineProps<{ assignment: AssignmentRecord; memberName: string; projectName: string }>()
  const emit = defineEmits<{ edit: []; remove: [] }>()
</script>

<template>
  <article class="rounded-xl border border-brand-border bg-brand-surface-card p-4">
    <h3 class="truncate text-base font-semibold text-brand-ink">{{ memberName }}</h3>
    <p class="truncate text-sm text-brand-muted">{{ projectName }}</p>
    <AdminHoursProgress
      class="mt-3"
      :used="assignment.usedHours"
      :total="assignment.agreedHours"
      :over="assignment.exceeded"
      :label="`Horas usadas por ${memberName} en ${projectName}`"
      over-label="excede lo pactado"
    />
    <div class="mt-3 flex flex-wrap justify-between gap-2">
      <AdminButton
        variant="danger"
        :aria-label="`Eliminar la asignación de ${memberName} a ${projectName}`"
        @click="emit('remove')"
      >
        Eliminar
      </AdminButton>
      <AdminButton
        :aria-label="`Editar las horas pactadas de ${memberName} en ${projectName}`"
        @click="emit('edit')"
      >
        Editar horas
      </AdminButton>
    </div>
  </article>
</template>
