<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    TEAM_LIMITS,
    copFromUsd,
    emptyPaymentForm,
    formatCop,
    formatUsd,
    localToday,
    validatePaymentForm,
    type PaymentFormValues,
    type PaymentRecord,
    type TeamMemberRecord,
    type TrmRecord
  } from '~/utils/admin/team'

  // Registro de un pago en USD. La TRM del pago arranca con la vigente y queda guardada con él (no se
  // recalcula después). El equivalente en COP lo calcula la base; aquí solo se muestra como vista previa.
  const props = defineProps<{
    open: boolean
    members: TeamMemberRecord[]
    trm: TrmRecord | null
    /** Colaborador preseleccionado (p. ej. al pagar desde su tarjeta). */
    memberId?: string
  }>()
  const emit = defineEmits<{ close: []; saved: [payment: PaymentRecord] }>()

  const api = useAdminTeam()
  const values = reactive<PaymentFormValues>(emptyPaymentForm('', null))
  const errors = ref<Record<string, string>>({})
  const saveError = ref('')
  const isSaving = ref(false)

  const memberOptions = computed(() =>
    props.members.map(member => ({
      value: member.id,
      label: member.active ? member.name : `${member.name} (inactivo)`
    }))
  )
  const member = computed(() => props.members.find(item => item.id === values.memberId))

  watch(
    () => props.open,
    open => {
      if (!open) return
      Object.assign(values, emptyPaymentForm(localToday(), props.trm), {
        memberId: props.memberId ?? ''
      })
      errors.value = {}
      saveError.value = ''
    },
    { immediate: true }
  )

  const copPreview = computed(() => {
    const usd = Number(values.amountUsd)
    const trm = Number(values.trm)
    return usd > 0 && trm > 0 ? formatCop(copFromUsd(usd, trm)) : ''
  })

  const submit = async () => {
    saveError.value = ''
    const result = validatePaymentForm(values)
    if (!result.ok) {
      errors.value = result.errors
      await nextTick()
      document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
      return
    }
    errors.value = {}
    isSaving.value = true
    try {
      emit('saved', await api.createPayment(result.data))
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
    title="Registrar pago"
    description="El monto se guarda en USD junto con la TRM usada. Un pago registrado no se puede editar."
    @close="emit('close')"
  >
    <form class="space-y-4" novalidate @submit.prevent="submit">
      <AdminInput
        id="payment-member"
        v-model="values.memberId"
        label="Colaborador"
        type="select"
        :options="memberOptions"
        required
        :hint="member ? `Por pagar hoy: ${formatUsd(member.dueUsd)}` : undefined"
        :error="errors.memberId"
      />
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminInput
          id="payment-amount"
          v-model="values.amountUsd"
          label="Monto (USD)"
          type="number"
          step="0.01"
          required
          :error="errors.amountUsd"
        />
        <AdminInput
          id="payment-date"
          v-model="values.paidOn"
          label="Fecha del pago"
          type="date"
          required
          :error="errors.paidOn"
        />
      </div>
      <AdminInput
        id="payment-trm"
        v-model="values.trm"
        label="TRM de este pago (COP por USD)"
        type="number"
        step="0.01"
        :hint="
          trm
            ? 'Sugerida: la TRM vigente. Cámbiala si pagaste con otra.'
            : 'Si la dejas vacía se usa la TRM vigente a la fecha del pago; si no hay ninguna, registra una antes.'
        "
        :error="errors.trm"
      />
      <p
        v-if="copPreview"
        role="status"
        class="rounded-xl bg-brand-surface-soft p-3 text-sm text-brand-muted"
      >
        Equivale a
        <strong class="tabular-nums text-brand-ink">{{ copPreview }}</strong>
      </p>
      <AdminInput
        id="payment-note"
        v-model="values.note"
        label="Nota (opcional)"
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
          Registrar pago
        </AdminButton>
      </AdminDialogActions>
    </form>
  </AdminDialog>
</template>
