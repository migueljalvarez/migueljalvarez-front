<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import TestimonialLinkPanel from '~/components/admin/testimonials/TestimonialLinkPanel.vue'
  import TestimonialReviewForm from '~/components/admin/testimonials/TestimonialReviewForm.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import { formatLeadDate } from '~/utils/admin/leads'
  import {
    canRenew,
    canReview,
    expiryInfo,
    testimonialStatusBadge,
    type TestimonialRecord,
    type TestimonialSendResponse
  } from '~/utils/admin/testimonials'

  // Detalle de una solicitud: datos, vencimiento, revisión de la respuesta, renovación del enlace y
  // eliminación. Carga el registro por id cada vez que se abre y avisa al listado de cada cambio.
  const props = defineProps<{ requestId: string | null }>()
  const emit = defineEmits<{
    close: []
    changed: [record: TestimonialRecord, message: string]
    deleted: [id: string]
  }>()

  const testimonials = useAdminTestimonials()

  const detail = ref<TestimonialRecord | null>(null)
  const loadError = ref('')
  const isLoading = ref(false)
  const feedback = ref('')

  const renewResult = ref<TestimonialSendResponse | null>(null)
  const renewBusy = ref(false)
  const renewError = ref('')
  const deleteOpen = ref(false)
  const deleteBusy = ref(false)
  const deleteError = ref('')

  const load = async (id: string) => {
    isLoading.value = true
    loadError.value = ''
    detail.value = null
    feedback.value = renewError.value = ''
    renewResult.value = null
    try {
      detail.value = await testimonials.get(id)
    } catch (error) {
      loadError.value = toAdminApiError(error).message
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => props.requestId,
    id => {
      if (id) void load(id)
      else {
        detail.value = null
        renewResult.value = null
      }
    },
    { immediate: true }
  )

  const apply = (record: TestimonialRecord, message: string) => {
    detail.value = record
    feedback.value = message
    emit('changed', record, message)
  }

  const renew = async () => {
    if (!detail.value) return
    renewBusy.value = true
    renewError.value = ''
    try {
      const response = await testimonials.renew(detail.value.id)
      renewResult.value = response
      apply(response.request, 'Enlace renovado: el anterior ya no sirve')
    } catch (error) {
      renewError.value = toAdminApiError(error).message
    } finally {
      renewBusy.value = false
    }
  }

  const remove = async () => {
    if (!detail.value) return
    deleteBusy.value = true
    deleteError.value = ''
    try {
      const id = detail.value.id
      await testimonials.remove(id)
      deleteOpen.value = false
      emit('deleted', id)
    } catch (error) {
      deleteError.value = toAdminApiError(error).message
    } finally {
      deleteBusy.value = false
    }
  }

  const openDelete = () => {
    deleteError.value = ''
    deleteOpen.value = true
  }

  const badge = computed(() => (detail.value ? testimonialStatusBadge(detail.value.status) : null))
  const expiry = computed(() => (detail.value ? expiryInfo(detail.value) : null))
  const h3 = 'text-sm font-semibold uppercase tracking-[0.08em] text-brand-muted'
</script>

<template>
  <div>
    <AdminDialog
      :open="!!requestId"
      :title="detail ? detail.clientName : 'Solicitud de testimonio'"
      :description="detail ? detail.email : undefined"
      @close="emit('close')"
    >
      <AdminSkeleton
        v-if="isLoading"
        :rows="3"
        height-class="h-20"
        label="Cargando la solicitud…"
      />

      <AdminNotice v-else-if="loadError" tone="error" :message="loadError">
        <AdminButton v-if="requestId" @click="load(requestId)">Reintentar</AdminButton>
      </AdminNotice>

      <div v-else-if="detail" class="space-y-6">
        <AdminNotice tone="success" :message="feedback" />

        <div class="flex flex-wrap items-center gap-2">
          <AdminBadge v-if="badge" :tone="badge.tone">{{ badge.label }}</AdminBadge>
          <AdminBadge
            v-if="expiry"
            :tone="expiry.expired ? 'warning' : 'neutral'"
            :icon="expiry.expired ? 'mdi:timer-off-outline' : 'mdi:timer-sand'"
          >
            {{ expiry.label }}
          </AdminBadge>
        </div>

        <dl class="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-xs text-brand-muted">Proyecto</dt>
            <dd class="font-medium text-brand-ink">{{ detail.projectName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-brand-muted">Enviada</dt>
            <dd class="font-medium text-brand-ink">{{ formatLeadDate(detail.sentAt) }}</dd>
          </div>
          <div v-if="detail.openedAt">
            <dt class="text-xs text-brand-muted">Abierta por el cliente</dt>
            <dd class="font-medium text-brand-ink">{{ formatLeadDate(detail.openedAt) }}</dd>
          </div>
          <div v-if="detail.answeredAt">
            <dt class="text-xs text-brand-muted">Respondida</dt>
            <dd class="font-medium text-brand-ink">{{ formatLeadDate(detail.answeredAt) }}</dd>
          </div>
        </dl>

        <p
          v-if="detail.message"
          class="whitespace-pre-line rounded-xl bg-brand-surface-soft p-3 text-sm leading-6 text-brand-ink"
        >
          {{ detail.message }}
        </p>

        <section v-if="canReview(detail)" aria-labelledby="tm-review-heading" class="space-y-3">
          <h3 id="tm-review-heading" :class="h3">Revisión</h3>
          <TestimonialReviewForm
            :record="detail"
            @reviewed="(record, message) => apply(record, message)"
          />
        </section>

        <section v-if="canRenew(detail)" aria-labelledby="tm-renew-heading" class="space-y-3">
          <h3 id="tm-renew-heading" :class="h3">Enlace</h3>
          <p class="text-sm leading-6 text-brand-muted">
            Por seguridad el enlace no se puede volver a ver. Al renovarlo se crea uno nuevo, se
            reinicia el plazo (14 días), se envía otro correo y el anterior deja de servir.
          </p>
          <AdminNotice tone="error" :message="renewError" />
          <TestimonialLinkPanel v-if="renewResult" :result="renewResult" />
          <AdminButton :loading="renewBusy" loading-label="Renovando…" @click="renew">
            <Icon name="mdi:refresh" size="20" aria-hidden="true" />
            Renovar y reenviar
          </AdminButton>
        </section>

        <div
          class="flex flex-wrap items-center justify-between gap-2 border-t border-brand-border pt-4"
        >
          <AdminButton variant="danger" @click="openDelete">Eliminar solicitud</AdminButton>
          <AdminButton @click="emit('close')">Cerrar</AdminButton>
        </div>
      </div>
    </AdminDialog>

    <AdminConfirmDialog
      :open="deleteOpen"
      title="Eliminar solicitud"
      confirm-label="Eliminar solicitud"
      loading-label="Eliminando…"
      :busy="deleteBusy"
      :error="deleteError"
      @close="deleteOpen = false"
      @confirm="remove"
    >
      Se eliminará la solicitud de «{{ detail?.clientName }}» y su enlace dejará de funcionar.
      <template v-if="detail?.status === 'aprobada'">
        Su testimonio está aprobado: también dejará de aparecer en la web.
      </template>
      Esta acción no se puede deshacer.
    </AdminConfirmDialog>
  </div>
</template>
