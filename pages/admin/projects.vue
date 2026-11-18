<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import ClientCard from '~/components/admin/projects/ClientCard.vue'
  import ClientFormDialog from '~/components/admin/projects/ClientFormDialog.vue'
  import ProjectCard from '~/components/admin/projects/ProjectCard.vue'
  import ProjectFormDialog from '~/components/admin/projects/ProjectFormDialog.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    PROJECT_STATUS_OPTIONS,
    clientNameOf,
    countProjects,
    filterProjects,
    type ClientRecord,
    type ProjectFilter,
    type ProjectRecord
  } from '~/utils/admin/projects'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Proyectos | Panel', robots: 'noindex, nofollow' })

  const api = useAdminProjects()
  const { status, announce } = useAdminStatus()

  // El error viaja dentro de los datos para que el servidor y el navegador muestren lo mismo.
  type Loaded = {
    clients: ClientRecord[] | null
    projects: ProjectRecord[] | null
    clientsTotal: number
    projectsTotal: number
    error: string
  }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-projects', async () => {
    try {
      const [clients, projects] = await Promise.all([api.listClients(), api.listProjects()])
      return {
        clients: clients.items,
        projects: projects.items,
        clientsTotal: clients.total,
        projectsTotal: projects.total,
        error: ''
      }
    } catch (error) {
      return {
        clients: null,
        projects: null,
        clientsTotal: 0,
        projectsTotal: 0,
        error: toAdminApiError(error).message
      }
    }
  })
  const clients = computed(() => data.value?.clients ?? [])
  const projects = computed(() => data.value?.projects ?? [])
  const loadError = computed(() => data.value?.error ?? '')
  const isLoading = computed(() => !data.value)
  const isReady = computed(() => !!data.value?.clients && !!data.value?.projects)

  // --- Filtro de proyectos por estado
  const FILTERS: { value: ProjectFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    ...PROJECT_STATUS_OPTIONS.map(option => ({ value: option.value, label: option.label }))
  ]
  const selected = ref<ProjectFilter>('all')
  const rows = computed(() => filterProjects(projects.value, selected.value))

  // --- Altas y ediciones
  const clientDialog = reactive<{ open: boolean; client: ClientRecord | null }>({
    open: false,
    client: null
  })
  const projectDialog = reactive<{ open: boolean; project: ProjectRecord | null }>({
    open: false,
    project: null
  })
  const openClient = (client: ClientRecord | null = null) => {
    clientDialog.client = client
    clientDialog.open = true
  }
  const openProject = (project: ProjectRecord | null = null) => {
    projectDialog.project = project
    projectDialog.open = true
  }

  const onClientSaved = async (_client: ClientRecord, created: boolean) => {
    clientDialog.open = false
    await refresh()
    announce(created ? 'Cliente creado' : 'Cliente actualizado')
  }
  const onProjectSaved = async (_project: ProjectRecord, created: boolean) => {
    projectDialog.open = false
    await refresh()
    announce(created ? 'Proyecto creado' : 'Proyecto actualizado')
  }

  // --- Eliminación (con confirmación que nombra lo que se elimina)
  const removal = reactive<{
    kind: 'client' | 'project' | null
    id: string
    name: string
    busy: boolean
    error: string
  }>({ kind: null, id: '', name: '', busy: false, error: '' })

  const askRemove = (kind: 'client' | 'project', id: string, name: string) => {
    Object.assign(removal, { kind, id, name, busy: false, error: '' })
  }
  const confirmRemove = async () => {
    removal.busy = true
    removal.error = ''
    try {
      if (removal.kind === 'project') await api.removeProject(removal.id)
      else await api.removeClient(removal.id)
      const message = removal.kind === 'project' ? 'Proyecto eliminado' : 'Cliente eliminado'
      removal.kind = null
      await refresh()
      announce(message)
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
      title="Proyectos"
      description="Clientes y proyectos con presupuesto de horas, tarifa en USD y fecha límite aproximada."
    >
      <template #actions>
        <AdminButton @click="openClient()">Nuevo cliente</AdminButton>
        <AdminButton v-if="clients.length" variant="primary" @click="openProject()">
          <Icon name="mdi:plus" size="20" aria-hidden="true" />
          Nuevo proyecto
        </AdminButton>
      </template>
    </AdminPageHeader>

    <AdminNotice tone="success" :message="status" />

    <AdminSkeleton
      v-if="isLoading"
      :rows="2"
      height-class="h-56"
      label="Cargando proyectos y clientes…"
    />

    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>

    <AdminEmptyState
      v-else-if="!clients.length"
      icon="mdi:folder-outline"
      title="Aún no hay clientes ni proyectos"
      description="Empieza por crear un cliente (o convierte un lead ganado en cliente). Luego podrás crear su proyecto con presupuesto de horas y deadline."
    >
      <AdminButton variant="primary" @click="openClient()">
        <Icon name="mdi:plus" size="20" aria-hidden="true" />
        Crear el primer cliente
      </AdminButton>
    </AdminEmptyState>

    <template v-else>
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" class="mb-3 text-xl font-semibold text-brand-ink">Proyectos</h2>

        <AdminEmptyState
          v-if="!projects.length"
          icon="mdi:briefcase-outline"
          title="Aún no hay proyectos"
          description="Crea el primer proyecto de uno de tus clientes con su presupuesto de horas, tarifa y deadline."
        >
          <AdminButton variant="primary" @click="openProject()">
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
              {{ filter.label }} ({{ countProjects(projects, filter.value) }})
            </button>
          </div>

          <ul v-if="rows.length" class="grid gap-4 lg:grid-cols-2">
            <li v-for="project in rows" :key="project.id">
              <ProjectCard
                :project="project"
                :client-name="clientNameOf(clients, project.clientId)"
                @edit="openProject(project)"
                @remove="askRemove('project', project.id, project.name)"
              />
            </li>
          </ul>
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
          <p
            v-if="data && data.projectsTotal > projects.length"
            class="mt-3 text-xs text-brand-muted"
          >
            Se muestran {{ projects.length }} de {{ data.projectsTotal }} proyectos.
          </p>
        </template>
      </section>

      <section class="mt-10" aria-labelledby="clients-heading">
        <h2 id="clients-heading" class="mb-3 text-xl font-semibold text-brand-ink">Clientes</h2>
        <ul class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <li v-for="client in clients" :key="client.id">
            <ClientCard
              :client="client"
              @edit="openClient(client)"
              @remove="askRemove('client', client.id, client.name)"
            />
          </li>
        </ul>
        <p v-if="data && data.clientsTotal > clients.length" class="mt-3 text-xs text-brand-muted">
          Se muestran {{ clients.length }} de {{ data.clientsTotal }} clientes.
        </p>
      </section>
    </template>

    <ClientFormDialog
      :open="clientDialog.open"
      :client="clientDialog.client"
      @close="clientDialog.open = false"
      @saved="onClientSaved"
    />
    <ProjectFormDialog
      :open="projectDialog.open"
      :project="projectDialog.project"
      :clients="clients"
      @close="projectDialog.open = false"
      @saved="onProjectSaved"
    />

    <AdminConfirmDialog
      :open="removal.kind !== null"
      :title="removal.kind === 'project' ? 'Eliminar proyecto' : 'Eliminar cliente'"
      :confirm-label="removal.kind === 'project' ? 'Eliminar proyecto' : 'Eliminar cliente'"
      loading-label="Eliminando…"
      :busy="removal.busy"
      :error="removal.error"
      @close="removal.kind = null"
      @confirm="confirmRemove"
    >
      <template v-if="removal.kind === 'project'">
        Se eliminará el proyecto «{{ removal.name }}». Esta acción no se puede deshacer.
      </template>
      <template v-else>
        Se eliminará el cliente «{{ removal.name }}». Solo es posible si no tiene proyectos. Esta
        acción no se puede deshacer.
      </template>
    </AdminConfirmDialog>
  </div>
</template>
