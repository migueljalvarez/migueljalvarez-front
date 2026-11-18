<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import LeadDetailDialog from '~/components/admin/leads/LeadDetailDialog.vue'
  import LeadFormDialog from '~/components/admin/leads/LeadFormDialog.vue'
  import { LEAD_STATUSES } from '~/constants/admin'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    LEAD_ORIGIN_LABEL,
    LEAD_SUBJECT_LABEL,
    countLeads,
    filterLeads,
    formatLeadDate,
    formatLeadDay,
    leadStatusBadge,
    type LeadFilter,
    type LeadRecord
  } from '~/utils/admin/leads'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Leads | Panel', robots: 'noindex, nofollow' })

  const leadsApi = useAdminLeads()
  const { status, announce } = useAdminStatus()

  // El error viaja dentro de los datos para que el servidor y el navegador muestren lo mismo.
  type Loaded = { items: LeadRecord[] | null; total: number; error: string }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-leads', async () => {
    try {
      const page = await leadsApi.list()
      return { items: page.items, total: page.total, error: '' }
    } catch (error) {
      return { items: null, total: 0, error: toAdminApiError(error).message }
    }
  })
  const leads = computed(() => data.value?.items ?? [])
  const loadError = computed(() => data.value?.error ?? '')
  const isLoading = computed(() => !data.value)
  const isReady = computed(() => !!data.value?.items)

  // --- Filtros (etapa y búsqueda sobre los leads ya cargados)
  const FILTERS: { value: LeadFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    ...LEAD_STATUSES.map(item => ({ value: item.value, label: item.label }))
  ]
  const selected = ref<LeadFilter>('all')
  const search = ref('')
  const rows = computed(() => filterLeads(leads.value, selected.value, search.value))
  const clearFilters = () => {
    selected.value = 'all'
    search.value = ''
  }

  // --- Alta y detalle
  const createOpen = ref(false)
  const detailId = ref<string | null>(null)

  const onCreated = (lead: LeadRecord) => {
    createOpen.value = false
    if (data.value?.items) {
      data.value = {
        ...data.value,
        items: [lead, ...data.value.items],
        total: data.value.total + 1
      }
    }
    announce('Lead creado')
    detailId.value = lead.id
  }

  const onChanged = (lead: LeadRecord) => {
    if (!data.value?.items) return
    data.value = {
      ...data.value,
      items: data.value.items.map(item => (item.id === lead.id ? lead : item))
    }
  }

  const onDeleted = (id: string) => {
    detailId.value = null
    if (data.value?.items) {
      data.value = {
        ...data.value,
        items: data.value.items.filter(item => item.id !== id),
        total: data.value.total - 1
      }
    }
    announce('Lead eliminado')
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Leads"
      description="Posibles clientes que te escriben por el formulario o que agregas a mano, organizados por etapa."
    >
      <template #actions>
        <AdminButton variant="primary" @click="createOpen = true">
          <Icon name="mdi:plus" size="20" aria-hidden="true" />
          Nuevo lead
        </AdminButton>
      </template>
    </AdminPageHeader>

    <AdminNotice tone="success" :message="status" />

    <AdminSkeleton v-if="isLoading" :rows="4" height-class="h-16" label="Cargando los leads…" />

    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>

    <AdminEmptyState
      v-else-if="!leads.length"
      icon="mdi:inbox-outline"
      title="Aún no hay leads"
      description="Cuando alguien use el formulario de contacto aparecerá aquí. También puedes agregar a mano a quien te escriba por WhatsApp, LinkedIn o un referido."
    >
      <AdminButton variant="primary" @click="createOpen = true">
        <Icon name="mdi:plus" size="20" aria-hidden="true" />
        Agregar el primer lead
      </AdminButton>
    </AdminEmptyState>

    <template v-else>
      <div class="mb-4 w-full sm:w-72">
        <AdminInput
          id="lead-search"
          v-model="search"
          label="Buscar"
          placeholder="Nombre, correo o asunto"
        />
      </div>

      <div role="group" aria-label="Filtrar por etapa" class="mb-5 flex flex-wrap gap-2">
        <button
          v-for="filter in FILTERS"
          :key="filter.value"
          type="button"
          class="min-h-11 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          :class="
            selected === filter.value
              ? 'border-brand-accent bg-brand-accent text-brand-white'
              : 'border-brand-border bg-brand-surface-card text-brand-muted hover:bg-brand-surface-soft'
          "
          :aria-pressed="selected === filter.value"
          @click="selected = filter.value"
        >
          {{ filter.label }} ({{ countLeads(leads, filter.value) }})
        </button>
      </div>

      <div
        v-if="rows.length"
        class="relative overflow-x-auto rounded-2xl border border-brand-border bg-brand-surface-card"
      >
        <table class="w-full min-w-176 text-left text-sm">
          <caption class="sr-only">Lista de leads</caption>
          <thead
            class="border-b border-brand-border bg-brand-surface-soft text-xs uppercase tracking-[0.08em] text-brand-muted"
          >
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Nombre</th>
              <th scope="col" class="px-4 py-3 font-semibold">Asunto</th>
              <th scope="col" class="px-4 py-3 font-semibold">Origen</th>
              <th scope="col" class="px-4 py-3 font-semibold">Etapa</th>
              <th scope="col" class="px-4 py-3 font-semibold">Recibido</th>
              <th scope="col" class="px-4 py-3 font-semibold">Próxima acción</th>
              <th scope="col" class="px-4 py-3"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-border">
            <tr v-for="lead in rows" :key="lead.id">
              <td class="px-4 py-3">
                <p class="font-medium text-brand-ink">{{ lead.name }}</p>
                <p class="text-xs text-brand-muted">{{ lead.email }}</p>
              </td>
              <td class="px-4 py-3 text-brand-muted">{{ LEAD_SUBJECT_LABEL[lead.subject] }}</td>
              <td class="px-4 py-3 text-brand-muted">{{ LEAD_ORIGIN_LABEL[lead.origin] }}</td>
              <td class="px-4 py-3">
                <AdminBadge :tone="leadStatusBadge(lead.status).tone">
                  {{ leadStatusBadge(lead.status).label }}
                </AdminBadge>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-brand-muted">
                {{ formatLeadDate(lead.createdAt) }}
              </td>
              <td class="px-4 py-3 text-brand-muted">
                {{ lead.nextAction || '—' }}
                <span v-if="lead.nextActionDate" class="block text-xs">
                  {{ formatLeadDay(lead.nextActionDate) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <AdminButton
                  variant="ghost"
                  :aria-label="`Abrir ${lead.name}`"
                  @click="detailId = lead.id"
                >
                  Abrir
                </AdminButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p
        v-else
        class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-8 text-center text-sm text-brand-muted"
      >
        Ningún lead coincide con la etapa o la búsqueda.
        <button
          type="button"
          class="min-h-11 font-semibold text-brand-accent-text underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          @click="clearFilters"
        >
          Quitar filtros
        </button>
      </p>

      <p v-if="data && data.total > leads.length" class="mt-3 text-xs text-brand-muted">
        Se muestran los {{ leads.length }} más recientes de {{ data.total }} leads.
      </p>
    </template>

    <LeadFormDialog :open="createOpen" @close="createOpen = false" @saved="onCreated" />
    <LeadDetailDialog
      :lead-id="detailId"
      @close="detailId = null"
      @changed="onChanged"
      @deleted="onDeleted"
    />
  </div>
</template>
