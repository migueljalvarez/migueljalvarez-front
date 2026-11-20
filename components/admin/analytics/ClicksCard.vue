<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import ClicksRangeTabs from '~/components/admin/analytics/ClicksRangeTabs.vue'
  import ClicksTable from '~/components/admin/analytics/ClicksTable.vue'
  import NoTrackToggle from '~/components/admin/analytics/NoTrackToggle.vue'
  import {
    CLICKS_NOTE,
    DEFAULT_CLICK_RANGE,
    buttonRows,
    hasNoClickData,
    pathRows,
    sourceRows,
    type ClickRange
  } from '~/utils/admin/analytics'

  // Tarjeta «Clics por botón» del Resumen: carga por separado (esqueleto, error con reintento, estado
  // vacío sin ceros engañosos) y solo muestra conteos agregados.
  const range = ref<ClickRange>(DEFAULT_CLICK_RANGE)
  const { data, pending, refresh } = useAdminClicks(range)

  const summary = computed(() => data.value?.summary ?? null)
  const error = computed(() => data.value?.error ?? '')
  const sources = computed(() => (summary.value ? sourceRows(summary.value) : []))
  const empty = computed(() => !!summary.value && hasNoClickData(summary.value))
</script>

<template>
  <section
    class="mt-10 rounded-2xl border border-brand-border bg-brand-surface-card p-5 shadow-card md:p-6"
    aria-labelledby="clicks-heading"
    :aria-busy="pending"
  >
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h2 id="clicks-heading" class="text-lg font-semibold text-brand-ink">Clics por botón</h2>
        <p class="mt-1 text-sm leading-6 text-brand-muted">
          Cuántas veces se pulsó cada botón de contacto del sitio. Conteo anónimo y propio.
        </p>
      </div>
      <ClicksRangeTabs v-model="range" name="clicks-range" />
    </div>

    <p
      class="mt-4 flex items-start gap-2 rounded-lg bg-brand-surface-soft px-3 py-2 text-sm text-brand-muted"
    >
      <Icon
        name="mdi:information-outline"
        size="20"
        class="mt-0.5 shrink-0 text-logo-blue"
        aria-hidden="true"
      />
      {{ CLICKS_NOTE }}
    </p>

    <NoTrackToggle class="mt-3" />

    <div class="mt-5">
      <AdminSkeleton
        v-if="pending"
        :rows="1"
        height-class="h-40"
        label="Cargando clics por botón…"
      />
      <template v-else>
        <AdminNotice v-if="error" tone="error" :message="error">
          <AdminButton @click="refresh()">Reintentar</AdminButton>
        </AdminNotice>

        <AdminEmptyState
          v-else-if="empty"
          icon="mdi:cursor-default-click-outline"
          title="Todavía no hay clics"
          description="Cuando alguien pulse un botón de contacto del sitio, aquí verás cuál se usa más. Si pruebas el sitio, activa «No contar mis visitas» en este navegador."
        />

        <div v-else-if="summary" class="space-y-8">
          <ClicksTable
            caption="Clics por botón, de mayor a menor"
            label-header="Botón"
            :rows="buttonRows(summary)"
            show-percent
            :footer="{
              label: 'Formulario enviado',
              clicks: summary.formSubmitOk,
              note: 'Mensajes enviados con éxito; no es un clic, se muestra para comparar.'
            }"
          />
          <div class="grid gap-8 lg:grid-cols-2">
            <ClicksTable
              v-if="sources.length"
              caption="Clics por origen (utm_source)"
              label-header="Origen"
              :rows="sources"
              show-percent
            />
            <ClicksTable
              caption="Clics por página"
              label-header="Página"
              :rows="pathRows(summary)"
              show-percent
            />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
