<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    emptyAssignmentForm,
    formatHours,
    validateAssignmentForm,
    validateAssignmentHours,
    type AssignmentFormValues,
    type AssignmentRecord
  } from '~/utils/admin/team'

  // Asigna a un colaborador activo a un proyecto con horas pactadas, o cambia las horas de una asignación
  // existente (la persona y el proyecto no se cambian: se elimina la asignación y se crea otra).
  const props = defineProps<{
    open: boolean
    assignment?: AssignmentRecord | null
    memberOptions: { value: string; label: string }[]
    projectOptions: { value: string; label: string }[]
    /** Nombres de la asignación que se edita (solo lectura). */
    memberName?: string
    projectName?: string
  }>()
  const emit = defineEmits<{
    close: []
    saved: [assignment: AssignmentRecord, created: boolean]
  }>()

  const api = useAdminTeam()
  const isEdit = computed(() => !!props.assignment)
  const values = reactive<AssignmentFormValues>(emptyAssignmentForm())
  const errors = ref<Record<string, string>>({})
  const saveError = ref('')
  const isSaving = ref(false)

  watch(
    () => props.open,
    open => {
      if (!open) return
      Object.assign(values, emptyAssignmentForm())
      if (props.assignment) values.agreedHours = String(props.assignment.agreedHours)
      errors.value = {}
      saveError.value = ''
    },
    { immediate: true }
  )

  const failWith = async (found: Record<string, string>) => {
    errors.value = found
    await nextTick()
    document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
  }

  const save = async (request: () => Promise<AssignmentRecord>, created: boolean) => {
    errors.value = {}
    isSaving.value = true
    try {
      emit('saved', await request(), created)
    } catch (error) {
      saveError.value = toAdminApiError(error).message
    } finally {
      isSaving.value = false
    }
  }

  const submit = async () => {
    saveError.value = ''
    const current = props.assignment
    if (current) {
      const result = validateAssignmentHours(values)
      if (!result.ok) return failWith(result.errors)
      return save(() => api.updateAssignment(current.id, result.data), false)
    }
    const result = validateAssignmentForm(values)
    if (!result.ok) return failWith(result.errors)
    return save(() => api.createAssignment(result.data), true)
  }
</script>

<template>
  <AdminDialog
    :open="open"
    :title="isEdit ? 'Editar horas pactadas' : 'Asignar a un proyecto'"
    :description="
      isEdit
        ? `Ya se usaron ${formatHours(assignment?.usedHours ?? 0)} h. Si pactas menos, quedará excedida.`
        : 'Define cuántas horas pactaste con esta persona para el proyecto.'
    "
    @close="emit('close')"
  >
    <form class="space-y-4" novalidate @submit.prevent="submit">
      <dl
        v-if="isEdit"
        class="grid gap-3 rounded-xl bg-brand-surface-soft p-3 text-sm sm:grid-cols-2"
      >
        <div>
          <dt class="text-xs text-brand-muted">Colaborador</dt>
          <dd class="font-medium text-brand-ink">{{ memberName }}</dd>
        </div>
        <div>
          <dt class="text-xs text-brand-muted">Proyecto</dt>
          <dd class="font-medium text-brand-ink">{{ projectName }}</dd>
        </div>
      </dl>
      <template v-else>
        <AdminInput
          id="assignment-member"
          v-model="values.memberId"
          label="Colaborador"
          type="select"
          :options="memberOptions"
          required
          :error="errors.memberId"
        />
        <AdminInput
          id="assignment-project"
          v-model="values.projectId"
          label="Proyecto"
          type="select"
          :options="projectOptions"
          required
          :error="errors.projectId"
        />
      </template>
      <AdminInput
        id="assignment-hours"
        v-model="values.agreedHours"
        label="Horas pactadas"
        type="number"
        step="0.01"
        required
        :error="errors.agreedHours"
      />
      <AdminNotice tone="error" :message="saveError" gap="top" />
      <AdminDialogActions>
        <AdminButton :disabled="isSaving" @click="emit('close')">Cancelar</AdminButton>
        <AdminButton
          type="submit"
          variant="primary"
          :loading="isSaving"
          :loading-label="isEdit ? 'Guardando…' : 'Asignando…'"
        >
          {{ isEdit ? 'Guardar cambios' : 'Asignar' }}
        </AdminButton>
      </AdminDialogActions>
    </form>
  </AdminDialog>
</template>
