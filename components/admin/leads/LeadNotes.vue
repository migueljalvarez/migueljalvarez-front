<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    LEAD_LIMITS,
    formatLeadDate,
    validateNote,
    type LeadNoteRecord
  } from '~/utils/admin/leads'

  // Historial de notas de un lead (la API las entrega de la más reciente a la más antigua).
  const props = defineProps<{ leadId: string; notes: LeadNoteRecord[] }>()
  const emit = defineEmits<{ added: [note: LeadNoteRecord] }>()

  const leads = useAdminLeads()
  const text = ref('')
  const error = ref('')
  const saveError = ref('')
  const isSaving = ref(false)

  const submit = async () => {
    saveError.value = ''
    const result = validateNote(text.value)
    if (!result.ok) {
      error.value = result.error
      return
    }
    error.value = ''
    isSaving.value = true
    try {
      emit('added', await leads.addNote(props.leadId, result.text))
      text.value = ''
    } catch (failure) {
      saveError.value = toAdminApiError(failure).message
    } finally {
      isSaving.value = false
    }
  }
</script>

<template>
  <div class="space-y-3">
    <AdminInput
      id="lead-note"
      v-model="text"
      label="Nueva nota"
      type="textarea"
      :rows="2"
      :maxlength="LEAD_LIMITS.note"
      :error="error"
    />
    <AdminNotice tone="error" :message="saveError" />
    <AdminButton variant="primary" :loading="isSaving" loading-label="Guardando…" @click="submit">
      Agregar nota
    </AdminButton>
    <ul v-if="notes.length" class="space-y-2">
      <li v-for="note in notes" :key="note.id" class="rounded-xl border border-brand-border p-3">
        <p class="whitespace-pre-line text-sm leading-6 text-brand-ink">{{ note.text }}</p>
        <p class="mt-1 text-xs text-brand-muted">{{ formatLeadDate(note.at) }}</p>
      </li>
    </ul>
    <p v-else class="text-sm text-brand-muted">Aún no hay notas.</p>
  </div>
</template>
