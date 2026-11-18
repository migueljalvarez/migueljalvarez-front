<script setup lang="ts">
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSampleBanner from '~/components/admin/AdminSampleBanner.vue'
  import { LEAD_STATUSES, type LeadStatus } from '~/constants/admin'
  import type { Lead } from '~/types/admin'
  import { LEAD_ORIGINS, LEAD_SUBJECTS, leadSchema } from '~/utils/admin/schemas'

  definePageMeta({ layout: 'admin' })

  const store = useAdminData()
  const { data, canWrite } = store

  const subjectOptions = LEAD_SUBJECTS.map(value => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }))
  const originOptions = LEAD_ORIGINS.map(value => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }))
  const statusOptions = LEAD_STATUSES.map(status => ({ value: status.value, label: status.label }))

  // --- Filtros
  const selected = ref<LeadStatus | 'todos'>('todos')
  const search = ref('')
  const counts = computed(() =>
    Object.fromEntries(
      LEAD_STATUSES.map(status => [
        status.value,
        data.value.leads.filter(lead => lead.status === status.value).length
      ])
    )
  )
  const rows = computed(() =>
    data.value.leads.filter(
      lead =>
        (selected.value === 'todos' || lead.status === selected.value) &&
        (!search.value.trim() ||
          `${lead.name} ${lead.email} ${lead.subject}`
            .toLowerCase()
            .includes(search.value.trim().toLowerCase()))
    )
  )

  // --- Nuevo lead
  const createOpen = ref(false)
  const createForm = useAdminForm(leadSchema, () => ({
    name: '',
    email: '',
    phone: '',
    subject: '',
    origin: 'referido',
    message: '',
    nextAction: '',
    nextActionDate: ''
  }))
  const openCreate = () => {
    createForm.reset()
    createOpen.value = true
  }
  const submitCreate = () => {
    const parsed = createForm.validate()
    if (!parsed) return
    store.addLead(parsed)
    createOpen.value = false
    announce('Lead creado')
  }

  // --- Detalle
  const detailId = ref<string | null>(null)
  const detail = computed<Lead | null>(
    () => data.value.leads.find(lead => lead.id === detailId.value) ?? null
  )
  const lostReason = ref('')
  const lostError = ref('')
  const noteText = ref('')
  const noteError = ref('')
  const actionText = ref('')
  const actionDate = ref('')

  const openDetail = (lead: Lead) => {
    detailId.value = lead.id
    lostReason.value = lead.lostReason
    lostError.value = ''
    noteText.value = ''
    noteError.value = ''
    actionText.value = lead.nextAction
    actionDate.value = lead.nextActionDate
  }
  const changeStatus = (value: string | number | boolean) => {
    if (!detail.value) return
    const status = String(value) as LeadStatus
    if (status === 'perdido' && !lostReason.value.trim()) {
      detail.value.status = 'perdido'
      lostError.value = 'Indica el motivo para marcarlo como perdido'
      return
    }
    lostError.value = ''
    store.setLeadStatus(detail.value.id, status, lostReason.value.trim())
    announce(`Etapa actualizada: ${LEAD_STATUSES.find(item => item.value === status)?.label}`)
  }
  const saveLostReason = () => {
    if (!detail.value) return
    if (!lostReason.value.trim()) {
      lostError.value = 'Indica el motivo para marcarlo como perdido'
      return
    }
    lostError.value = ''
    store.setLeadStatus(detail.value.id, 'perdido', lostReason.value.trim())
    announce('Motivo guardado')
  }
  const saveAction = () => {
    if (!detail.value) return
    store.updateLeadAction(detail.value.id, actionText.value.trim(), actionDate.value)
    announce('Próxima acción guardada')
  }
  const saveNote = () => {
    if (!detail.value) return
    if (!noteText.value.trim()) {
      noteError.value = 'Escribe la nota'
      return
    }
    noteError.value = ''
    store.addLeadNote(detail.value.id, noteText.value.trim())
    noteText.value = ''
    announce('Nota agregada')
  }
  const deleteLead = () => {
    if (!detail.value) return
    if (
      !window.confirm(`¿Eliminar el lead "${detail.value.name}"? Esta acción no se puede deshacer.`)
    )
      return
    store.removeLead(detail.value.id)
    detailId.value = null
    announce('Lead eliminado')
  }

  // --- Presentación
  const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
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
    iso
      ? new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
      : '—'

  // Aviso para lectores de pantalla y confirmación visual
  const status = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined
  const announce = (message: string) => {
    status.value = message
    clearTimeout(timer)
    timer = setTimeout(() => (status.value = ''), 3500)
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
        <button
          type="button"
          :disabled="!canWrite"
          class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-accent px-4 text-sm font-semibold text-brand-white transition hover:bg-brand-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-60"
          :title="canWrite ? undefined : 'Disponible cuando la API esté conectada'"
          @click="openCreate"
        >
          <Icon name="mdi:plus" size="18" aria-hidden="true" />
          Nuevo lead
        </button>
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

    <div class="mb-4 flex flex-wrap items-end gap-3">
      <div class="w-full sm:w-72">
        <AdminInput
          id="lead-search"
          v-model="search"
          label="Buscar"
          placeholder="Nombre, correo o asunto"
        />
      </div>
    </div>

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
        Todos ({{ data.leads.length }})
      </button>
      <button
        v-for="item in LEAD_STATUSES"
        :key="item.value"
        type="button"
        class="min-h-11 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        :class="
          selected === item.value
            ? 'border-brand-accent bg-brand-accent text-brand-white'
            : 'border-brand-border bg-brand-surface-card text-brand-muted hover:bg-brand-surface-soft'
        "
        :aria-pressed="selected === item.value"
        @click="selected = item.value"
      >
        {{ item.label }} ({{ counts[item.value] }})
      </button>
    </div>

    <div
      v-if="rows.length"
      class="overflow-x-auto rounded-2xl border border-brand-border bg-brand-surface-card"
    >
      <table class="w-full min-w-[44rem] text-left text-sm">
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
            <th scope="col" class="px-4 py-3"><span class="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-border">
          <tr v-for="lead in rows" :key="lead.id">
            <td class="px-4 py-3">
              <p class="font-medium text-brand-ink">{{ lead.name }}</p>
              <p class="text-xs text-brand-muted">{{ lead.email }}</p>
            </td>
            <td class="px-4 py-3 text-brand-muted">{{ label(lead.subject) }}</td>
            <td class="px-4 py-3 text-brand-muted">{{ label(lead.origin) }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
                :class="toneOf(lead.status)"
              >
                {{ statusLabel(lead.status) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-brand-muted">
              {{ formatDate(lead.createdAt) }}
            </td>
            <td class="px-4 py-3 text-brand-muted">
              {{ lead.nextAction || '—' }}
              <span v-if="lead.nextActionDate" class="block text-xs">
                {{ formatDate(lead.nextActionDate) }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="min-h-11 rounded-lg px-3 text-sm font-semibold text-brand-accent-text hover:bg-brand-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                :aria-label="`Abrir ${lead.name}`"
                @click="openDetail(lead)"
              >
                Abrir
              </button>
            </td>
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
      <p class="mt-3 font-semibold text-brand-ink">
        {{ data.leads.length ? 'Ningún lead coincide con el filtro' : 'Aún no hay leads' }}
      </p>
      <p class="mx-auto mt-1 max-w-md text-sm leading-6 text-brand-muted">
        {{
          data.leads.length
            ? 'Prueba con otra etapa o cambia la búsqueda.'
            : 'Cuando alguien use el formulario de contacto o agregues un lead a mano, aparecerá aquí.'
        }}
      </p>
    </div>

    <!-- Nuevo lead -->
    <AdminDialog
      :open="createOpen"
      title="Nuevo lead"
      description="Agrega un posible cliente que llegó por otro canal."
      @close="createOpen = false"
    >
      <form class="space-y-4" novalidate @submit.prevent="submitCreate">
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminInput
            id="new-name"
            v-model="createForm.values.name"
            label="Nombre"
            required
            :error="createForm.errors.value.name"
          />
          <AdminInput
            id="new-email"
            v-model="createForm.values.email"
            label="Correo"
            type="email"
            required
            :error="createForm.errors.value.email"
          />
          <AdminInput
            id="new-phone"
            v-model="createForm.values.phone"
            label="Teléfono o WhatsApp"
            :error="createForm.errors.value.phone"
          />
          <AdminInput
            id="new-origin"
            v-model="createForm.values.origin"
            label="Origen"
            type="select"
            :options="originOptions"
            required
            :error="createForm.errors.value.origin"
          />
          <AdminInput
            id="new-subject"
            v-model="createForm.values.subject"
            label="Asunto"
            type="select"
            :options="subjectOptions"
            required
            :error="createForm.errors.value.subject"
          />
          <AdminInput
            id="new-date"
            v-model="createForm.values.nextActionDate"
            label="Fecha de la próxima acción"
            type="date"
            :error="createForm.errors.value.nextActionDate"
          />
        </div>
        <AdminInput
          id="new-action"
          v-model="createForm.values.nextAction"
          label="Próxima acción"
          placeholder="Ej.: llamar para entender el alcance"
          :error="createForm.errors.value.nextAction"
        />
        <AdminInput
          id="new-message"
          v-model="createForm.values.message"
          label="Mensaje o contexto"
          type="textarea"
          :rows="4"
          :error="createForm.errors.value.message"
        />
        <div class="flex flex-wrap justify-end gap-3 pt-2">
          <button
            type="button"
            class="min-h-11 rounded-lg border border-brand-border px-4 text-sm font-semibold text-brand-muted hover:bg-brand-surface-soft"
            @click="createOpen = false"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="min-h-11 rounded-lg bg-brand-accent px-5 text-sm font-semibold text-brand-white hover:bg-brand-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Crear lead
          </button>
        </div>
      </form>
    </AdminDialog>

    <!-- Detalle del lead -->
    <AdminDialog
      :open="!!detail"
      :title="detail ? detail.name : 'Lead'"
      :description="
        detail ? `${detail.email} · ${label(detail.origin)} · ${label(detail.subject)}` : ''
      "
      @close="detailId = null"
    >
      <div v-if="detail" class="space-y-6">
        <p
          v-if="detail.message"
          class="rounded-xl bg-brand-surface-soft p-3 text-sm leading-6 text-brand-muted"
        >
          {{ detail.message }}
        </p>

        <section aria-labelledby="stage-heading" class="space-y-3">
          <h3
            id="stage-heading"
            class="text-sm font-semibold uppercase tracking-[0.08em] text-brand-muted"
          >
            Etapa
          </h3>
          <AdminInput
            id="lead-status"
            :model-value="detail.status"
            label="Etapa del pipeline"
            type="select"
            :options="statusOptions"
            @update:model-value="changeStatus"
          />
          <div v-if="detail.status === 'perdido'" class="space-y-2">
            <AdminInput
              id="lead-lost"
              v-model="lostReason"
              label="Motivo por el que se perdió"
              required
              :error="lostError"
            />
            <button
              type="button"
              class="min-h-11 rounded-lg border border-brand-border px-4 text-sm font-semibold text-brand-ink hover:bg-brand-surface-soft"
              @click="saveLostReason"
            >
              Guardar motivo
            </button>
          </div>
          <div
            v-if="detail.status === 'ganado'"
            class="flex flex-wrap items-center gap-3 rounded-xl bg-brand-success-bg p-3 text-sm text-brand-success-text"
          >
            <span>Lead ganado: conviértelo en cliente y proyecto.</span>
            <NuxtLink to="/admin/proyectos" class="font-semibold underline">
              Ir a proyectos
            </NuxtLink>
          </div>
        </section>

        <section aria-labelledby="action-heading" class="space-y-3">
          <h3
            id="action-heading"
            class="text-sm font-semibold uppercase tracking-[0.08em] text-brand-muted"
          >
            Próxima acción
          </h3>
          <div class="grid gap-3 sm:grid-cols-[1fr_11rem]">
            <AdminInput id="lead-action" v-model="actionText" label="Qué hacer" />
            <AdminInput id="lead-action-date" v-model="actionDate" label="Fecha" type="date" />
          </div>
          <button
            type="button"
            class="min-h-11 rounded-lg border border-brand-border px-4 text-sm font-semibold text-brand-ink hover:bg-brand-surface-soft"
            @click="saveAction"
          >
            Guardar acción
          </button>
        </section>

        <section aria-labelledby="notes-heading" class="space-y-3">
          <h3
            id="notes-heading"
            class="text-sm font-semibold uppercase tracking-[0.08em] text-brand-muted"
          >
            Notas e historial
          </h3>
          <AdminInput
            id="lead-note"
            v-model="noteText"
            label="Nueva nota"
            type="textarea"
            :rows="2"
            :error="noteError"
          />
          <button
            type="button"
            class="min-h-11 rounded-lg bg-brand-accent px-4 text-sm font-semibold text-brand-white hover:bg-brand-mid"
            @click="saveNote"
          >
            Agregar nota
          </button>
          <ul v-if="detail.notes.length" class="space-y-2">
            <li
              v-for="note in detail.notes"
              :key="note.id"
              class="rounded-xl border border-brand-border p-3 text-sm"
            >
              <p class="text-brand-ink">{{ note.text }}</p>
              <p class="mt-1 text-xs text-brand-muted">{{ formatDate(note.at) }}</p>
            </li>
          </ul>
          <p v-else class="text-sm text-brand-muted">Aún no hay notas.</p>
        </section>

        <div class="flex justify-between border-t border-brand-border pt-4">
          <button
            type="button"
            class="min-h-11 rounded-lg px-3 text-sm font-semibold text-brand-error-text hover:bg-brand-error-bg"
            @click="deleteLead"
          >
            Eliminar lead
          </button>
          <button
            type="button"
            class="min-h-11 rounded-lg border border-brand-border px-4 text-sm font-semibold text-brand-muted hover:bg-brand-surface-soft"
            @click="detailId = null"
          >
            Cerrar
          </button>
        </div>
      </div>
    </AdminDialog>
  </div>
</template>
