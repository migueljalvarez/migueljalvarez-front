<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import Button from '~/components/atoms/Button/Button.vue'
  import { PORTFOLIO_CTA, PORTFOLIO_PROJECTS } from '~/constants/portfolio'
  import type { PortfolioCardProject, PortfolioFilter } from './portfolio.types'
  import PortfolioFilters from './PortfolioFilters.vue'
  import ProjectCard from './ProjectCard.vue'

  const props = defineProps<{ title: string; projects: PortfolioCardProject[] }>()

  const sectionRef = ref<HTMLElement | null>(null)
  const selectedFilter = ref<PortfolioFilter>('Todos')
  const featuredCtaProject = computed(() =>
    PORTFOLIO_PROJECTS.find(project => project.id === PORTFOLIO_CTA.projectId)
  )
  const showCaseCta = computed(
    () => PORTFOLIO_CTA.mode === 'case' && Boolean(featuredCtaProject.value)
  )

  const filteredProjects = computed(() => {
    if (selectedFilter.value === 'Clientes') {
      return props.projects.filter(project => project.type === 'cliente')
    }

    if (selectedFilter.value === 'Productos propios') {
      return props.projects.filter(project => project.type === 'propio')
    }

    return props.projects
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
</script>

<template>
  <section
    id="portfolio"
    ref="sectionRef"
    class="portfolio-reveal mx-auto w-full max-w-7xl"
    aria-labelledby="portfolio-heading"
  >
    <header class="mb-8 md:mb-10">
      <div class="max-w-2xl">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent-text">
          {{ title }}
        </p>
        <h2
          id="portfolio-heading"
          class="max-w-[18ch] text-2xl font-semibold leading-tight text-brand-ink md:text-3xl"
        >
          Soluciones que generan Impacto
        </h2>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-brand-muted md:text-base md:leading-7">
          Proyectos que integran tecnología y necesidades concretas para construir soluciones
          útiles.
        </p>
      </div>
    </header>

    <div class="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
      <PortfolioFilters v-model="selectedFilter" />
      <NuxtLink
        to="/portafolio"
        class="inline-flex min-h-11 w-fit items-center gap-2 rounded-md py-2 text-sm font-semibold text-brand-accent-text transition-colors hover:text-brand-blue motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
      >
        Ver todos los proyectos
        <Icon name="mdi:arrow-right" size="17" aria-hidden="true" />
      </NuxtLink>
    </div>

    <TransitionGroup
      name="project-list"
      tag="div"
      class="relative grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-6 xl:gap-5"
    >
      <ProjectCard
        v-for="(project, index) in filteredProjects"
        :key="project.id"
        :project="project"
        :featured="index < 2"
        :desktop-featured="filteredProjects.length >= 2 && index < 2"
        :desktop-secondary="index >= 2"
        :desktop-balanced="filteredProjects.length === 1"
      />

      <div
        key="portfolio-case-study"
        class="flex min-h-[230px] flex-col justify-between gap-5 rounded-3xl border border-brand-border bg-brand-surface-card p-6 text-brand-ink shadow-[0_8px_22px_var(--color-brand-shadow-card)] md:col-span-2 md:flex-row md:items-center md:p-8 xl:col-span-6"
      >
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-accent-text">
            {{ showCaseCta ? PORTFOLIO_CTA.caseLabel : PORTFOLIO_CTA.fallbackLabel }}
          </p>
          <h3 class="text-xl font-semibold md:text-2xl">
            {{ showCaseCta ? featuredCtaProject?.title : PORTFOLIO_CTA.fallbackTitle }}
          </h3>
        </div>
        <Button
          v-if="showCaseCta && featuredCtaProject"
          as="a"
          :href="`/portafolio/${featuredCtaProject.slug || featuredCtaProject.id}`"
          theme="tertiary"
          size="sm"
          icon="mdi:arrow-right"
          icon-position="right"
          class="w-fit shrink-0"
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
          class="w-fit shrink-0"
        >
          {{ PORTFOLIO_CTA.fallbackAction }}
        </Button>
      </div>
    </TransitionGroup>
  </section>
</template>

<style scoped>
  .portfolio-reveal {
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }

  .portfolio-reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .project-list-enter-active,
  .project-list-leave-active,
  .project-list-move {
    transition:
      opacity 0.24s ease,
      transform 0.24s ease;
  }

  .project-list-enter-from,
  .project-list-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  .project-list-leave-active {
    position: absolute;
  }

  @media (prefers-reduced-motion: reduce) {
    .portfolio-reveal,
    .project-list-enter-active,
    .project-list-leave-active,
    .project-list-move {
      transition: none;
    }

    .portfolio-reveal {
      opacity: 1;
      transform: none;
    }
  }
</style>
