<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    TEAM_LIMITS,
    emptyMemberForm,
    memberFormFromRecord,
    validateMemberForm,
    type MemberFormValues,
    type TeamMemberRecord
  } from '~/utils/admin/team'

  // Alta o edición de un colaborador. Desactivarlo conserva su historial de horas y pagos.
  const props = defineProps<{ open: boolean; member?: TeamMemberRecord | null }>()
  const emit = defineEmits<{ close: []; saved: [member: TeamMemberRecord, created: boolean] }>()

  const api = useAdminTeam()
  const isEdit = computed(() => !!props.member)
  const values = reactive<MemberFormValues>(emptyMemberForm())
  const errors = ref<Record<string, string>>({})
  const saveError = ref('')
  const isSaving = ref(false)

  watch(
    () => props.open,
    open => {
      if (!open) return
      Object.assign(values, props.member ? memberFormFromRecord(props.member) : emptyMemberForm())
      errors.value = {}
      saveError.value = ''
    },
    { immediate: true }
  )

  const submit = async () => {
    saveError.value = ''
    const result = validateMemberForm(values)
    if (!result.ok) {
      errors.value = result.errors
      await nextTick()
      document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
      return
    }
    errors.value = {}
    isSaving.value = true
    try {
      const saved = props.member
        ? await api.updateMember(props.member.id, result.data)
        : await api.createMember(result.data)
      emit('saved', saved, !props.member)
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
    :title="isEdit ? 'Editar colaborador' : 'Nuevo colaborador'"
    description="La tarifa es por hora y en USD. Lo ya causado se calcula con la tarifa vigente."
    @close="emit('close')"
  >
    <form class="space-y-4" novalidate @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminInput
          id="member-name"
          v-model="values.name"
          label="Nombre"
          required
          :maxlength="TEAM_LIMITS.name"
          autocomplete="off"
          :error="errors.name"
        />
        <AdminInput
          id="member-role"
          v-model="values.role"
          label="Rol"
          required
          :maxlength="TEAM_LIMITS.role"
          autocomplete="off"
          :error="errors.role"
        />
        <AdminInput
          id="member-email"
          v-model="values.email"
          label="Correo (opcional)"
          type="email"
          :maxlength="TEAM_LIMITS.email"
          autocomplete="off"
          :error="errors.email"
        />
        <AdminInput
          id="member-rate"
          v-model="values.rateUsd"
          label="Tarifa por hora (USD)"
          type="number"
          step="0.01"
          required
          :error="errors.rateUsd"
        />
      </div>
      <AdminInput
        id="member-responsibilities"
        v-model="values.responsibilities"
        label="Responsabilidades (opcional)"
        type="textarea"
        :maxlength="TEAM_LIMITS.responsibilities"
        counter
        :error="errors.responsibilities"
      />
      <AdminInput
        v-if="isEdit"
        id="member-active"
        v-model="values.active"
        label="Colaborador activo"
        type="checkbox"
        hint="Si lo desactivas ya no se le pueden asignar proyectos ni registrar horas; su historial se conserva."
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
          {{ isEdit ? 'Guardar cambios' : 'Crear colaborador' }}
        </AdminButton>
      </AdminDialogActions>
    </form>
  </AdminDialog>
</template>
