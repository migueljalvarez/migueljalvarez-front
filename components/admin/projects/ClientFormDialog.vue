<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    CLIENT_LIMITS,
    clientFormFromRecord,
    emptyClientForm,
    validateClientForm,
    type ClientFormValues,
    type ClientRecord
  } from '~/utils/admin/projects'

  // Alta o edición de un cliente.
  const props = defineProps<{ open: boolean; client?: ClientRecord | null }>()
  const emit = defineEmits<{ close: []; saved: [client: ClientRecord, created: boolean] }>()

  const api = useAdminProjects()
  const isEdit = computed(() => !!props.client)
  const values = reactive<ClientFormValues>(emptyClientForm())
  const errors = ref<Record<string, string>>({})
  const saveError = ref('')
  const isSaving = ref(false)

  watch(
    () => props.open,
    open => {
      if (!open) return
      Object.assign(values, props.client ? clientFormFromRecord(props.client) : emptyClientForm())
      errors.value = {}
      saveError.value = ''
    },
    { immediate: true }
  )

  const submit = async () => {
    saveError.value = ''
    const result = validateClientForm(values)
    if (!result.ok) {
      errors.value = result.errors
      await nextTick()
      document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
      return
    }
    errors.value = {}
    isSaving.value = true
    try {
      const saved = props.client
        ? await api.updateClient(props.client.id, result.data)
        : await api.createClient(result.data)
      emit('saved', saved, !props.client)
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
    :title="isEdit ? 'Editar cliente' : 'Nuevo cliente'"
    @close="emit('close')"
  >
    <form class="space-y-4" novalidate @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminInput
          id="client-name"
          v-model="values.name"
          label="Nombre"
          required
          :maxlength="CLIENT_LIMITS.name"
          autocomplete="off"
          :error="errors.name"
        />
        <AdminInput
          id="client-company"
          v-model="values.company"
          label="Empresa (opcional)"
          :maxlength="CLIENT_LIMITS.company"
          autocomplete="off"
          :error="errors.company"
        />
      </div>
      <AdminInput
        id="client-email"
        v-model="values.email"
        label="Correo (opcional)"
        type="email"
        autocomplete="off"
        :error="errors.email"
      />
      <AdminInput
        id="client-notes"
        v-model="values.notes"
        label="Notas"
        type="textarea"
        :maxlength="CLIENT_LIMITS.notes"
        :error="errors.notes"
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
          {{ isEdit ? 'Guardar cambios' : 'Crear cliente' }}
        </AdminButton>
      </AdminDialogActions>
    </form>
  </AdminDialog>
</template>
