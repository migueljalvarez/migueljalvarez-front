<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    PROJECT_LIMITS,
    PROJECT_STATUS_OPTIONS,
    emptyProjectForm,
    projectFormFromRecord,
    validateProjectForm,
    type ClientRecord,
    type ProjectFormValues,
    type ProjectRecord
  } from '~/utils/admin/projects'

  // Alta o edición de un proyecto. Todos los montos son en USD.
  const props = defineProps<{
    open: boolean
    project?: ProjectRecord | null
    clients: ClientRecord[]
  }>()
  const emit = defineEmits<{ close: []; saved: [project: ProjectRecord, created: boolean] }>()

  const api = useAdminProjects()
  const isEdit = computed(() => !!props.project)
  const clientOptions = computed(() =>
    props.clients.map(client => ({ value: client.id, label: client.name }))
  )
  const today = () => new Date().toISOString().slice(0, 10)

  const values = reactive<ProjectFormValues>(emptyProjectForm(''))
  const errors = ref<Record<string, string>>({})
  const saveError = ref('')
  const isSaving = ref(false)

  watch(
    () => props.open,
    open => {
      if (!open) return
      Object.assign(
        values,
        props.project ? projectFormFromRecord(props.project) : emptyProjectForm(today())
      )
      errors.value = {}
      saveError.value = ''
    },
    { immediate: true }
  )

  const submit = async () => {
    saveError.value = ''
    const result = validateProjectForm(values)
    if (!result.ok) {
      errors.value = result.errors
      await nextTick()
      document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
      return
    }
    errors.value = {}
    isSaving.value = true
    try {
      const saved = props.project
        ? await api.updateProject(props.project.id, result.data)
        : await api.createProject(result.data)
      emit('saved', saved, !props.project)
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
    :title="isEdit ? 'Editar proyecto' : 'Nuevo proyecto'"
    description="Todos los montos son en USD."
    @close="emit('close')"
  >
    <form class="space-y-4" novalidate @submit.prevent="submit">
      <AdminInput
        id="project-name"
        v-model="values.name"
        label="Nombre del proyecto"
        required
        :maxlength="PROJECT_LIMITS.name"
        autocomplete="off"
        :error="errors.name"
      />
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminInput
          id="project-client"
          v-model="values.clientId"
          label="Cliente"
          type="select"
          :options="clientOptions"
          required
          :error="errors.clientId"
        />
        <AdminInput
          id="project-status"
          v-model="values.status"
          label="Estado"
          type="select"
          :options="PROJECT_STATUS_OPTIONS"
          required
          :error="errors.status"
        />
        <AdminInput
          id="project-rate"
          v-model="values.rateUsd"
          label="Tarifa por hora (USD)"
          type="number"
          step="0.01"
          required
          :error="errors.rateUsd"
        />
        <AdminInput
          id="project-hours"
          v-model="values.budgetHours"
          label="Horas presupuestadas"
          type="number"
          step="0.01"
          required
          :error="errors.budgetHours"
        />
        <AdminInput
          id="project-start"
          v-model="values.startDate"
          label="Inicio"
          type="date"
          required
          :error="errors.startDate"
        />
        <AdminInput
          id="project-deadline"
          v-model="values.deadline"
          label="Deadline aproximado"
          type="date"
          required
          :error="errors.deadline"
        />
      </div>
      <AdminInput
        id="project-publishable"
        v-model="values.publishable"
        label="Publicable en el portafolio"
        type="checkbox"
        hint="Solo si el cliente lo permite."
      />
      <AdminNotice tone="error" :message="saveError" gap="top" />
      <AdminDialogActions>
        <AdminButton :disabled="isSaving" @click="emit('close')">Cancelar</AdminButton>
        <AdminButton
          type="submit"
          variant="primary"
          :loading="isSaving"
          :loading-label="isEdit ? 'Guardando…' : 'Creando…'"
        >
          {{ isEdit ? 'Guardar cambios' : 'Crear proyecto' }}
        </AdminButton>
      </AdminDialogActions>
    </form>
  </AdminDialog>
</template>
