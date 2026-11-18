<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    TEAM_LIMITS,
    assignmentsOfMember,
    emptyTimeEntryForm,
    findAssignment,
    formatHours,
    localToday,
    projectNameOf,
    projectedUsage,
    validateTimeEntryForm,
    type AssignmentRecord,
    type TimeEntryCreated,
    type TimeEntryFormValues
  } from '~/utils/admin/team'

  // Registro de horas de un colaborador en un proyecto al que está asignado. Pasarse de lo pactado se
  // permite (la API lo registra y lo marca), pero se avisa antes de guardar.
  const props = defineProps<{
    open: boolean
    memberOptions: { value: string; label: string }[]
    assignments: AssignmentRecord[]
    projects: { id: string; name: string }[]
    /** Colaborador preseleccionado (p. ej. al registrar desde su tarjeta). */
    memberId?: string
  }>()
  const emit = defineEmits<{ close: []; saved: [entry: TimeEntryCreated] }>()

  const api = useAdminTeam()
  const values = reactive<TimeEntryFormValues>(emptyTimeEntryForm(''))
  const errors = ref<Record<string, string>>({})
  const saveError = ref('')
  const isSaving = ref(false)

  // Solo los proyectos a los que la persona está asignada.
  const projectOptions = computed(() =>
    assignmentsOfMember(props.assignments, values.memberId).map(assignment => ({
      value: assignment.projectId,
      label: projectNameOf(props.projects, assignment.projectId)
    }))
  )

  watch(
    () => props.open,
    open => {
      if (!open) return
      Object.assign(values, emptyTimeEntryForm(localToday(), props.memberId ?? ''))
      errors.value = {}
      saveError.value = ''
    },
    { immediate: true }
  )
  watch(
    () => values.memberId,
    () => {
      if (!projectOptions.value.some(option => option.value === values.projectId)) {
        values.projectId = projectOptions.value.length === 1 ? projectOptions.value[0]!.value : ''
      }
    }
  )

  const usage = computed(() =>
    projectedUsage(
      findAssignment(props.assignments, values.memberId, values.projectId),
      Number(values.hours)
    )
  )

  const submit = async () => {
    saveError.value = ''
    const result = validateTimeEntryForm(values)
    if (!result.ok) {
      errors.value = result.errors
      await nextTick()
      document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
      return
    }
    errors.value = {}
    isSaving.value = true
    try {
      emit('saved', await api.createTimeEntry(result.data))
    } catch (error) {
      saveError.value = toAdminApiError(error).message
    } finally {
      isSaving.value = false
    }
  }
</script>

<template>
  <AdminDialog
    :open="open"
    title="Registrar horas"
    description="Las horas se suman al saldo de la persona y al avance del proyecto."
    @close="emit('close')"
  >
    <form class="space-y-4" novalidate @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminInput
          id="entry-member"
          v-model="values.memberId"
          label="Colaborador"
          type="select"
          :options="memberOptions"
          required
          :error="errors.memberId"
        />
        <AdminInput
          id="entry-project"
          v-model="values.projectId"
          label="Proyecto"
          type="select"
          :options="projectOptions"
          :placeholder="values.memberId ? 'Selecciona…' : 'Elige primero al colaborador'"
          required
          :hint="
            values.memberId && !projectOptions.length
              ? 'Esta persona aún no está asignada a ningún proyecto.'
              : undefined
          "
          :error="errors.projectId"
        />
        <AdminInput
          id="entry-hours"
          v-model="values.hours"
          label="Horas"
          type="number"
          step="0.25"
          required
          :hint="`Hasta ${TEAM_LIMITS.entryHours} h por registro.`"
          :error="errors.hours"
        />
        <AdminInput
          id="entry-date"
          v-model="values.workDate"
          label="Fecha"
          type="date"
          required
          :error="errors.workDate"
        />
      </div>
      <p
        v-if="usage"
        role="status"
        class="rounded-xl border p-3 text-sm leading-6"
        :class="
          usage.exceeds
            ? 'border-brand-warning-border bg-brand-warning-bg font-medium text-brand-warning-text'
            : 'border-brand-border bg-brand-surface-soft text-brand-muted'
        "
      >
        <template v-if="usage.exceeds">
          Con estas horas llevarías {{ formatHours(usage.used) }} de {{ formatHours(usage.agreed) }}
          h pactadas: te pasas de lo acordado. Se puede registrar igual.
        </template>
        <template v-else>
          Con estas horas llevarías {{ formatHours(usage.used) }} de
          {{ formatHours(usage.agreed) }} h pactadas.
        </template>
      </p>
      <AdminInput
        id="entry-note"
        v-model="values.note"
        label="Detalle (opcional)"
        :maxlength="TEAM_LIMITS.note"
        counter
        autocomplete="off"
        :error="errors.note"
      />
      <AdminNotice tone="error" :message="saveError" gap="top" />
      <AdminDialogActions>
        <AdminButton :disabled="isSaving" @click="emit('close')">Cancelar</AdminButton>
        <AdminButton
          type="submit"
          variant="primary"
          :loading="isSaving"
          loading-label="Registrando…"
        >
          Registrar horas
        </AdminButton>
      </AdminDialogActions>
    </form>
  </AdminDialog>
</template>
