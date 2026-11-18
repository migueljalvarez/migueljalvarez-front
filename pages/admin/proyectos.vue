<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSampleBanner from '~/components/admin/AdminSampleBanner.vue'
  import { PROJECT_STATUSES, clientSchema, projectSchema } from '~/utils/admin/schemas'

  definePageMeta({ layout: 'admin' })

  const store = useAdminData()
  const { data, canWrite } = store
  const { status, announce } = useAdminStatus()

  const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')
  const statusOptions = PROJECT_STATUSES.map(value => ({ value, label: label(value) }))
  const clientOptions = computed(() =>
    data.value.clients.map(client => ({ value: client.id, label: client.name }))
  )
  const today = () => new Date().toISOString().slice(0, 10)

  const formatDate = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

  // Indicador de deadline: vencido, cercano (≤14 días) o en plazo.
  const deadlineInfo = (iso: string, projectStatus: string) => {
    if (projectStatus === 'entregado') return { text: 'Entregado', tone: 'text-brand-success-text' }
    const days = Math.round((new Date(`${iso}T12:00:00`).getTime() - Date.now()) / 86_400_000)
    if (days < 0) return { text: `Vencido hace ${-days} d`, tone: 'text-brand-error-text' }
    if (days <= 14) return { text: `Faltan ${days} d`, tone: 'text-brand-warning-text' }
    return { text: `Faltan ${days} d`, tone: 'text-brand-muted' }
  }

  // Cliente
  const clientOpen = ref(false)
  const clientForm = useAdminForm(clientSchema, () => ({
    name: '',
    email: '',
    company: '',
    notes: ''
  }))
  const openClient = () => {
    clientForm.reset()
    clientOpen.value = true
  }
  const submitClient = () => {
    const parsed = clientForm.validate()
    if (!parsed) return
    store.addClient(parsed)
    clientOpen.value = false
    announce('Cliente creado')
  }

  // Proyecto
  const projectOpen = ref(false)
  const projectForm = useAdminForm(projectSchema, () => ({
    name: '',
    clientId: '',
    status: 'planificado',
    rateUsd: '',
    budgetHours: '',
    startDate: today(),
    deadline: '',
    publishable: false
  }))
  const openProject = () => {
    projectForm.reset()
    projectOpen.value = true
  }
  const submitProject = () => {
    const parsed = projectForm.validate()
    if (!parsed) return
    store.addProject(parsed)
    projectOpen.value = false
    announce('Proyecto creado')
  }
  const changeStatus = (id: string, value: string | number | boolean) => {
    store.setProjectStatus(id, String(value))
    announce('Estado actualizado')
  }
  const deleteProject = (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar el proyecto "${name}"?`)) return
    store.removeProject(id)
    announce('Proyecto eliminado')
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Proyectos"
      description="Clientes y proyectos con presupuesto de horas, tarifa en USD y fecha límite aproximada."
    >
      <template #actions>
        <AdminButton :disabled="!canWrite" @click="openClient">Nuevo cliente</AdminButton>
        <AdminButton
          variant="primary"
          :disabled="!canWrite || !data.clients.length"
          :title="data.clients.length ? undefined : 'Crea primero un cliente'"
          @click="openProject"
        >
          <Icon name="mdi:plus" size="18" aria-hidden="true" />
          Nuevo proyecto
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

    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" class="mb-3 text-lg font-semibold text-brand-ink">Proyectos</h2>
      <ul v-if="data.projects.length" class="grid gap-4 lg:grid-cols-2">
        <li
          v-for="project in data.projects"
          :key="project.id"
          class="rounded-2xl border border-brand-border bg-brand-surface-card p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="truncate font-semibold text-brand-ink">{{ project.name }}</h3>
              <p class="text-sm text-brand-muted">{{ store.clientName(project.clientId) }}</p>
            </div>
            <span
              v-if="project.publishable"
              class="shrink-0 rounded-full border border-brand-border bg-brand-surface-soft px-2.5 py-1 text-xs font-semibold text-brand-accent-text"
            >
              Publicable
            </span>
          </div>

          <div class="mt-4">
            <div class="flex justify-between text-xs text-brand-muted">
              <span>Horas {{ store.hoursByProject(project.id) }} / {{ project.budgetHours }}</span>
              <span>
                {{
                  Math.min(
                    Math.round((store.hoursByProject(project.id) / project.budgetHours) * 100),
                    999
                  )
                }}
                %
              </span>
            </div>
            <div
              class="mt-1 h-2 overflow-hidden rounded-full bg-brand-surface-soft"
              role="progressbar"
              :aria-valuenow="store.hoursByProject(project.id)"
              aria-valuemin="0"
              :aria-valuemax="project.budgetHours"
              :aria-label="`Horas usadas de ${project.name}`"
            >
              <div
                class="h-full rounded-full bg-brand-blue"
                :style="{
                  width: `${Math.min((store.hoursByProject(project.id) / project.budgetHours) * 100, 100)}%`
                }"
              />
            </div>
          </div>

          <dl class="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt class="text-xs text-brand-muted">Tarifa</dt>
              <dd class="font-medium text-brand-ink">${{ project.rateUsd }}/h</dd>
            </div>
            <div>
              <dt class="text-xs text-brand-muted">Inicio</dt>
              <dd class="font-medium text-brand-ink">{{ formatDate(project.startDate) }}</dd>
            </div>
            <div>
              <dt class="text-xs text-brand-muted">Deadline</dt>
              <dd class="font-medium text-brand-ink">{{ formatDate(project.deadline) }}</dd>
              <dd
                class="text-xs font-semibold"
                :class="deadlineInfo(project.deadline, project.status).tone"
              >
                {{ deadlineInfo(project.deadline, project.status).text }}
              </dd>
            </div>
          </dl>

          <div class="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div class="w-44">
              <AdminInput
                :id="`status-${project.id}`"
                :model-value="project.status"
                label="Estado"
                type="select"
                :options="statusOptions"
                @update:model-value="changeStatus(project.id, $event)"
              />
            </div>
            <AdminButton
              variant="danger"
              :disabled="!canWrite"
              @click="deleteProject(project.id, project.name)"
            >
              Eliminar
            </AdminButton>
          </div>
        </li>
      </ul>
      <div
        v-else
        class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-8 text-center"
      >
        <Icon
          name="mdi:folder-outline"
          size="32"
          class="mx-auto text-brand-helper"
          aria-hidden="true"
        />
        <p class="mt-3 font-semibold text-brand-ink">Aún no hay proyectos</p>
        <p class="mx-auto mt-1 max-w-md text-sm leading-6 text-brand-muted">
          Crea un cliente y luego su proyecto con presupuesto de horas y deadline.
        </p>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="clients-heading">
      <h2 id="clients-heading" class="mb-3 text-lg font-semibold text-brand-ink">Clientes</h2>
      <ul v-if="data.clients.length" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="client in data.clients"
          :key="client.id"
          class="rounded-xl border border-brand-border bg-brand-surface-card p-4"
        >
          <p class="font-medium text-brand-ink">{{ client.name }}</p>
          <p v-if="client.company" class="text-sm text-brand-muted">{{ client.company }}</p>
          <p v-if="client.email" class="text-xs text-brand-muted">{{ client.email }}</p>
        </li>
      </ul>
      <p v-else class="text-sm text-brand-muted">Sin clientes todavía.</p>
    </section>

    <AdminDialog :open="clientOpen" title="Nuevo cliente" @close="clientOpen = false">
      <form class="space-y-4" novalidate @submit.prevent="submitClient">
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminInput
            id="cl-name"
            v-model="clientForm.values.name"
            label="Nombre"
            required
            :error="clientForm.errors.value.name"
          />
          <AdminInput
            id="cl-company"
            v-model="clientForm.values.company"
            label="Empresa (opcional)"
            :error="clientForm.errors.value.company"
          />
        </div>
        <AdminInput
          id="cl-email"
          v-model="clientForm.values.email"
          label="Correo (opcional)"
          type="email"
          :error="clientForm.errors.value.email"
        />
        <AdminInput
          id="cl-notes"
          v-model="clientForm.values.notes"
          label="Notas"
          type="textarea"
          :error="clientForm.errors.value.notes"
        />
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="clientOpen = false">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Crear cliente</AdminButton>
        </div>
      </form>
    </AdminDialog>

    <AdminDialog
      :open="projectOpen"
      title="Nuevo proyecto"
      description="Todos los montos son en USD."
      @close="projectOpen = false"
    >
      <form class="space-y-4" novalidate @submit.prevent="submitProject">
        <AdminInput
          id="pr-name"
          v-model="projectForm.values.name"
          label="Nombre del proyecto"
          required
          :error="projectForm.errors.value.name"
        />
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminInput
            id="pr-client"
            v-model="projectForm.values.clientId"
            label="Cliente"
            type="select"
            :options="clientOptions"
            required
            :error="projectForm.errors.value.clientId"
          />
          <AdminInput
            id="pr-status"
            v-model="projectForm.values.status"
            label="Estado"
            type="select"
            :options="statusOptions"
            required
            :error="projectForm.errors.value.status"
          />
          <AdminInput
            id="pr-rate"
            v-model="projectForm.values.rateUsd"
            label="Tarifa por hora (USD)"
            type="number"
            step="0.5"
            required
            :error="projectForm.errors.value.rateUsd"
          />
          <AdminInput
            id="pr-hours"
            v-model="projectForm.values.budgetHours"
            label="Horas presupuestadas"
            type="number"
            required
            :error="projectForm.errors.value.budgetHours"
          />
          <AdminInput
            id="pr-start"
            v-model="projectForm.values.startDate"
            label="Inicio"
            type="date"
            required
            :error="projectForm.errors.value.startDate"
          />
          <AdminInput
            id="pr-deadline"
            v-model="projectForm.values.deadline"
            label="Deadline aproximado"
            type="date"
            required
            :error="projectForm.errors.value.deadline"
          />
        </div>
        <AdminInput
          id="pr-publishable"
          v-model="projectForm.values.publishable"
          label="Publicable en el portafolio"
          type="checkbox"
          hint="Solo si el cliente lo permite."
        />
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="projectOpen = false">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Crear proyecto</AdminButton>
        </div>
      </form>
    </AdminDialog>
  </div>
</template>
