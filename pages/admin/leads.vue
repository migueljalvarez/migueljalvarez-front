<script setup lang="ts">
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSampleBanner from '~/components/admin/AdminSampleBanner.vue'
  import { LEAD_STATUSES, type LeadStatus } from '~/constants/admin'
  import { SAMPLE_LEADS } from '~/constants/admin.samples'

  definePageMeta({ layout: 'admin' })

  const selected = ref<LeadStatus | 'todos'>('todos')

  const counts = computed(() =>
    Object.fromEntries(
      LEAD_STATUSES.map(status => [
        status.value,
        SAMPLE_LEADS.filter(lead => lead.status === status.value).length
      ])
    )
  )

  const rows = computed(() =>
    selected.value === 'todos'
      ? SAMPLE_LEADS
      : SAMPLE_LEADS.filter(lead => lead.status === selected.value)
  )

  const statusLabel = (value: LeadStatus) =>
    LEAD_STATUSES.find(status => status.value === value)?.label ?? value

  const tones: Record<string, string> = {
    blue: 'border-brand-blue/40 bg-brand-blue/10 text-brand-accent-text',
    amber: 'border-brand-warning-border bg-brand-warning-bg text-brand-warning-text',
    violet: 'border-violet-300 bg-violet-50 text-violet-800',
    orange: 'border-orange-300 bg-orange-50 text-orange-800',
    green: 'border-brand-success-border bg-brand-success-bg text-brand-success-text',
    gray: 'border-brand-border bg-brand-surface-soft text-brand-muted'
  }
  const toneOf = (value: LeadStatus) =>
    tones[LEAD_STATUSES.find(status => status.value === value)?.tone ?? 'gray']

  const formatDate = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Leads"
      description="Posibles clientes que te escriben por el formulario o que agregas a mano, organizados por etapa."
    >
      <template #actions>
        <button
          type="button"
          disabled
          class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-accent px-4 text-sm font-semibold text-brand-white opacity-60"
          title="Disponible cuando la base de datos esté lista"
        >
          <Icon name="mdi:plus" size="18" aria-hidden="true" />
          Nuevo lead
        </button>
      </template>
    </AdminPageHeader>
    <AdminSampleBanner />

    <div role="group" aria-label="Filtrar por etapa" class="mb-5 flex flex-wrap gap-2">
      <button
        type="button"
        class="min-h-11 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        :class="
          selected === 'todos'
            ? 'border-brand-accent bg-brand-accent text-brand-white'
            : 'border-brand-border bg-brand-surface-card text-brand-muted hover:bg-brand-surface-soft'
        "
        :aria-pressed="selected === 'todos'"
        @click="selected = 'todos'"
      >
        Todos ({{ SAMPLE_LEADS.length }})
      </button>
      <button
        v-for="status in LEAD_STATUSES"
        :key="status.value"
        type="button"
        class="min-h-11 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        :class="
          selected === status.value
            ? 'border-brand-accent bg-brand-accent text-brand-white'
            : 'border-brand-border bg-brand-surface-card text-brand-muted hover:bg-brand-surface-soft'
        "
        :aria-pressed="selected === status.value"
        @click="selected = status.value"
      >
        {{ status.label }} ({{ counts[status.value] }})
      </button>
    </div>

    <div
      v-if="rows.length"
      class="overflow-x-auto rounded-2xl border border-brand-border bg-brand-surface-card"
    >
      <table class="w-full min-w-[40rem] text-left text-sm">
        <caption class="sr-only">Lista de leads</caption>
        <thead
          class="border-b border-brand-border bg-brand-surface-soft text-xs uppercase tracking-[0.08em] text-brand-muted"
        >
          <tr>
            <th scope="col" class="px-4 py-3 font-semibold">Nombre</th>
            <th scope="col" class="px-4 py-3 font-semibold">Asunto</th>
            <th scope="col" class="px-4 py-3 font-semibold">Origen</th>
            <th scope="col" class="px-4 py-3 font-semibold">Etapa</th>
            <th scope="col" class="px-4 py-3 font-semibold">Fecha</th>
            <th scope="col" class="px-4 py-3 font-semibold">Próxima acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-border">
          <tr v-for="lead in rows" :key="lead.id">
            <td class="px-4 py-3">
              <p class="font-medium text-brand-ink">{{ lead.name }}</p>
              <p class="text-xs text-brand-muted">{{ lead.email }}</p>
            </td>
            <td class="px-4 py-3 text-brand-muted">{{ lead.subject }}</td>
            <td class="px-4 py-3 text-brand-muted">{{ lead.origin }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
                :class="toneOf(lead.status)"
              >
                {{ statusLabel(lead.status) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-brand-muted">
              {{ formatDate(lead.date) }}
            </td>
            <td class="px-4 py-3 text-brand-muted">{{ lead.nextAction ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else
      class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-8 text-center"
    >
      <Icon
        name="mdi:inbox-outline"
        size="32"
        class="mx-auto text-brand-helper"
        aria-hidden="true"
      />
      <p class="mt-3 font-semibold text-brand-ink">Aún no hay leads</p>
      <p class="mx-auto mt-1 max-w-md text-sm leading-6 text-brand-muted">
        Cuando alguien use el formulario de contacto o agregues un lead a mano, aparecerá aquí. Los
        módulos con datos reales se activan cuando la base de datos esté lista.
      </p>
    </div>
  </div>
</template>
