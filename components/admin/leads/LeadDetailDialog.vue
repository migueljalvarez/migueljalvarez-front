<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import LeadFormDialog from '~/components/admin/leads/LeadFormDialog.vue'
  import LeadNotes from '~/components/admin/leads/LeadNotes.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    LEAD_LIMITS,
    LEAD_ORIGIN_LABEL,
    LEAD_STATUS_OPTIONS,
    LEAD_SUBJECT_LABEL,
    buildActionPayload,
    buildStagePayload,
    formatLeadDate,
    leadStatusBadge,
    type LeadDetailRecord,
    type LeadNoteRecord,
    type LeadRecord,
    type LeadStatus
  } from '~/utils/admin/leads'

  // Detalle de un lead: datos, etapa del pipeline, conversión a cliente, próxima acción y notas.
  // Carga el lead por id cada vez que se abre y avisa al listado de cada cambio (`changed`).
  const props = defineProps<{ leadId: string | null }>()
  const emit = defineEmits<{
    close: []
    changed: [lead: LeadRecord, message: string]
    deleted: [id: string]
  }>()

  const leads = useAdminLeads()

  const detail = ref<LeadDetailRecord | null>(null)
  const loadError = ref('')
  const isLoading = ref(false)

  // Etapa
  const stage = ref<LeadStatus>('nuevo')
  const lostReason = ref('')
  const stageError = ref('')
  const stageSaving = ref(false)
  // Próxima acción
  const actionText = ref('')
  const actionDate = ref('')
  const actionError = ref('')
  const actionSaving = ref(false)
  // Conversión, edición y eliminación
  const feedback = ref('')
  const actionFailure = ref('')
  const convertOpen = ref(false)
  const convertBusy = ref(false)
  const convertError = ref('')
  const editOpen = ref(false)
  const deleteOpen = ref(false)
  const deleteBusy = ref(false)
  const deleteError = ref('')

  const fill = (lead: LeadDetailRecord) => {
    detail.value = lead
    stage.value = lead.status
    lostReason.value = lead.lostReason
    actionText.value = lead.nextAction
    actionDate.value = lead.nextActionDate
  }

  const load = async (id: string) => {
    isLoading.value = true
    loadError.value = ''
    detail.value = null
    stageError.value = actionError.value = actionFailure.value = feedback.value = ''
    try {
      fill(await leads.get(id))
    } catch (error) {
      loadError.value = toAdminApiError(error).message
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => props.leadId,
    id => {
      if (id) void load(id)
      else detail.value = null
    },
    { immediate: true }
  )

  // Aplica un lead actualizado a la vista, conservando las notas ya cargadas.
  const apply = (lead: LeadRecord, message: string) => {
    if (!detail.value) return
    fill({ ...lead, notes: detail.value.notes })
    feedback.value = message
    emit('changed', lead, message)
  }

  const stageChanged = computed(
    () =>
      !!detail.value &&
      (stage.value !== detail.value.status ||
        (stage.value === 'perdido' && lostReason.value.trim() !== detail.value.lostReason))
  )

  const saveStage = async () => {
    if (!detail.value) return
    const result = buildStagePayload(stage.value, lostReason.value)
    if (!result.ok) {
      stageError.value = result.error
      return
    }
    stageError.value = ''
    stageSaving.value = true
    try {
      const saved = await leads.update(detail.value.id, result.data)
      apply(saved, `Etapa actualizada: ${leadStatusBadge(saved.status).label}`)
    } catch (error) {
      stageError.value = toAdminApiError(error).message
    } finally {
      stageSaving.value = false
    }
  }

  const saveAction = async () => {
    if (!detail.value) return
    const result = buildActionPayload(actionText.value, actionDate.value)
    if (!result.ok) {
      actionError.value = result.error
      return
    }
    actionError.value = ''
    actionSaving.value = true
    try {
      apply(await leads.update(detail.value.id, result.data), 'Próxima acción guardada')
    } catch (error) {
      actionError.value = toAdminApiError(error).message
    } finally {
      actionSaving.value = false
    }
  }

  const onNoteAdded = (note: LeadNoteRecord) => {
    if (detail.value) detail.value.notes = [note, ...detail.value.notes]
    feedback.value = 'Nota agregada'
  }

  const convert = async () => {
    if (!detail.value) return
    convertBusy.value = true
    convertError.value = ''
    try {
      const { lead } = await leads.convert(detail.value.id)
      convertOpen.value = false
      apply(lead, 'Lead convertido en cliente')
    } catch (error) {
      convertError.value = toAdminApiError(error).message
    } finally {
      convertBusy.value = false
    }
  }

  const remove = async () => {
    if (!detail.value) return
    deleteBusy.value = true
    deleteError.value = ''
    try {
      const id = detail.value.id
      await leads.remove(id)
      deleteOpen.value = false
      emit('deleted', id)
    } catch (error) {
      deleteError.value = toAdminApiError(error).message
    } finally {
      deleteBusy.value = false
    }
  }

  const onEdited = (lead: LeadRecord) => {
    editOpen.value = false
    apply(lead, 'Datos del lead actualizados')
  }

  const openConvert = () => {
    convertError.value = ''
    convertOpen.value = true
  }
  const openDelete = () => {
    deleteError.value = ''
    deleteOpen.value = true
  }

  const badge = computed(() => (detail.value ? leadStatusBadge(detail.value.status) : null))
  const h3 = 'text-sm font-semibold uppercase tracking-[0.08em] text-brand-muted'
</script>

<template>
  <div>
    <AdminDialog
      :open="!!leadId"
      :title="detail ? detail.name : 'Lead'"
      :description="detail ? detail.email : undefined"
      @close="emit('close')"
    >
      <AdminSkeleton v-if="isLoading" :rows="3" height-class="h-20" label="Cargando el lead…" />

      <AdminNotice v-else-if="loadError" tone="error" :message="loadError">
        <AdminButton v-if="leadId" @click="load(leadId)">Reintentar</AdminButton>
      </AdminNotice>

      <div v-else-if="detail" class="space-y-6">
        <AdminNotice tone="success" :message="feedback" />

        <div class="flex flex-wrap items-center gap-2">
          <AdminBadge v-if="badge" :tone="badge.tone">{{ badge.label }}</AdminBadge>
          <AdminBadge v-if="detail.clientId" tone="success" icon="mdi:account-check-outline">
            Es cliente
          </AdminBadge>
        </div>

        <dl class="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-xs text-brand-muted">Teléfono o WhatsApp</dt>
            <dd class="font-medium text-brand-ink">{{ detail.phone || '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-brand-muted">Asunto</dt>
            <dd class="font-medium text-brand-ink">{{ LEAD_SUBJECT_LABEL[detail.subject] }}</dd>
          </div>
          <div>
            <dt class="text-xs text-brand-muted">Origen</dt>
            <dd class="font-medium text-brand-ink">{{ LEAD_ORIGIN_LABEL[detail.origin] }}</dd>
          </div>
          <div>
            <dt class="text-xs text-brand-muted">Recibido</dt>
            <dd class="font-medium text-brand-ink">{{ formatLeadDate(detail.createdAt) }}</dd>
          </div>
          <div v-if="detail.consentAt" class="sm:col-span-2">
            <dt class="text-xs text-brand-muted">Consentimiento de datos (Ley 1581)</dt>
            <dd class="font-medium text-brand-ink">
              Aceptado el {{ formatLeadDate(detail.consentAt) }}
              <span v-if="detail.consentPolicyVersion">
                · política {{ detail.consentPolicyVersion }}
              </span>
            </dd>
          </div>
        </dl>

        <p
          v-if="detail.message"
          class="whitespace-pre-line rounded-xl bg-brand-surface-soft p-3 text-sm leading-6 text-brand-ink"
        >
          {{ detail.message }}
        </p>

        <section aria-labelledby="lead-stage-heading" class="space-y-3">
          <h3 id="lead-stage-heading" :class="h3">Etapa</h3>
          <AdminInput
            id="lead-stage"
            :model-value="stage"
            label="Etapa del pipeline"
            type="select"
            :options="LEAD_STATUS_OPTIONS"
            @update:model-value="stage = $event as LeadStatus"
          />
          <AdminInput
            v-if="stage === 'perdido'"
            id="lead-lost"
            v-model="lostReason"
            label="Motivo por el que se perdió"
            required
            :maxlength="LEAD_LIMITS.lostReason"
            :error="stageError"
          />
          <AdminNotice v-else tone="error" :message="stageError" />
          <AdminButton
            :disabled="!stageChanged"
            :loading="stageSaving"
            loading-label="Guardando…"
            @click="saveStage"
          >
            Guardar etapa
          </AdminButton>
        </section>

        <section aria-labelledby="lead-client-heading" class="space-y-3">
          <h3 id="lead-client-heading" :class="h3">Cliente</h3>
          <p v-if="detail.clientId" class="text-sm leading-6 text-brand-muted">
            Este lead ya es cliente.
            <NuxtLink
              to="/admin/projects"
              class="inline-flex min-h-11 items-center font-semibold text-brand-accent-text underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Crear su proyecto
            </NuxtLink>
          </p>
          <template v-else>
            <p class="text-sm leading-6 text-brand-muted">
              Al convertirlo se crea un cliente con su nombre y correo, y el lead pasa a «Ganado».
            </p>
            <AdminButton @click="openConvert">Convertir en cliente</AdminButton>
          </template>
        </section>

        <section aria-labelledby="lead-action-heading" class="space-y-3">
          <h3 id="lead-action-heading" :class="h3">Próxima acción</h3>
          <div class="grid gap-3 sm:grid-cols-[1fr_11rem]">
            <AdminInput
              id="lead-action"
              v-model="actionText"
              label="Qué hacer"
              :maxlength="LEAD_LIMITS.nextAction"
            />
            <AdminInput id="lead-action-date" v-model="actionDate" label="Fecha" type="date" />
          </div>
          <AdminNotice tone="error" :message="actionError" />
          <AdminButton :loading="actionSaving" loading-label="Guardando…" @click="saveAction">
            Guardar acción
          </AdminButton>
        </section>

        <section aria-labelledby="lead-notes-heading" class="space-y-3">
          <h3 id="lead-notes-heading" :class="h3">Notas e historial</h3>
          <LeadNotes :lead-id="detail.id" :notes="detail.notes" @added="onNoteAdded" />
        </section>

        <div
          class="flex flex-wrap items-center justify-between gap-2 border-t border-brand-border pt-4"
        >
          <AdminButton variant="danger" @click="openDelete">Eliminar lead</AdminButton>
          <div class="flex flex-wrap gap-2">
            <AdminButton @click="editOpen = true">Editar datos</AdminButton>
            <AdminButton @click="emit('close')">Cerrar</AdminButton>
          </div>
        </div>
      </div>
    </AdminDialog>

    <LeadFormDialog :open="editOpen" :lead="detail" @close="editOpen = false" @saved="onEdited" />

    <AdminConfirmDialog
      :open="convertOpen"
      title="Convertir en cliente"
      confirm-label="Convertir"
      loading-label="Convirtiendo…"
      tone="primary"
      :busy="convertBusy"
      :error="convertError"
      @close="convertOpen = false"
      @confirm="convert"
    >
      Se creará el cliente «{{ detail?.name }}» y el lead pasará a «Ganado». Después podrás crear su
      proyecto.
    </AdminConfirmDialog>

    <AdminConfirmDialog
      :open="deleteOpen"
      title="Eliminar lead"
      confirm-label="Eliminar lead"
      loading-label="Eliminando…"
      :busy="deleteBusy"
      :error="deleteError"
      @close="deleteOpen = false"
      @confirm="remove"
    >
      Se eliminará el lead «{{ detail?.name }}» con todas sus notas. Esta acción no se puede
      deshacer.
    </AdminConfirmDialog>
  </div>
</template>
