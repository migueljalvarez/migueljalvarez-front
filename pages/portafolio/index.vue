<script setup lang="ts">
  import { PORTFOLIO_PROJECTS } from '~/constants/portfolio'

  definePageMeta({
    layout: 'default',
    title: 'Portafolio'
  })

  const projects = PORTFOLIO_PROJECTS.filter(
    project => project.type === 'client' || project.type === 'product'
  )
</script>

<template>
  <main class="min-h-screen bg-[#0F1727] px-4 py-12 text-white md:py-16">
    <div class="mx-auto max-w-7xl">
      <NuxtLink
        to="/#portfolio"
        class="mb-10 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
      >
        <Icon name="mdi:arrow-left" size="18" />
        Volver al inicio
      </NuxtLink>

      <header class="mb-10 max-w-2xl">
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-soft">
          Portafolio
        </p>
        <h1 class="text-3xl font-semibold md:text-5xl">Proyectos y soluciones</h1>
        <p class="mt-4 text-sm leading-6 text-white/70 md:text-base">
          Una selección de productos, plataformas y sistemas construidos para resolver problemas
          concretos.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <NuxtLink
          v-for="(project, index) in projects"
          :key="project.id"
          :to="`/portafolio/${project.slug || project.id}`"
          class="group overflow-hidden rounded-2xl border border-brand-border-soft/50 bg-brand-surface-panel-strong transition-all duration-200 hover:-translate-y-1 hover:border-brand-blue/50 hover:shadow-[0_16px_32px_rgba(18,30,48,0.2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
        >
          <div
            class="relative flex h-48 items-end overflow-hidden bg-linear-to-br from-brand-accent via-slate-800 to-slate-950 p-5 md:h-56"
          >
            <img
              v-if="project.urlImage"
              :src="project.urlImage"
              :alt="project.title"
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <template v-else>
              <div
                class="pointer-events-none absolute -right-10 -top-16 size-52 rounded-full border border-white/15"
              />
              <div
                class="pointer-events-none absolute -right-2 -top-8 size-32 rounded-full border border-white/10"
              />
              <Icon
                name="mdi:view-dashboard-outline"
                size="34"
                class="absolute right-6 top-6 text-white/35"
              />
            </template>
            <span
              class="relative rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm"
            >
              {{ project.portfolioType }}
            </span>
            <span
              v-if="project.status"
              class="relative ml-2 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[10px] font-semibold text-white/85 backdrop-blur-sm"
            >
              {{ project.status }}
            </span>
            <span class="absolute right-5 top-5 text-xs font-semibold text-white/70">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>

          <div class="p-5 md:p-6">
            <h2 class="text-xl font-semibold text-white">{{ project.title }}</h2>
            <p class="mt-2 line-clamp-2 text-sm leading-6 text-white/70">
              {{ project.description }}
            </p>

            <div v-if="project.technologies?.length" class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="technology in project.technologies"
                :key="technology"
                class="rounded-full border border-brand-border-soft/60 bg-white/5 px-2.5 py-1 text-xs text-white/75"
              >
                {{ technology }}
              </span>
            </div>

            <span
              class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition group-hover:text-white"
            >
              Ver proyecto
              <Icon name="mdi:arrow-right" size="17" />
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
