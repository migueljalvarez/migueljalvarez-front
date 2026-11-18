<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    emptyTrmForm,
    localToday,
    validateTrmForm,
    type TrmFormValues,
    type TrmRecord
  } from '~/utils/admin/team'

  // Registra o corrige la TRM (COP por USD) de un día. Los pagos ya hechos conservan la suya.
  const props = defineProps<{ open: boolean; trm: TrmRecord | null }>()
  const emit = defineEmits<{ close: []; saved: [trm: TrmRecord] }>()

  const api = useAdminTeam()
  const values = reactive<TrmFormValues>(emptyTrmForm('', null))
  const errors = ref<Record<string, string>>({})
  const saveError = ref('')
  const isSaving = ref(false)

  watch(
    () => props.open,
    open => {
      if (!open) return
      Object.assign(values, emptyTrmForm(localToday(), props.trm))
      errors.value = {}
      saveError.value = ''
    },
    { immediate: true }
  )

  const submit = async () => {
    saveError.value = ''
    const result = validateTrmForm(values)
    if (!result.ok) {
      errors.value = result.errors
      await nextTick()
      document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
      return
    }
    errors.value = {}
    isSaving.value = true
    try {
      emit('saved', await api.setTrm(result.data))
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
    title="Registrar TRM"
    description="Tasa de cambio del día en pesos por dólar. Si ya existe una para esa fecha, se corrige."
    @close="emit('close')"
  >
    <form class="space-y-4" novalidate @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminInput
          id="trm-date"
          v-model="values.rateDate"
          label="Fecha"
          type="date"
          required
          :error="errors.rateDate"
        />
        <AdminInput
          id="trm-rate"
          v-model="values.copPerUsd"
          label="TRM (COP por USD)"
          type="number"
          step="0.01"
          required
          :error="errors.copPerUsd"
        />
      </div>
      <AdminNotice tone="error" :message="saveError" gap="top" />
      <AdminDialogActions>
        <AdminButton :disabled="isSaving" @click="emit('close')">Cancelar</AdminButton>
        <AdminButton type="submit" variant="primary" :loading="isSaving" loading-label="Guardando…">
          Guardar TRM
        </AdminButton>
      </AdminDialogActions>
    </form>
  </AdminDialog>
</template>
