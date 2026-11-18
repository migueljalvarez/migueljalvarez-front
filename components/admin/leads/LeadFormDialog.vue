<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    LEAD_LIMITS,
    LEAD_ORIGIN_OPTIONS,
    LEAD_SUBJECT_OPTIONS,
    emptyLeadForm,
    leadFormFromRecord,
    validateLeadForm,
    type LeadFormValues,
    type LeadRecord
  } from '~/utils/admin/leads'

  // Alta manual de un lead (WhatsApp, LinkedIn, referidos…) o edición de sus datos de contacto.
  // En edición, la próxima acción no se toca aquí: se gestiona en el detalle.
  const props = defineProps<{ open: boolean; lead?: LeadRecord | null }>()
  const emit = defineEmits<{ close: []; saved: [lead: LeadRecord] }>()

  const leads = useAdminLeads()
  // Ids únicos: el formulario de alta y el de edición pueden existir a la vez en la página.
  const uid = useId()
  const isEdit = computed(() => !!props.lead)
  const values = reactive<LeadFormValues>(emptyLeadForm())
  const errors = ref<Record<string, string>>({})
  const saveError = ref('')
  const isSaving = ref(false)

  watch(
    () => props.open,
    open => {
      if (!open) return
      Object.assign(values, props.lead ? leadFormFromRecord(props.lead) : emptyLeadForm())
      errors.value = {}
      saveError.value = ''
    },
    { immediate: true }
  )

  const focusFirstError = async () => {
    await nextTick()
    document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
  }

  const submit = async () => {
    saveError.value = ''
    const result = validateLeadForm(values)
    if (!result.ok) {
      errors.value = result.errors
      await focusFirstError()
      return
    }
    errors.value = {}
    isSaving.value = true
    try {
      const { name, email, phone, subject, origin, message } = result.data
      const contact = { name, email, phone, subject, origin, message }
      const saved = props.lead
        ? await leads.update(props.lead.id, contact)
        : await leads.create(result.data)
      emit('saved', saved)
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
    :title="isEdit ? 'Editar lead' : 'Nuevo lead'"
    :description="
      isEdit
        ? 'Corrige los datos de contacto y el mensaje.'
        : 'Agrega un posible cliente que llegó por otro canal.'
    "
    @close="emit('close')"
  >
    <form class="space-y-4" novalidate @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminInput
          :id="`${uid}-name`"
          v-model="values.name"
          label="Nombre"
          required
          :maxlength="LEAD_LIMITS.name"
          autocomplete="off"
          :error="errors.name"
        />
        <AdminInput
          :id="`${uid}-email`"
          v-model="values.email"
          label="Correo"
          type="email"
          required
          autocomplete="off"
          :error="errors.email"
        />
        <AdminInput
          :id="`${uid}-phone`"
          v-model="values.phone"
          label="Teléfono o WhatsApp"
          :maxlength="LEAD_LIMITS.phone"
          autocomplete="off"
          :error="errors.phone"
        />
        <AdminInput
          :id="`${uid}-origin`"
          v-model="values.origin"
          label="Origen"
          type="select"
          :options="LEAD_ORIGIN_OPTIONS"
          required
          :error="errors.origin"
        />
        <AdminInput
          :id="`${uid}-subject`"
          v-model="values.subject"
          label="Asunto"
          type="select"
          :options="LEAD_SUBJECT_OPTIONS"
          required
          :error="errors.subject"
        />
      </div>
      <div v-if="!isEdit" class="grid gap-4 sm:grid-cols-[1fr_11rem]">
        <AdminInput
          :id="`${uid}-next-action`"
          v-model="values.nextAction"
          label="Próxima acción"
          placeholder="Ej.: llamar para entender el alcance"
          :maxlength="LEAD_LIMITS.nextAction"
          :error="errors.nextAction"
        />
        <AdminInput
          :id="`${uid}-next-date`"
          v-model="values.nextActionDate"
          label="Fecha"
          type="date"
          :error="errors.nextActionDate"
        />
      </div>
      <AdminInput
        :id="`${uid}-message`"
        v-model="values.message"
        label="Mensaje o contexto"
        type="textarea"
        :rows="4"
        :maxlength="LEAD_LIMITS.message"
        :error="errors.message"
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
          {{ isEdit ? 'Guardar cambios' : 'Crear lead' }}
        </AdminButton>
      </AdminDialogActions>
    </form>
  </AdminDialog>
</template>
