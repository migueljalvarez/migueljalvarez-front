<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    PORTFOLIO_KIND_LABEL,
    PORTFOLIO_LIMITS,
    formatPortfolioDate,
    portfolioStateBadge,
    type PortfolioEntryRecord
  } from '~/utils/admin/portfolio'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Portafolio | Panel', robots: 'noindex, nofollow' })

  const api = useAdminApi()
  const { status, announce } = useAdminStatus()
  const flash = usePortfolioFlash()

  // El error viaja dentro de los datos para que el servidor y el navegador muestren lo mismo.
  type Loaded = { items: PortfolioEntryRecord[] | null; total: number; error: string }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-portfolio', async () => {
    try {
      const page = await api.get<{ items: PortfolioEntryRecord[]; total: number }>('portfolio', {
        limit: 100,
        offset: 0
      })
      return { items: page.items, total: page.total, error: '' }
    } catch (error) {
      return { items: null, total: 0, error: toAdminApiError(error).message }
    }
  })
  const entries = computed(() => data.value?.items ?? [])
  const loadError = computed(() => data.value?.error ?? '')
  const isLoading = computed(() => !data.value)
  const isReady = computed(() => !!data.value?.items)

  // --- Filtro por estado visible (el mismo texto que muestra la etiqueta de cada fila)
  type Filter = 'all' | 'Borrador' | 'Publicado' | 'En desarrollo'
  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'Borrador', label: 'Borradores' },
    { value: 'Publicado', label: 'Publicados' },
    { value: 'En desarrollo', label: 'En desarrollo' }
  ]
  const selected = ref<Filter>('all')
  const stateOf = (entry: PortfolioEntryRecord) => portfolioStateBadge(entry)
  const countOf = (filter: Filter) =>
    filter === 'all'
      ? entries.value.length
      : entries.value.filter(entry => stateOf(entry).label === filter).length
  const rows = computed(() =>
    selected.value === 'all'
      ? entries.value
      : entries.value.filter(entry => stateOf(entry).label === selected.value)
  )

  onMounted(() => {
    if (flash.value) {
      announce(flash.value)
      flash.value = ''
    }
  })
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Contenido del sitio"
      title="Portafolio"
      description="Los proyectos que se ven en la home y en /portafolio. Créalos, complétalos y publícalos cuando estén listos."
    >
      <template #actions>
        <AdminButton v-if="entries.length" variant="primary" to="/admin/portfolio/new">
          <Icon name="mdi:plus" size="20" aria-hidden="true" />
          Nuevo proyecto
        </AdminButton>
      </template>
    </AdminPageHeader>

    <AdminNotice tone="success" :message="status" />

    <AdminSkeleton v-if="isLoading" :rows="3" height-class="h-20" label="Cargando el portafolio…" />

    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>

    <AdminEmptyState
      v-else-if="!entries.length"
      icon="mdi:image-multiple-outline"
      title="Aún no hay proyectos"
      description="Aquí armas las fichas del portafolio: título, historia, cifras e imágenes. Se crean como borrador y no se ven en el sitio hasta que las publiques."
    >
      <AdminButton variant="primary" to="/admin/portfolio/new">
        <Icon name="mdi:plus" size="20" aria-hidden="true" />
        Crear el primer proyecto
      </AdminButton>
    </AdminEmptyState>

    <template v-else>
      <div role="group" aria-label="Filtrar por estado" class="mb-4 flex flex-wrap gap-2">
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
          {{ filter.label }} ({{ countOf(filter.value) }})
        </button>
      </div>

      <div
        v-if="rows.length"
        class="relative overflow-x-auto rounded-2xl border border-brand-border bg-brand-surface-card"
      >
        <table class="w-full min-w-176 text-left text-sm">
          <caption class="sr-only">Proyectos del portafolio</caption>
          <thead
            class="border-b border-brand-border bg-brand-surface-soft text-xs uppercase tracking-[0.08em] text-brand-muted"
          >
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Proyecto</th>
              <th scope="col" class="px-4 py-3 font-semibold">Tipo</th>
              <th scope="col" class="px-4 py-3 font-semibold">Estado</th>
              <th scope="col" class="px-4 py-3 font-semibold">Imágenes</th>
              <th scope="col" class="px-4 py-3 font-semibold">Actualizado</th>
              <th scope="col" class="px-4 py-3"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-border">
            <tr v-for="entry in rows" :key="entry.id">
              <td class="px-4 py-3">
                <p class="font-medium text-brand-ink">{{ entry.title }}</p>
                <p class="text-xs text-brand-muted">/portafolio/{{ entry.slug }}</p>
              </td>
              <td class="px-4 py-3 text-brand-muted">{{ PORTFOLIO_KIND_LABEL[entry.kind] }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap items-center gap-2">
                  <AdminBadge :tone="stateOf(entry).tone">{{ stateOf(entry).label }}</AdminBadge>
                  <AdminBadge v-if="entry.featured" tone="neutral" icon="mdi:star-outline">
                    Destacado
                  </AdminBadge>
                </div>
              </td>
              <td class="px-4 py-3 tabular-nums text-brand-muted">
                <span class="sr-only">
                  {{ entry.mediaCount }} de {{ PORTFOLIO_LIMITS.gallery }} imágenes
                </span>
                <span aria-hidden="true">
                  {{ entry.mediaCount }}/{{ PORTFOLIO_LIMITS.gallery }}
                </span>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-brand-muted">
                {{ formatPortfolioDate(entry.updatedAt) }}
              </td>
              <td class="px-4 py-3 text-right">
                <AdminButton
                  variant="ghost"
                  :to="`/admin/portfolio/${entry.id}`"
                  :aria-label="`Editar ${entry.title}`"
                >
                  Editar
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
        No hay proyectos en este estado.
        <button
          type="button"
          class="min-h-11 font-semibold text-brand-accent-text underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          @click="selected = 'all'"
        >
          Ver todos
        </button>
      </p>

      <p v-if="data && data.total > entries.length" class="mt-3 text-xs text-brand-muted">
        Se muestran {{ entries.length }} de {{ data.total }} proyectos.
      </p>
    </template>
  </div>
</template>
