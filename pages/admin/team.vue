<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import AssignmentCard from '~/components/admin/team/AssignmentCard.vue'
  import AssignmentFormDialog from '~/components/admin/team/AssignmentFormDialog.vue'
  import MemberCard from '~/components/admin/team/MemberCard.vue'
  import MemberFormDialog from '~/components/admin/team/MemberFormDialog.vue'
  import PaymentFormDialog from '~/components/admin/team/PaymentFormDialog.vue'
  import PaymentRow from '~/components/admin/team/PaymentRow.vue'
  import TeamSummary from '~/components/admin/team/TeamSummary.vue'
  import TimeEntryFormDialog from '~/components/admin/team/TimeEntryFormDialog.vue'
  import TimeEntryRow from '~/components/admin/team/TimeEntryRow.vue'
  import TrmFormDialog from '~/components/admin/team/TrmFormDialog.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import type { ProjectRecord } from '~/utils/admin/projects'
  import {
    memberNameOf,
    projectNameOf,
    totalDue,
    type AssignmentRecord,
    type PaymentRecord,
    type TeamMemberRecord,
    type TimeEntryRecord,
    type TrmRecord
  } from '~/utils/admin/team'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Equipo y pagos | Panel', robots: 'noindex, nofollow' })

  const api = useAdminTeam()
  const projectsApi = useAdminProjects()
  const { status, announce } = useAdminStatus()

  type Page<T> = { items: T[]; total: number }
  // El error viaja dentro de los datos para que el servidor y el navegador muestren lo mismo.
  type Loaded = {
    members: Page<TeamMemberRecord> | null
    assignments: Page<AssignmentRecord> | null
    entries: Page<TimeEntryRecord> | null
    payments: Page<PaymentRecord> | null
    projects: ProjectRecord[] | null
    trm: TrmRecord | null
    error: string
  }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-team', async () => {
    try {
      const [members, assignments, entries, payments, projects, trm] = await Promise.all([
        api.listMembers(),
        api.listAssignments(),
        api.listTimeEntries(),
        api.listPayments(),
        projectsApi.listProjects(),
        // Sin ninguna TRM registrada la API responde 404: no es un error, solo "aún no hay".
        api.getTrm().catch((error: unknown) => {
          if (toAdminApiError(error).status === 404) return null
          throw error
        })
      ])
      return { members, assignments, entries, payments, projects: projects.items, trm, error: '' }
    } catch (error) {
      return {
        members: null,
        assignments: null,
        entries: null,
        payments: null,
        projects: null,
        trm: null,
        error: toAdminApiError(error).message
      }
    }
  })

  const members = computed(() => data.value?.members?.items ?? [])
  const assignments = computed(() => data.value?.assignments?.items ?? [])
  const entries = computed(() => data.value?.entries?.items ?? [])
  const payments = computed(() => data.value?.payments?.items ?? [])
  const projects = computed(() => data.value?.projects ?? [])
  const trm = computed(() => data.value?.trm ?? null)
  const loadError = computed(() => data.value?.error ?? '')
  const isLoading = computed(() => !data.value)
  const isReady = computed(() => !!data.value?.members)

  const activeMembers = computed(() => members.value.filter(member => member.active))
  const activeOptions = computed(() =>
    activeMembers.value.map(member => ({ value: member.id, label: member.name }))
  )
  const projectOptions = computed(() =>
    projects.value.map(project => ({ value: project.id, label: project.name }))
  )
  const due = computed(() => totalDue(members.value))
  const nameOfMember = (id: string) => memberNameOf(members.value, id)
  const nameOfProject = (id: string) => projectNameOf(projects.value, id)
  const shownOf = (page: Page<unknown> | null | undefined, shown: number) =>
    page && page.total > shown ? `Se muestran ${shown} de ${page.total}.` : ''

  // --- Altas y ediciones
  const memberDialog = reactive<{ open: boolean; member: TeamMemberRecord | null }>({
    open: false,
    member: null
  })
  const assignmentDialog = reactive<{ open: boolean; assignment: AssignmentRecord | null }>({
    open: false,
    assignment: null
  })
  const hoursOpen = ref(false)
  const paymentOpen = ref(false)
  const trmOpen = ref(false)

  const openMember = (member: TeamMemberRecord | null = null) => {
    memberDialog.member = member
    memberDialog.open = true
  }
  const openAssignment = (assignment: AssignmentRecord | null = null) => {
    assignmentDialog.assignment = assignment
    assignmentDialog.open = true
  }

  const onMemberSaved = async (_member: TeamMemberRecord, created: boolean) => {
    memberDialog.open = false
    await refresh()
    announce(created ? 'Colaborador creado' : 'Colaborador actualizado')
  }
  const onAssignmentSaved = async (_assignment: AssignmentRecord, created: boolean) => {
    assignmentDialog.open = false
    await refresh()
    announce(created ? 'Asignación creada' : 'Horas pactadas actualizadas')
  }
  const onHoursSaved = async (entry: {
    memberId: string
    projectId: string
    assignment: { exceeded: boolean }
  }) => {
    hoursOpen.value = false
    await refresh()
    announce(
      entry.assignment.exceeded
        ? `Horas registradas. ${nameOfMember(entry.memberId)} ya supera lo pactado en ${nameOfProject(entry.projectId)}.`
        : 'Horas registradas'
    )
  }
  const onPaymentSaved = async () => {
    paymentOpen.value = false
    await refresh()
    announce('Pago registrado')
  }
  const onTrmSaved = async () => {
    trmOpen.value = false
    await refresh()
    announce('TRM guardada')
  }

  // --- Eliminación (con confirmación que nombra lo que se elimina)
  type RemovalKind = 'member' | 'assignment' | 'entry'
  const removal = reactive<{
    kind: RemovalKind | null
    id: string
    name: string
    busy: boolean
    error: string
  }>({ kind: null, id: '', name: '', busy: false, error: '' })

  const REMOVAL_COPY: Record<RemovalKind, { title: string; done: string }> = {
    member: { title: 'Eliminar colaborador', done: 'Colaborador eliminado' },
    assignment: { title: 'Eliminar asignación', done: 'Asignación eliminada' },
    entry: { title: 'Eliminar registro de horas', done: 'Registro de horas eliminado' }
  }

  const askRemove = (kind: RemovalKind, id: string, name: string) => {
    Object.assign(removal, { kind, id, name, busy: false, error: '' })
  }
  const confirmRemove = async () => {
    const kind = removal.kind
    if (!kind) return
    removal.busy = true
    removal.error = ''
    try {
      if (kind === 'member') await api.removeMember(removal.id)
      else if (kind === 'assignment') await api.removeAssignment(removal.id)
      else await api.removeTimeEntry(removal.id)
      removal.kind = null
      await refresh()
      announce(REMOVAL_COPY[kind].done)
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
      title="Equipo y pagos"
      description="Colaboradores, horas pactadas y cuánto debes pagarles. Todo en USD; la TRM usada queda guardada en cada pago."
    >
      <template #actions>
        <AdminButton @click="openMember()">Nuevo colaborador</AdminButton>
        <AdminButton v-if="activeMembers.length && projects.length" @click="openAssignment()">
          Asignar a proyecto
        </AdminButton>
        <AdminButton v-if="assignments.length" @click="hoursOpen = true">
          Registrar horas
        </AdminButton>
        <AdminButton v-if="members.length" variant="primary" @click="paymentOpen = true">
          <Icon name="mdi:plus" size="20" aria-hidden="true" />
          Registrar pago
        </AdminButton>
      </template>
    </AdminPageHeader>

    <AdminNotice tone="success" :message="status" />

    <AdminSkeleton
      v-if="isLoading"
      :rows="2"
      height-class="h-56"
      label="Cargando equipo y pagos…"
    />

    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>

    <AdminEmptyState
      v-else-if="!members.length"
      icon="mdi:account-group-outline"
      title="Aún no hay colaboradores"
      description="Agrega a las personas que trabajan contigo con su tarifa por hora. Luego podrás asignarlas a un proyecto, registrar sus horas y llevar sus pagos."
    >
      <AdminButton variant="primary" @click="openMember()">
        <Icon name="mdi:plus" size="20" aria-hidden="true" />
        Crear el primer colaborador
      </AdminButton>
    </AdminEmptyState>

    <template v-else>
      <TeamSummary :due-usd="due" :trm="trm" @edit-trm="trmOpen = true" />

      <section aria-labelledby="members-heading">
        <h2 id="members-heading" class="mb-3 text-xl font-semibold text-brand-ink">
          Colaboradores
        </h2>
        <ul class="grid gap-4 lg:grid-cols-2">
          <li v-for="member in members" :key="member.id">
            <MemberCard
              :member="member"
              @edit="openMember(member)"
              @remove="askRemove('member', member.id, member.name)"
            />
          </li>
        </ul>
        <p v-if="shownOf(data?.members, members.length)" class="mt-3 text-xs text-brand-muted">
          {{ shownOf(data?.members, members.length) }}
        </p>
      </section>

      <section class="mt-10" aria-labelledby="assignments-heading">
        <h2 id="assignments-heading" class="mb-3 text-xl font-semibold text-brand-ink">
          Horas pactadas por proyecto
        </h2>
        <ul v-if="assignments.length" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <li v-for="assignment in assignments" :key="assignment.id">
            <AssignmentCard
              :assignment="assignment"
              :member-name="nameOfMember(assignment.memberId)"
              :project-name="nameOfProject(assignment.projectId)"
              @edit="openAssignment(assignment)"
              @remove="
                askRemove(
                  'assignment',
                  assignment.id,
                  `${nameOfMember(assignment.memberId)} en ${nameOfProject(assignment.projectId)}`
                )
              "
            />
          </li>
        </ul>
        <p
          v-else
          class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-6 text-sm leading-6 text-brand-muted"
        >
          <template v-if="projects.length">
            Aún no asignas a nadie a un proyecto. Define cuántas horas pactaste con cada persona
            para ver cuándo se pasa.
          </template>
          <template v-else>
            Primero crea un proyecto en
            <NuxtLink
              to="/admin/projects"
              class="inline-flex min-h-11 items-center font-semibold text-brand-accent-text underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Proyectos
            </NuxtLink>
            para poder asignar horas.
          </template>
        </p>
        <p
          v-if="shownOf(data?.assignments, assignments.length)"
          class="mt-3 text-xs text-brand-muted"
        >
          {{ shownOf(data?.assignments, assignments.length) }}
        </p>
      </section>

      <section class="mt-10" aria-labelledby="entries-heading">
        <h2 id="entries-heading" class="mb-3 text-xl font-semibold text-brand-ink">
          Horas registradas
        </h2>
        <ul
          v-if="entries.length"
          class="divide-y divide-brand-border rounded-2xl border border-brand-border bg-brand-surface-card"
        >
          <TimeEntryRow
            v-for="entry in entries"
            :key="entry.id"
            :entry="entry"
            :member-name="nameOfMember(entry.memberId)"
            :project-name="nameOfProject(entry.projectId)"
            @remove="
              askRemove(
                'entry',
                entry.id,
                `${nameOfMember(entry.memberId)} en ${nameOfProject(entry.projectId)}`
              )
            "
          />
        </ul>
        <p
          v-else
          class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-6 text-sm leading-6 text-brand-muted"
        >
          Aún no hay horas registradas.
          {{
            assignments.length ? 'Usa «Registrar horas» cuando alguien trabaje en un proyecto.' : ''
          }}
        </p>
        <p v-if="shownOf(data?.entries, entries.length)" class="mt-3 text-xs text-brand-muted">
          {{ shownOf(data?.entries, entries.length) }} Las más recientes primero.
        </p>
      </section>

      <section class="mt-10" aria-labelledby="payments-heading">
        <h2 id="payments-heading" class="mb-3 text-xl font-semibold text-brand-ink">
          Pagos registrados
        </h2>
        <ul
          v-if="payments.length"
          class="divide-y divide-brand-border rounded-2xl border border-brand-border bg-brand-surface-card"
        >
          <PaymentRow
            v-for="payment in payments"
            :key="payment.id"
            :payment="payment"
            :member-name="nameOfMember(payment.memberId)"
          />
        </ul>
        <p
          v-else
          class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-6 text-sm leading-6 text-brand-muted"
        >
          Aún no hay pagos registrados.
        </p>
        <p v-if="shownOf(data?.payments, payments.length)" class="mt-3 text-xs text-brand-muted">
          {{ shownOf(data?.payments, payments.length) }} Los más recientes primero.
        </p>
      </section>
    </template>

    <MemberFormDialog
      :open="memberDialog.open"
      :member="memberDialog.member"
      @close="memberDialog.open = false"
      @saved="onMemberSaved"
    />
    <AssignmentFormDialog
      :open="assignmentDialog.open"
      :assignment="assignmentDialog.assignment"
      :member-options="activeOptions"
      :project-options="projectOptions"
      :member-name="
        assignmentDialog.assignment ? nameOfMember(assignmentDialog.assignment.memberId) : ''
      "
      :project-name="
        assignmentDialog.assignment ? nameOfProject(assignmentDialog.assignment.projectId) : ''
      "
      @close="assignmentDialog.open = false"
      @saved="onAssignmentSaved"
    />
    <TimeEntryFormDialog
      :open="hoursOpen"
      :member-options="activeOptions"
      :assignments="assignments"
      :projects="projects"
      @close="hoursOpen = false"
      @saved="onHoursSaved"
    />
    <PaymentFormDialog
      :open="paymentOpen"
      :members="members"
      :trm="trm"
      @close="paymentOpen = false"
      @saved="onPaymentSaved"
    />
    <TrmFormDialog :open="trmOpen" :trm="trm" @close="trmOpen = false" @saved="onTrmSaved" />

    <AdminConfirmDialog
      :open="removal.kind !== null"
      :title="removal.kind ? REMOVAL_COPY[removal.kind].title : ''"
      :confirm-label="removal.kind ? REMOVAL_COPY[removal.kind].title : ''"
      loading-label="Eliminando…"
      :busy="removal.busy"
      :error="removal.error"
      @close="removal.kind = null"
      @confirm="confirmRemove"
    >
      <template v-if="removal.kind === 'member'">
        Se eliminará a «{{ removal.name }}». Solo es posible si no tiene horas ni pagos; si los
        tiene, desactívalo desde «Editar». Esta acción no se puede deshacer.
      </template>
      <template v-else-if="removal.kind === 'assignment'">
        Se eliminará la asignación de «{{ removal.name }}». Solo es posible si aún no hay horas
        registradas. Esta acción no se puede deshacer.
      </template>
      <template v-else>
        Se eliminará el registro de horas de «{{ removal.name }}» y el saldo se recalculará. Úsalo
        solo para corregir un error de captura. Esta acción no se puede deshacer.
      </template>
    </AdminConfirmDialog>
  </div>
</template>
