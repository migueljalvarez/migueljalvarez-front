<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSampleBanner from '~/components/admin/AdminSampleBanner.vue'
  import { rateSchema } from '~/utils/admin/schemas'

  definePageMeta({ layout: 'admin' })

  const store = useAdminData()
  const { data, canWrite } = store
  const { status, announce } = useAdminStatus()

  const usd = (value: number) =>
    value.toLocaleString('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

  const open = ref<'rate' | null>(null)
  const rateForm = useAdminForm(rateSchema, () => ({ service: '', rateUsd: '', isPublic: false }))

  const openRate = () => {
    rateForm.reset()
    open.value = 'rate'
  }
  const submitRate = () => {
    const parsed = rateForm.validate()
    if (!parsed) return
    store.addRate(parsed)
    open.value = null
    announce('Tarifa agregada')
  }
  const removeRate = (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar la tarifa "${name}"?`)) return
    store.removeRate(id)
    announce('Tarifa eliminada')
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Tarifas"
      description="El valor de tu hora por tipo de servicio. Son internas salvo que las marques como públicas. Los acuerdos de trabajo están en Políticas."
    >
      <template #actions>
        <AdminButton variant="primary" :disabled="!canWrite" @click="openRate">
          Nueva tarifa
        </AdminButton>
      </template>
    </AdminPageHeader>
    <AdminSampleBanner />

    <p
      v-if="status"
      role="status"
      class="mb-4 rounded-lg bg-brand-success-bg px-3 py-2 text-sm font-medium text-brand-success-text"
    >
      {{ status }}
    </p>

    <section aria-labelledby="rates-heading">
      <h2 id="rates-heading" class="mb-3 text-lg font-semibold text-brand-ink">Tarifas (USD)</h2>
      <ul
        v-if="data.rates.length"
        class="divide-y divide-brand-border rounded-2xl border border-brand-border bg-brand-surface-card"
      >
        <li
          v-for="rate in data.rates"
          :key="rate.id"
          class="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        >
          <div>
            <p class="font-medium text-brand-ink">{{ rate.service }}</p>
            <p
              class="text-xs"
              :class="rate.isPublic ? 'text-brand-success-text' : 'text-brand-muted'"
            >
              {{ rate.isPublic ? 'Se muestra en el sitio' : 'Interna' }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <p class="font-semibold text-brand-ink">{{ usd(rate.rateUsd) }}/h</p>
            <AdminButton
              variant="danger"
              :disabled="!canWrite"
              @click="removeRate(rate.id, rate.service)"
            >
              Eliminar
            </AdminButton>
          </div>
        </li>
      </ul>
      <p v-else class="text-sm text-brand-muted">Sin tarifas todavía.</p>
    </section>

    <AdminDialog
      :open="open === 'rate'"
      title="Nueva tarifa"
      description="Valor por hora en USD."
      @close="open = null"
    >
      <form class="space-y-4" novalidate @submit.prevent="submitRate">
        <AdminInput
          id="rt-service"
          v-model="rateForm.values.service"
          label="Servicio"
          required
          :error="rateForm.errors.value.service"
        />
        <AdminInput
          id="rt-rate"
          v-model="rateForm.values.rateUsd"
          label="Valor por hora (USD)"
          type="number"
          step="0.5"
          required
          :error="rateForm.errors.value.rateUsd"
        />
        <AdminInput
          id="rt-public"
          v-model="rateForm.values.isPublic"
          label="Mostrar en el sitio"
          type="checkbox"
          hint="Déjalo desmarcado para mantenerla interna."
        />
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="open = null">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Agregar tarifa</AdminButton>
        </div>
      </form>
    </AdminDialog>
  </div>
</template>
