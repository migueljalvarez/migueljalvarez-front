<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import DespensaConnectionCard from '~/components/admin/despensa/DespensaConnectionCard.vue'
  import DespensaCounters from '~/components/admin/despensa/DespensaCounters.vue'
  import DespensaFeedbackList from '~/components/admin/despensa/DespensaFeedbackList.vue'
  import {
    DESPENSA_FILTER_OPTIONS,
    despensaOffset,
    despensaPaging,
    type DespensaFilter
  } from '~/utils/admin/despensa'
  import type { DespensaFeedbackPage } from '~/utils/despensa'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Comentarios | Panel', robots: 'noindex, nofollow' })

  // Comentarios de los usuarios de Mi Despensa (solo lectura). Primero se prueba la conexión (GET /ping de su API,
  // llamado desde el servidor del sitio); solo si responde se carga la lista.
  const despensa = useAdminDespensa()

  const connection = ref<'checking' | 'ok' | 'error'>('checking')
  const connectionMessage = ref('')
  const hora = ref('')
  const simulated = ref(false)

  const filter = ref<DespensaFilter>('all')
  const page = ref(1)
  const list = ref<DespensaFeedbackPage | null>(null)
  const listLoading = ref(false)
  const listError = ref('')

  const paging = computed(() => despensaPaging(list.value?.total ?? 0, page.value))

  const loadList = async () => {
    listLoading.value = true
    listError.value = ''
    const result = await despensa.feedback(
      filter.value === 'all' ? undefined : filter.value,
      despensaOffset(page.value)
    )
    listLoading.value = false
    if (result.ok) {
      list.value = result.page
      simulated.value = result.simulated === true
    } else {
      list.value = null
      listError.value = result.message
    }
  }

  const testConnection = async () => {
    connection.value = 'checking'
    connectionMessage.value = ''
    const result = await despensa.ping()
    if (!result.ok) {
      connection.value = 'error'
      connectionMessage.value = result.message
      list.value = null
      return
    }
    connection.value = 'ok'
    hora.value = result.ping.hora
    simulated.value = result.simulated
    await loadList()
  }

  const choose = (value: DespensaFilter) => {
    filter.value = value
    page.value = 1
  }

  watch([filter, page], () => {
    if (connection.value === 'ok') void loadList()
  })

  onMounted(testConnection)

  const summary = computed(() => {
    if (!list.value) return ''
    const { from, to } = paging.value
    return list.value.total === 0
      ? 'Sin resultados'
      : `Mostrando ${from}–${to} de ${list.value.total}`
  })
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Mi Despensa"
      title="Comentarios"
      description="Lo que escriben los usuarios de la app Mi Despensa: ideas, problemas y otros comentarios. Solo lectura."
    />

    <DespensaConnectionCard
      :state="connection"
      :message="connectionMessage"
      :hora="hora"
      :simulated="simulated"
      @test="testConnection"
    />

    <template v-if="connection === 'ok'">
      <DespensaCounters v-if="list" :por-tipo="list.porTipo" />

      <div role="group" aria-label="Filtrar por tipo" class="mb-5 flex flex-wrap gap-2">
        <button
          v-for="option in DESPENSA_FILTER_OPTIONS"
          :key="option.value"
          type="button"
          class="min-h-11 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          :class="
            filter === option.value
              ? 'border-brand-accent bg-brand-accent text-brand-white'
              : 'border-brand-border bg-brand-surface-card text-brand-muted hover:bg-brand-surface-soft'
          "
          :aria-pressed="filter === option.value"
          @click="choose(option.value)"
        >
          {{ option.label }}
        </button>
      </div>

      <AdminSkeleton
        v-if="listLoading && !list"
        :rows="4"
        height-class="h-24"
        label="Cargando los comentarios…"
      />

      <AdminNotice v-else-if="listError" tone="error" :message="listError">
        <AdminButton @click="loadList()">Reintentar</AdminButton>
      </AdminNotice>

      <template v-else-if="list">
        <AdminEmptyState
          v-if="!list.items.length"
          icon="mdi:message-text-outline"
          :title="filter === 'all' ? 'Aún no hay comentarios' : 'Ningún comentario de ese tipo'"
          :description="
            filter === 'all'
              ? 'Cuando los usuarios envíen ideas o problemas desde la app, aparecerán aquí.'
              : 'Prueba con otro tipo o vuelve a Todos.'
          "
        >
          <AdminButton v-if="filter !== 'all'" @click="choose('all')">Ver todos</AdminButton>
        </AdminEmptyState>

        <template v-else>
          <p class="mb-3 text-sm text-brand-muted" aria-live="polite">{{ summary }}</p>
          <div :class="listLoading ? 'opacity-60 transition-opacity' : ''" :aria-busy="listLoading">
            <DespensaFeedbackList :items="list.items" />
          </div>

          <nav
            v-if="list.total > list.limit"
            aria-label="Paginación"
            class="mt-4 flex flex-wrap items-center justify-between gap-3"
          >
            <p class="text-sm text-brand-muted">Página {{ paging.page }} de {{ paging.pages }}</p>
            <div class="flex gap-2">
              <AdminButton :disabled="!paging.hasPrev || listLoading" @click="page -= 1">
                <Icon name="mdi:chevron-left" size="20" aria-hidden="true" />
                Anteriores
              </AdminButton>
              <AdminButton :disabled="!paging.hasNext || listLoading" @click="page += 1">
                Siguientes
                <Icon name="mdi:chevron-right" size="20" aria-hidden="true" />
              </AdminButton>
            </div>
          </nav>
        </template>
      </template>
    </template>
  </div>
</template>
