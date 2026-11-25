<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { formatDespensaDate } from '~/utils/admin/despensa'

  // «Probar conexión» con la API de Mi Despensa: muestra si la dirección y la llave responden antes de pintar la
  // lista. La llave vive en el servidor; aquí solo se ve el resultado.
  const props = defineProps<{
    state: 'checking' | 'ok' | 'error'
    message: string
    /** Hora que devolvió Mi Despensa (ISO), cuando la conexión es correcta. */
    hora: string
    simulated: boolean
  }>()
  const emit = defineEmits<{ test: [] }>()

  const horaLabel = computed(() => (props.hora ? formatDespensaDate(props.hora) : ''))
</script>

<template>
  <section
    aria-labelledby="despensa-connection-title"
    class="mb-6 rounded-2xl border border-brand-border bg-brand-surface-card p-5"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <h2 id="despensa-connection-title" class="text-base font-semibold text-brand-ink">
          Conexión con Mi Despensa
        </h2>
        <AdminBadge v-if="state === 'checking'" tone="neutral" icon="mdi:loading">
          Comprobando…
        </AdminBadge>
        <AdminBadge v-else-if="state === 'ok'" tone="success" icon="mdi:check-circle-outline">
          Conectado
        </AdminBadge>
        <AdminBadge v-else tone="warning" icon="mdi:alert-circle-outline">Sin conexión</AdminBadge>
        <AdminBadge v-if="simulated" tone="info" icon="mdi:flask-outline">
          Datos simulados (desarrollo)
        </AdminBadge>
      </div>
      <AdminButton
        :loading="state === 'checking'"
        loading-label="Comprobando…"
        @click="emit('test')"
      >
        <Icon name="mdi:connection" size="20" aria-hidden="true" />
        Probar conexión
      </AdminButton>
    </div>

    <p v-if="state === 'ok' && horaLabel" class="mt-2 text-sm text-brand-muted">
      La API respondió y la llave es correcta. Hora del servidor de Mi Despensa: {{ horaLabel }}
    </p>
    <AdminNotice tone="error" gap="top" :message="state === 'error' ? message : ''" />
  </section>
</template>
