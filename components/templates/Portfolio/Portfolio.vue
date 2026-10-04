<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { Badge, Button } from '~/components/atoms'
  import { getTechnologyIcon, PORTFOLIO_CTA, PORTFOLIO_TYPE_OPTIONS } from '~/constants/portfolio'

  import type { PortfolioProps } from '../templates'

  const props = defineProps<PortfolioProps>()

  const sectionRef = ref<HTMLElement | null>(null)
  const selectedProject = ref<PortfolioProps['projects'][number] | null>(null)
  const opcionSeleccionada = ref<(typeof PORTFOLIO_TYPE_OPTIONS)[number]>('Todos')
  const featuredCtaProject = computed(() =>
    props.projects.find(project => project.id === PORTFOLIO_CTA.projectId)
  )
  const showCaseCta = computed(
    () => PORTFOLIO_CTA.mode === 'case' && Boolean(featuredCtaProject.value)
  )
  const projectVisuals: Record<string, { icon: string; category: string; background: string }> = {
    'mi-comodoro': {
      icon: 'mdi:cash-multiple',
      category: 'Finanzas personales',
      background: 'bg-linear-to-br from-emerald-700 via-emerald-900 to-slate-950'
    },
    'tu-radio-ar-stereo': {
      icon: 'mdi:radio',
      category: 'Radio digital',
      background: 'bg-linear-to-br from-rose-700 via-red-950 to-slate-950'
    },
    'caja-de-ritmos': {
      icon: 'mdi:music',
      category: 'Herramienta musical',
      background: 'bg-linear-to-br from-violet-700 via-purple-950 to-slate-950'
    },
    'frases-aleatorias': {
      icon: 'mdi:format-quote-open',
      category: 'Microproducto',
      background: 'bg-linear-to-br from-amber-600 via-orange-900 to-slate-950'
    },
    'agencia-ops': {
      icon: 'mdi:briefcase-outline',
      category: 'Sitio corporativo',
      background: 'bg-linear-to-br from-sky-700 via-blue-950 to-slate-950'
    }
  }

  const getProjectVisual = (project: PortfolioProps['projects'][number]) =>
    projectVisuals[project.id] ?? {
      icon: 'mdi:view-dashboard-outline',
      category: project.portfolioType || 'Proyecto digital',
      background: 'bg-linear-to-br from-brand-accent via-slate-800 to-slate-950'
    }

  const filteredProjects = computed(() => {
    const eligibleProjects = (props.projects ?? []).filter(
      project => project.type === 'client' || project.type === 'product'
    )
    const items = [...eligibleProjects].sort(
      (a, b) => Number(b.id === 'mi-comodoro') - Number(a.id === 'mi-comodoro')
    )

    if (opcionSeleccionada.value === 'Todos') {
      return items.slice(0, 5)
    }

    const projectType = opcionSeleccionada.value === 'Clientes' ? 'client' : 'product'
    return items.filter(project => project.type === projectType).slice(0, 5)
  })

  const visibleProjects = computed(() => {
    const items = filteredProjects.value
    return items.length ? items : []
  })

  onMounted(() => {
    if (!sectionRef.value) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            sectionRef.value?.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 }
    )

    observer.observe(sectionRef.value)
  })

  const openProject = (project: PortfolioProps['projects'][number]) => {
    selectedProject.value = project
  }

  const closeProject = () => {
    selectedProject.value = null
  }

  const resolveDescription = (description?: string) => {
    if (!description || description.trim() === '' || description.trim().toUpperCase() === 'N/A') {
      return 'Descripción del proyecto próximamente. Aquí va un resumen breve de qué resuelve, con qué stack se construyó y qué decisión técnica destaca.'
    }

    return description
  }

  const opciones = [...PORTFOLIO_TYPE_OPTIONS]
</script>

<template>
  <section id="portfolio" ref="sectionRef" class="reveal-section w-full max-w-7xl mx-auto">
    <!-- Header -->

    <div class="mb-6">
      <div class="flex flex-col items-start gap-4">
        <div>
          <h5 class="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-brand-blue">
            {{ title }}
          </h5>
          <h2 class="text-2xl font-semibold text-brand-ink">Soluciones que generan Impacto</h2>
        </div>
        <div
          class="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-brand-border bg-brand-surface-card p-1 text-sm uppercase tracking-[0.08em] text-brand-muted"
        >
          <Button
            v-for="opcion in opciones"
            :key="opcion"
            theme="secondary"
            :class="[
              'rounded-full border-0 bg-transparent px-4 py-1.5 text-brand-muted transition-all duration-200',
              opcionSeleccionada === opcion
                ? 'bg-brand-blue font-semibold text-white shadow-sm'
                : 'hover:text-brand-ink'
            ]"
            @click="opcionSeleccionada = opcion"
          >
            {{ opcion }}
          </Button>
        </div>
      </div>
    </div>
    <!-- 1. El contenedor base maneja 1 columna en móvil y 2 columnas a partir de md -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6 xl:gap-5">
      <article
        v-for="(project, index) in visibleProjects.slice(0, 5)"
        :key="project.id || index"
        class="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-brand-border-soft/50 bg-brand-surface-panel-strong shadow-[0_10px_24px_rgba(18,30,48,0.05)] transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(18,30,48,0.12)] md:h-[300px]"
        :class="
          index < 2
            ? 'md:flex-row xl:col-span-3 xl:h-[320px]'
            : 'md:flex-row xl:col-span-2 xl:h-[440px] xl:flex-col'
        "
      >
        <!-- CONTENEDOR DE IMAGEN:
         - Para los de abajo: mantiene proporción aspect-[16/9] fija y w-full.
         - Para el primero: pasa a w-2/5 y aspect-[4/3] en pantallas grandes.
    -->
        <div
          class="relative aspect-[16/9] w-full shrink-0 overflow-hidden"
          :class="[
            index < 2
              ? 'md:h-full md:w-2/5 md:max-w-[400px] md:aspect-auto'
              : 'md:h-full md:w-2/5 md:max-w-[400px] md:aspect-auto xl:h-auto xl:w-full xl:max-w-none xl:aspect-[16/9]',
            project.id === 'mi-comodoro' ? 'bg-brand-accent' : 'bg-brand-surface-soft'
          ]"
        >
          <img
            v-if="project.urlImage"
            :src="project.urlImage"
            :alt="project.title"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <!-- Identidad visual temporal para proyectos que aún no tienen imagen -->
          <div
            v-else
            class="relative flex h-full min-h-40 w-full flex-col justify-between overflow-hidden p-5 text-white md:p-6"
            :class="getProjectVisual(project).background"
          >
            <div
              class="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full border border-white/15"
            />
            <div
              class="pointer-events-none absolute -right-2 -top-6 size-28 rounded-full border border-white/10"
            />
            <div
              class="relative flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75"
            >
              <Icon :name="getProjectVisual(project).icon" size="18" />
              <span>{{ getProjectVisual(project).category }}</span>
            </div>
            <div class="relative mt-auto pt-8">
              <h5 class="max-w-[18rem] text-xl font-semibold leading-tight md:text-2xl">
                {{ project.title }}
              </h5>
              <div v-if="project.technologies?.length" class="mt-3 flex flex-wrap gap-1.5">
                <span
                  v-for="technology in project.technologies.slice(0, 3)"
                  :key="technology"
                  class="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] text-white/85 backdrop-blur-sm"
                >
                  {{ technology }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent"
          />

          <div
            v-if="project.urlImage && project.technologies?.length"
            class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-4"
          >
            <span
              v-for="technology in project.technologies.slice(0, 3)"
              :key="technology"
              class="rounded-full border border-white/25 bg-[#0F1727]/75 px-2 py-1 text-[10px] text-white backdrop-blur-sm"
            >
              {{ technology }}
            </span>
          </div>
        </div>

        <!-- CONTENEDOR DE TEXTO:
         - Para los de abajo: rellena el espacio vertical de forma natural.
         - Para el primero: se centra verticalmente al lado de la imagen.
    -->
        <div class="flex min-w-0 flex-1 flex-col items-start justify-start p-5 md:p-6">
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <Badge theme="info" :value="project.portfolioType" class="w-fit" />
            <span
              v-if="project.status"
              class="rounded-full border border-brand-border-soft/60 bg-white/5 px-2.5 py-1 text-xs text-brand-text-subtle"
            >
              {{ project.status }}
            </span>
          </div>

          <h4 class="mb-2 font-semibold text-white md:text-xl">
            {{ project.title }}
          </h4>

          <p class="line-clamp-4 text-sm leading-6 text-white/90">
            {{
              project.id === 'portfolio-placeholder-summary'
                ? project.description
                : resolveDescription(project.description)
            }}
          </p>

          <button
            type="button"
            class="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-brand-blue-on-dark transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue-on-dark"
            @click="openProject(project)"
          >
            Ver detalles
            <Icon name="mdi:arrow-right" size="17" />
          </button>
        </div>
      </article>

      <div
        class="flex min-h-64 flex-col justify-between rounded-2xl border border-brand-border-soft/60 bg-brand-surface-panel p-6 transition-colors duration-250 hover:border-brand-blue/50 hover:bg-brand-surface-panel-strong md:col-span-2 md:h-[260px] xl:col-span-6 xl:h-auto xl:min-h-0 xl:flex-row xl:items-center xl:gap-6"
      >
        <div
          class="flex size-12 items-center justify-center rounded-xl bg-brand-blue-on-dark/15 text-brand-blue-on-dark"
        >
          <Icon :name="showCaseCta ? 'mdi:radio' : 'mdi:chat-outline'" size="24" />
        </div>
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-text-soft">
            {{ showCaseCta ? PORTFOLIO_CTA.caseLabel : PORTFOLIO_CTA.fallbackLabel }}
          </p>
          <h3 class="text-xl font-semibold text-white md:text-2xl">
            {{ showCaseCta ? featuredCtaProject?.title : PORTFOLIO_CTA.fallbackTitle }}
          </h3>
          <Button
            v-if="showCaseCta && featuredCtaProject"
            as="a"
            :href="`/portafolio/${featuredCtaProject.slug || featuredCtaProject.id}`"
            theme="tertiary"
            size="sm"
            icon="mdi:arrow-right"
            icon-position="right"
            class="mt-4 w-fit"
          >
            {{ PORTFOLIO_CTA.caseAction }}
          </Button>
          <Button
            v-else
            as="a"
            :href="PORTFOLIO_CTA.fallbackHref"
            theme="tertiary"
            size="sm"
            icon="mdi:arrow-right"
            icon-position="right"
            class="mt-4 w-fit"
          >
            {{ PORTFOLIO_CTA.fallbackAction }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedProject"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeProject"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeProject" />

          <!-- Modal content -->
          <div
            class="relative max-h-[82vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-brand-border bg-brand-surface shadow-[0_18px_40px_rgba(18,30,48,0.18)]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="`project-title-${selectedProject.id}`"
          >
            <!-- Close -->
            <button
              type="button"
              aria-label="Cerrar"
              class="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-ink transition hover:bg-brand-surface-soft"
              @click="closeProject"
            >
              <span class="text-xl leading-none">×</span>
            </button>

            <!-- Image -->
            <div class="h-32 overflow-hidden md:h-40">
              <img
                v-if="selectedProject.urlImage"
                :src="selectedProject.urlImage"
                :alt="selectedProject.title"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="relative flex h-full w-full items-center justify-center overflow-hidden text-white"
                :class="getProjectVisual(selectedProject).background"
              >
                <div
                  class="pointer-events-none absolute -right-8 -top-12 size-40 rounded-full border border-white/15"
                />
                <div class="relative flex flex-col items-center gap-2 text-center">
                  <Icon :name="getProjectVisual(selectedProject).icon" size="32" />
                  <span class="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                    {{ getProjectVisual(selectedProject).category }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Details -->
            <div class="p-5 md:p-6">
              <!-- Type -->
              <div class="mb-3">
                <Badge
                  theme="info"
                  :value="selectedProject.portfolioType"
                  class="shadow-[0_4px_12px_rgba(18,30,48,0.06)]"
                />
              </div>

              <!-- Title -->
              <h3
                :id="`project-title-${selectedProject.id}`"
                class="mb-4 text-2xl font-semibold text-brand-ink"
              >
                {{ selectedProject.title }}
              </h3>

              <!-- Description -->
              <div class="mb-4">
                <h4 class="text-sm font-semibold text-brand-ink mb-2">Sobre el proyecto</h4>

                <p class="text-sm leading-7 text-brand-muted whitespace-pre-line">
                  {{ resolveDescription(selectedProject.description) }}
                </p>
              </div>

              <div class="mb-5 grid gap-4 sm:grid-cols-3">
                <section
                  v-if="selectedProject.problem"
                  class="rounded-xl bg-brand-surface-soft p-4"
                >
                  <h4 class="mb-2 text-sm font-semibold text-brand-ink">El problema</h4>
                  <p class="text-sm leading-6 text-brand-muted">{{ selectedProject.problem }}</p>
                </section>
                <section
                  v-if="selectedProject.decision"
                  class="rounded-xl bg-brand-surface-soft p-4"
                >
                  <h4 class="mb-2 text-sm font-semibold text-brand-ink">La decisión</h4>
                  <p class="text-sm leading-6 text-brand-muted">{{ selectedProject.decision }}</p>
                </section>
                <section
                  v-if="selectedProject.result"
                  class="rounded-xl bg-brand-surface-soft p-4 sm:col-span-3"
                >
                  <h4 class="mb-2 text-sm font-semibold text-brand-ink">El resultado</h4>
                  <p class="text-sm leading-6 text-brand-muted">{{ selectedProject.result }}</p>
                </section>
              </div>

              <!-- Technologies -->
              <div v-if="selectedProject.technologies && selectedProject.technologies.length > 0">
                <h4 class="mb-3 text-sm font-semibold text-brand-ink uppercase tracking-[0.08em]">
                  Tecnologías utilizadas
                </h4>

                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="(tech, techIndex) in selectedProject.technologies"
                    :key="techIndex"
                    class="inline-flex items-center gap-2 rounded-full border border-brand-border px-3 py-2 text-sm text-brand-ink"
                    :title="tech"
                    :aria-label="tech"
                  >
                    <Icon
                      :name="getTechnologyIcon(tech)"
                      size="17"
                      class="shrink-0 text-brand-blue-on-dark"
                    />
                    <span>{{ tech }}</span>
                  </div>
                </div>
              </div>

              <NuxtLink
                :to="`/portafolio/${selectedProject.slug || selectedProject.id}`"
                class="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
              >
                Ver página del proyecto
                <Icon name="mdi:arrow-right" size="17" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.2s ease;
  }

  .modal-enter-active :deep(.relative),
  .modal-leave-active :deep(.relative) {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-from :deep(.relative),
  .modal-leave-to :deep(.relative) {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
</style>
```
