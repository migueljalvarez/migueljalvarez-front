<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import { ADMIN_NAV } from '~/constants/admin'
  import { toAdminApiError } from '~/utils/adminApiError'
  import { listAllAdminPages } from '~/utils/admin/pagination'
  import { totalDue, formatUsd, type TeamMemberRecord } from '~/utils/admin/team'
  import type { ProjectRecord } from '~/utils/admin/projects'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Resumen | Panel', robots: 'noindex, nofollow' })

  const leadsApi = useAdminLeads()
  const projectsApi = useAdminProjects()
  const teamApi = useAdminTeam()
  const testimonialApi = useAdminTestimonials()

  type MetricResult = { value: string; error: string }
  const metric = (key: string, load: () => Promise<string>) =>
    useLazyAsyncData<MetricResult>(`admin-overview-${key}`, async () => {
      try {
        return { value: await load(), error: '' }
      } catch (error) {
        return { value: '—', error: toAdminApiError(error).message }
      }
    })

  const openLeads = metric('leads', async () => {
    const statuses = ['nuevo', 'contactado', 'reunion', 'propuesta']
    const counts = await Promise.all(
      statuses.map(async status => (await leadsApi.list({ limit: 1, offset: 0, status })).total)
    )
    return String(counts.reduce((total, count) => total + count, 0))
  })

  const activeProjects = metric('active-projects', async () =>
    String((await projectsApi.listProjects({ limit: 1, offset: 0, status: 'en-curso' })).total)
  )

  const upcomingDeadlines = metric('deadlines', async () => {
    const projects = await listAllAdminPages<ProjectRecord>(query =>
      projectsApi.listProjects(query)
    )
    const now = Date.now()
    const count = projects.filter(project => {
      if (project.status === 'entregado' || !project.deadline) return false
      const deadline = new Date(`${project.deadline}T12:00:00`).getTime()
      const days = (deadline - now) / 86_400_000
      return days >= -1 && days <= 14
    }).length
    return String(count)
  })

  const pendingTestimonials = metric('testimonials', async () =>
    String((await testimonialApi.list({ limit: 1, offset: 0, status: 'respondida' })).total)
  )

  const dueToTeam = metric('team-due', async () => {
    const members = await listAllAdminPages<TeamMemberRecord>(query => teamApi.listMembers(query))
    return formatUsd(totalDue(members))
  })

  const stats = computed(() => [
    {
      label: 'Leads abiertos',
      to: '/admin/leads',
      data: openLeads.data.value,
      pending: openLeads.pending.value,
      refresh: openLeads.refresh
    },
    {
      label: 'Proyectos activos',
      to: '/admin/projects',
      data: activeProjects.data.value,
      pending: activeProjects.pending.value,
      refresh: activeProjects.refresh
    },
    {
      label: 'Deadlines en 14 días',
      to: '/admin/projects',
      data: upcomingDeadlines.data.value,
      pending: upcomingDeadlines.pending.value,
      refresh: upcomingDeadlines.refresh
    },
    {
      label: 'Testimonios por aprobar',
      to: '/admin/testimonials',
      data: pendingTestimonials.data.value,
      pending: pendingTestimonials.pending.value,
      refresh: pendingTestimonials.refresh
    },
    {
      label: 'Por pagar al equipo',
      to: '/admin/team',
      data: dueToTeam.data.value,
      pending: dueToTeam.pending.value,
      refresh: dueToTeam.refresh
    }
  ])
  const modules = ADMIN_NAV.filter(item => item.to !== '/admin')
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Resumen"
      description="Indicadores actuales para que veas de un vistazo qué requiere tu atención. Cada dato se carga por separado."
    />

    <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Indicadores">
      <li v-for="stat in stats" :key="stat.label" class="min-w-0">
        <NuxtLink
          :to="stat.to"
          class="block min-h-28 rounded-2xl border border-brand-border bg-brand-surface-card p-5 shadow-[0_8px_22px_var(--color-brand-shadow-card)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          :aria-busy="stat.pending"
        >
          <AdminSkeleton
            v-if="stat.pending"
            :rows="1"
            height-class="h-8"
            :label="`Cargando ${stat.label.toLocaleLowerCase()}…`"
          />
          <template v-else>
            <p class="text-3xl font-semibold tabular-nums text-brand-ink">
              {{ stat.data?.value ?? '—' }}
            </p>
            <p class="mt-1 text-sm text-brand-muted">{{ stat.label }}</p>
          </template>
        </NuxtLink>
        <AdminNotice
          v-if="!stat.pending && stat.data?.error"
          tone="error"
          :message="stat.data.error"
          gap="top"
        >
          <AdminButton @click="stat.refresh()">Reintentar</AdminButton>
        </AdminNotice>
      </li>
    </ul>

    <section class="mt-10" aria-labelledby="modules-heading">
      <h2 id="modules-heading" class="text-lg font-semibold text-brand-ink">Módulos</h2>
      <ul class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <li v-for="item in modules" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex h-full min-h-28 gap-4 rounded-2xl border border-brand-border bg-brand-surface-card p-5 transition hover:border-brand-border-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          >
            <Icon
              :name="item.icon"
              size="24"
              class="mt-0.5 shrink-0 text-brand-blue"
              aria-hidden="true"
            />
            <span>
              <span class="block font-semibold text-brand-ink">{{ item.label }}</span>
              <span class="mt-1 block text-sm leading-6 text-brand-muted">{{ item.summary }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
