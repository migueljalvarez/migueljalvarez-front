<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    emptyRateForm,
    rateFormFromRecord,
    rateSchema,
    type RateRecord
  } from '~/utils/admin/rates'
  import { listAllAdminPages } from '~/utils/admin/pagination'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Tarifas | Panel', robots: 'noindex, nofollow' })

  const api = useAdminRates()
  const { status, announce } = useAdminStatus()
  type Loaded = { items: RateRecord[] | null; total: number; error: string }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-rates', async () => {
    try {
      const items = await listAllAdminPages<RateRecord>(query => api.list(query))
      return { items, total: items.length, error: '' }
    } catch (error) {
      return { items: null, total: 0, error: toAdminApiError(error).message }
    }
  })

  const rates = computed(() => data.value?.items ?? [])
  const loading = computed(() => !data.value)
  const loadError = computed(() => data.value?.error ?? '')
  const isReady = computed(() => data.value?.items !== null && data.value?.items !== undefined)
  const usd = (value: number) =>
    value.toLocaleString('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

  const dialogOpen = ref(false)
  const editing = ref<RateRecord | null>(null)
  const saving = ref(false)
  const formError = ref('')
  const form = useAdminForm(rateSchema, emptyRateForm)
  const removal = reactive({ open: false, item: null as RateRecord | null, busy: false, error: '' })

  const openForm = (item: RateRecord | null = null) => {
    editing.value = item
    form.reset()
    if (item) Object.assign(form.values, rateFormFromRecord(item))
    formError.value = ''
    dialogOpen.value = true
  }

  const save = async () => {
    const payload = form.validate()
    if (!payload) return
    saving.value = true
    formError.value = ''
    try {
      if (editing.value) await api.update(editing.value.id, payload)
      else await api.create(payload)
      dialogOpen.value = false
      await refresh()
      announce(editing.value ? 'Tarifa actualizada' : 'Tarifa creada')
    } catch (error) {
      formError.value = toAdminApiError(error).message
    } finally {
      saving.value = false
    }
  }

  const remove = async () => {
    if (!removal.item) return
    removal.busy = true
    removal.error = ''
    try {
      await api.remove(removal.item.id)
      removal.open = false
      announce('Tarifa eliminada')
      await refresh()
    } catch (error) {
      removal.error = toAdminApiError(error).message
    } finally {
      removal.busy = false
    }
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Tarifas"
      description="El valor de tu hora por tipo de servicio. Las tarifas son privadas; los acuerdos de trabajo están en Políticas."
    >
      <template #actions>
        <AdminButton variant="primary" @click="openForm()">
          <Icon name="mdi:plus" size="20" aria-hidden="true" />
          Nueva tarifa
        </AdminButton>
      </template>
    </AdminPageHeader>

    <AdminNotice :message="status" />
    <AdminSkeleton v-if="loading" :rows="3" height-class="h-16" label="Cargando las tarifas…" />
    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>
    <AdminEmptyState
      v-else-if="!rates.length"
      icon="mdi:cash-multiple"
      title="Aún no hay tarifas"
      description="Agrega el valor por hora de cada servicio para tenerlo disponible al preparar tus propuestas."
    >
      <AdminButton variant="primary" @click="openForm()">Agregar la primera tarifa</AdminButton>
    </AdminEmptyState>
    <section v-else aria-labelledby="rates-heading">
      <h2 id="rates-heading" class="sr-only">Tarifas registradas</h2>
      <p v-if="data && data.total > rates.length" class="mb-3 text-sm text-brand-muted">
        Se muestran {{ rates.length }} de {{ data.total }} tarifas.
      </p>
      <ul
        class="divide-y divide-brand-border rounded-2xl border border-brand-border bg-brand-surface-card"
      >
        <li
          v-for="rate in rates"
          :key="rate.id"
          class="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        >
          <div class="min-w-0">
            <p class="font-medium text-brand-ink">{{ rate.service }}</p>
            <p class="text-sm text-brand-muted">
              {{ rate.isPublic ? 'Marcada como pública (sin publicación activa)' : 'Privada' }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <p class="mr-2 font-semibold tabular-nums text-brand-ink">{{ usd(rate.rateUsd) }}/h</p>
            <AdminButton @click="openForm(rate)">Editar</AdminButton>
            <AdminButton
              variant="danger"
              @click="Object.assign(removal, { open: true, item: rate, error: '' })"
            >
              Eliminar
            </AdminButton>
          </div>
        </li>
      </ul>
    </section>

    <AdminDialog
      :open="dialogOpen"
      :title="editing ? 'Editar tarifa' : 'Nueva tarifa'"
      description="Valor por hora en USD."
      @close="dialogOpen = false"
    >
      <form class="space-y-4" novalidate @submit.prevent="save">
        <AdminNotice tone="error" :message="formError" />
        <AdminInput
          id="rate-service"
          v-model="form.values.service"
          label="Servicio"
          required
          maxlength="120"
          :error="form.errors.value.service"
        />
        <AdminInput
          id="rate-value"
          v-model="form.values.rateUsd"
          label="Valor por hora (USD)"
          type="number"
          step="0.01"
          required
          :error="form.errors.value.rateUsd"
        />
        <AdminInput
          id="rate-public"
          v-model="form.values.isPublic"
          label="Marcar como pública"
          type="checkbox"
          hint="La API guarda esta preferencia, pero las tarifas todavía no se muestran en la web."
        />
        <AdminDialogActions>
          <AdminButton :disabled="saving" @click="dialogOpen = false">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary" :loading="saving" loading-label="Guardando…">
            {{ editing ? 'Guardar cambios' : 'Agregar tarifa' }}
          </AdminButton>
        </AdminDialogActions>
      </form>
    </AdminDialog>

    <AdminConfirmDialog
      :open="removal.open"
      title="Eliminar tarifa"
      confirm-label="Eliminar tarifa"
      :busy="removal.busy"
      :error="removal.error"
      @close="removal.open = false"
      @confirm="remove"
    >
      La tarifa «{{ removal.item?.service }}» se eliminará. Los proyectos conservan la tarifa que ya
      tienen registrada.
    </AdminConfirmDialog>
  </div>
</template>
