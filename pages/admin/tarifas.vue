<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSampleBanner from '~/components/admin/AdminSampleBanner.vue'
  import { policySchema, rateSchema } from '~/utils/admin/schemas'

  definePageMeta({ layout: 'admin' })

  const store = useAdminData()
  const { data, canWrite } = store
  const { status, announce } = useAdminStatus()

  const usd = (value: number) =>
    value.toLocaleString('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

  const open = ref<'rate' | 'policy' | null>(null)
  const rateForm = useAdminForm(rateSchema, () => ({ service: '', rateUsd: '', isPublic: false }))
  const policyForm = useAdminForm(policySchema, () => ({ title: '', body: '', isPublic: true }))

  const openRate = () => {
    rateForm.reset()
    open.value = 'rate'
  }
  const openPolicy = () => {
    policyForm.reset()
    open.value = 'policy'
  }
  const submitRate = () => {
    const parsed = rateForm.validate()
    if (!parsed) return
    store.addRate(parsed)
    open.value = null
    announce('Tarifa agregada')
  }
  const submitPolicy = () => {
    const parsed = policyForm.validate()
    if (!parsed) return
    store.addPolicy(parsed)
    open.value = null
    announce('Política agregada')
  }
  const removeRate = (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar la tarifa "${name}"?`)) return
    store.removeRate(id)
    announce('Tarifa eliminada')
  }
  const removePolicy = (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar la política "${name}"?`)) return
    store.removePolicy(id)
    announce('Política eliminada')
  }
  const togglePolicy = (id: string) => {
    store.togglePolicyPublic(id)
    announce('Visibilidad actualizada')
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Políticas y tarifas"
      description='Edita los compromisos de "Cómo trabajo" y el valor de tu hora. Las tarifas son internas salvo que las marques como públicas.'
    >
      <template #actions>
        <AdminButton :disabled="!canWrite" @click="openRate">Nueva tarifa</AdminButton>
        <AdminButton variant="primary" :disabled="!canWrite" @click="openPolicy">
          Nueva política
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
              :class="rate.isPublic ? 'text-brand-success-text' : 'text-brand-helper'"
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
      <p v-else class="text-sm text-brand-helper">Sin tarifas todavía.</p>
    </section>

    <section class="mt-10" aria-labelledby="policies-heading">
      <h2 id="policies-heading" class="mb-3 text-lg font-semibold text-brand-ink">
        Políticas y compromisos
      </h2>
      <ul v-if="data.policies.length" class="space-y-3">
        <li
          v-for="policy in data.policies"
          :key="policy.id"
          class="rounded-2xl border border-brand-border bg-brand-surface-card p-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <h3 class="font-semibold text-brand-ink">{{ policy.title }}</h3>
            <span
              class="rounded-full border px-2.5 py-1 text-xs font-semibold"
              :class="
                policy.isPublic
                  ? 'border-brand-success-border bg-brand-success-bg text-brand-success-text'
                  : 'border-brand-border bg-brand-surface-soft text-brand-muted'
              "
            >
              {{ policy.isPublic ? 'Pública' : 'Interna' }}
            </span>
          </div>
          <p class="mt-2 text-sm leading-6 text-brand-muted">{{ policy.body }}</p>
          <div class="mt-3 flex gap-2">
            <AdminButton variant="ghost" :disabled="!canWrite" @click="togglePolicy(policy.id)">
              {{ policy.isPublic ? 'Hacer interna' : 'Hacer pública' }}
            </AdminButton>
            <AdminButton
              variant="danger"
              :disabled="!canWrite"
              @click="removePolicy(policy.id, policy.title)"
            >
              Eliminar
            </AdminButton>
          </div>
        </li>
      </ul>
      <p v-else class="text-sm text-brand-helper">Sin políticas todavía.</p>
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

    <AdminDialog :open="open === 'policy'" title="Nueva política" @close="open = null">
      <form class="space-y-4" novalidate @submit.prevent="submitPolicy">
        <AdminInput
          id="po-title"
          v-model="policyForm.values.title"
          label="Título"
          required
          :error="policyForm.errors.value.title"
        />
        <AdminInput
          id="po-body"
          v-model="policyForm.values.body"
          label="Texto"
          type="textarea"
          :rows="5"
          required
          :error="policyForm.errors.value.body"
        />
        <AdminInput
          id="po-public"
          v-model="policyForm.values.isPublic"
          label='Mostrar en "Cómo trabajo"'
          type="checkbox"
        />
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="open = null">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Agregar política</AdminButton>
        </div>
      </form>
    </AdminDialog>
  </div>
</template>
