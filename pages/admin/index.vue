<script setup lang="ts">
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSampleBanner from '~/components/admin/AdminSampleBanner.vue'
  import { ADMIN_NAV } from '~/constants/admin'

  definePageMeta({ layout: 'admin' })

  const { data, persistence, hoursByProject } = useAdminData()
  const hasData = persistence !== 'ninguna'

  const soon = (iso: string, days: number) => {
    const diff = (new Date(`${iso}T12:00:00`).getTime() - Date.now()) / 86_400_000
    return diff >= -1 && diff <= days
  }

  const stats = computed(() => [
    {
      label: 'Leads abiertos',
      value: hasData
        ? String(
            data.value.leads.filter(lead => !['ganado', 'perdido'].includes(lead.status)).length
          )
        : '—',
      to: '/admin/leads'
    },
    {
      label: 'Proyectos activos',
      value: hasData
        ? String(data.value.projects.filter(item => item.status === 'en-curso').length)
        : '—',
      to: '/admin/proyectos'
    },
    {
      label: 'Deadlines en 14 días',
      value: hasData
        ? String(
            data.value.projects.filter(
              item => item.status !== 'entregado' && soon(item.deadline, 14)
            ).length
          )
        : '—',
      to: '/admin/proyectos'
    },
    {
      label: 'Testimonios por aprobar',
      value: hasData
        ? String(data.value.testimonials.filter(item => item.status === 'respondida').length)
        : '—',
      to: '/admin/testimonios'
    }
  ])
  void hoursByProject

  const modules = ADMIN_NAV.filter(item => item.to !== '/admin')
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Resumen"
      description="Aquí verás de un vistazo qué requiere tu atención. Los datos reales aparecerán cuando la base de datos esté lista."
    />
    <AdminSampleBanner />

    <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores">
      <li v-for="stat in stats" :key="stat.label">
        <NuxtLink
          :to="stat.to"
          class="block rounded-2xl border border-brand-border bg-brand-surface-card p-5 shadow-[0_8px_22px_var(--color-brand-shadow-card)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
        >
          <p class="text-3xl font-semibold text-brand-ink">{{ stat.value }}</p>
          <p class="mt-1 text-sm text-brand-muted">{{ stat.label }}</p>
        </NuxtLink>
      </li>
    </ul>

    <section class="mt-10" aria-labelledby="modules-heading">
      <h2 id="modules-heading" class="text-lg font-semibold text-brand-ink">Módulos</h2>
      <ul class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <li v-for="item in modules" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex h-full gap-4 rounded-2xl border border-brand-border bg-brand-surface-card p-5 transition hover:border-brand-border-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
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
