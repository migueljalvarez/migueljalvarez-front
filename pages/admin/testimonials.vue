<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import TestimonialDetailDialog from '~/components/admin/testimonials/TestimonialDetailDialog.vue'
  import TestimonialRequestDialog from '~/components/admin/testimonials/TestimonialRequestDialog.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import { formatLeadDate } from '~/utils/admin/leads'
  import {
    TESTIMONIAL_FILTER_OPTIONS,
    TESTIMONIAL_PAGE_SIZE,
    expiryInfo,
    pageInfo,
    testimonialStatusBadge,
    type TestimonialFilter,
    type TestimonialRecord
  } from '~/utils/admin/testimonials'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Testimonios | Panel', robots: 'noindex, nofollow' })

  const testimonialsApi = useAdminTestimonials()
  const { status, announce } = useAdminStatus()

  const selected = ref<TestimonialFilter>('all')
  const page = ref(1)

  // El error viaja dentro de los datos para que el servidor y el navegador muestren lo mismo.
  type Loaded = { items: TestimonialRecord[] | null; total: number; error: string }
  const { data, refresh } = await useLazyAsyncData<Loaded>(
    'admin-testimonials',
    async () => {
      try {
        const result = await testimonialsApi.page(selected.value, page.value)
        return { items: result.items, total: result.total, error: '' }
      } catch (error) {
        return { items: null, total: 0, error: toAdminApiError(error).message }
      }
    },
    { watch: [selected, page] }
  )
  const items = computed(() => data.value?.items ?? [])
  const total = computed(() => data.value?.total ?? 0)
  const loadError = computed(() => data.value?.error ?? '')
  const isLoading = computed(() => !data.value)
  const isReady = computed(() => !!data.value?.items)
  const paging = computed(() => pageInfo(total.value, page.value))

  const choose = (filter: TestimonialFilter) => {
    selected.value = filter
    page.value = 1
  }

  // --- Alta y detalle
  const createOpen = ref(false)
  const detailId = ref<string | null>(null)

  const onCreated = (record: TestimonialRecord) => {
    // El diálogo sigue abierto mostrando el resultado (enlace si el correo no salió).
    announce('Solicitud creada')
    // Una solicitud recién creada queda "enviada": si el filtro o la página la ocultan, se vuelve a la
    // primera página de "Todas" (el cambio dispara la carga); si no, solo se recarga la lista.
    if ((selected.value !== 'all' && selected.value !== record.status) || page.value !== 1) {
      selected.value = 'all'
      page.value = 1
    } else {
      void refresh()
    }
  }

  const onChanged = (record: TestimonialRecord) => {
    if (!data.value?.items) return
    data.value = {
      ...data.value,
      items: data.value.items.map(item => (item.id === record.id ? record : item))
    }
  }

  const onDeleted = (id: string) => {
    detailId.value = null
    announce('Solicitud eliminada')
    if (items.value.length === 1 && page.value > 1) page.value -= 1
    else if (data.value?.items) {
      data.value = {
        ...data.value,
        items: data.value.items.filter(item => item.id !== id),
        total: data.value.total - 1
      }
    }
  }

  const onDetailChanged = (record: TestimonialRecord, message: string) => {
    onChanged(record)
    announce(message)
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Testimonios"
      description="Solicita testimonios a clientes reales y apruébalos antes de que aparezcan en la web."
    >
      <template #actions>
        <AdminButton variant="primary" @click="createOpen = true">
          <Icon name="mdi:send-outline" size="20" aria-hidden="true" />
          Solicitar testimonio
        </AdminButton>
      </template>
    </AdminPageHeader>

    <AdminNotice tone="success" :message="status" />

    <div role="group" aria-label="Filtrar por estado" class="mb-5 flex flex-wrap gap-2">
      <button
        v-for="filter in TESTIMONIAL_FILTER_OPTIONS"
        :key="filter.value"
        type="button"
        class="min-h-11 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        :class="
          selected === filter.value
            ? 'border-brand-accent bg-brand-accent text-brand-white'
            : 'border-brand-border bg-brand-surface-card text-brand-muted hover:bg-brand-surface-soft'
        "
        :aria-pressed="selected === filter.value"
        @click="choose(filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>

    <AdminSkeleton
      v-if="isLoading"
      :rows="4"
      height-class="h-16"
      label="Cargando los testimonios…"
    />

    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>

    <AdminEmptyState
      v-else-if="!items.length && selected === 'all'"
      icon="mdi:message-star-outline"
      title="Aún no hay solicitudes"
      description="Cuando tengas un cliente real, solicita su testimonio: recibirá un correo con un enlace único para escribirlo y tú decides si se publica."
    >
      <AdminButton variant="primary" @click="createOpen = true">
        <Icon name="mdi:send-outline" size="20" aria-hidden="true" />
        Solicitar el primero
      </AdminButton>
    </AdminEmptyState>

    <p
      v-else-if="!items.length"
      class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-8 text-center text-sm text-brand-muted"
    >
      Ninguna solicitud está en ese estado.
      <button
        type="button"
        class="min-h-11 font-semibold text-brand-accent-text underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        @click="choose('all')"
      >
        Ver todas
      </button>
    </p>

    <template v-else>
      <div
        class="relative overflow-x-auto rounded-2xl border border-brand-border bg-brand-surface-card"
      >
        <table class="w-full min-w-176 text-left text-sm">
          <caption class="sr-only">Solicitudes de testimonio</caption>
          <thead
            class="border-b border-brand-border bg-brand-surface-soft text-xs uppercase tracking-[0.08em] text-brand-muted"
          >
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Cliente</th>
              <th scope="col" class="px-4 py-3 font-semibold">Proyecto</th>
              <th scope="col" class="px-4 py-3 font-semibold">Estado</th>
              <th scope="col" class="px-4 py-3 font-semibold">Enviada</th>
              <th scope="col" class="px-4 py-3 font-semibold">Vencimiento</th>
              <th scope="col" class="px-4 py-3"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-border">
            <tr v-for="item in items" :key="item.id">
              <td class="px-4 py-3">
                <p class="font-medium text-brand-ink">{{ item.clientName }}</p>
                <p class="text-xs text-brand-muted">{{ item.email }}</p>
              </td>
              <td class="px-4 py-3 text-brand-muted">{{ item.projectName || '—' }}</td>
              <td class="px-4 py-3">
                <AdminBadge :tone="testimonialStatusBadge(item.status).tone">
                  {{ testimonialStatusBadge(item.status).label }}
                </AdminBadge>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-brand-muted">
                {{ formatLeadDate(item.sentAt) }}
              </td>
              <td class="px-4 py-3 text-brand-muted">
                {{ expiryInfo(item)?.label ?? '—' }}
              </td>
              <td class="px-4 py-3 text-right">
                <AdminButton
                  variant="ghost"
                  :aria-label="`Abrir la solicitud de ${item.clientName}`"
                  @click="detailId = item.id"
                >
                  {{ item.status === 'respondida' ? 'Revisar' : 'Abrir' }}
                </AdminButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav
        v-if="total > TESTIMONIAL_PAGE_SIZE"
        aria-label="Paginación"
        class="mt-4 flex flex-wrap items-center justify-between gap-3"
      >
        <p class="text-sm text-brand-muted" aria-live="polite">
          Mostrando {{ paging.from }}–{{ paging.to }} de {{ total }}
        </p>
        <div class="flex gap-2">
          <AdminButton :disabled="!paging.hasPrev" @click="page -= 1">
            <Icon name="mdi:chevron-left" size="20" aria-hidden="true" />
            Anteriores
          </AdminButton>
          <AdminButton :disabled="!paging.hasNext" @click="page += 1">
            Siguientes
            <Icon name="mdi:chevron-right" size="20" aria-hidden="true" />
          </AdminButton>
        </div>
      </nav>
    </template>

    <TestimonialRequestDialog :open="createOpen" @close="createOpen = false" @created="onCreated" />
    <TestimonialDetailDialog
      :request-id="detailId"
      @close="detailId = null"
      @changed="onDetailChanged"
      @deleted="onDeleted"
    />
  </div>
</template>
