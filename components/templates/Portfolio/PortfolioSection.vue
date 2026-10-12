<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import type {
    PortfolioCardProject,
    PortfolioCardVariant,
    PortfolioFilter
  } from './portfolio.types'
  import Button from '~/components/atoms/Button/Button.vue'
  import PortfolioFilters from './PortfolioFilters.vue'
  import ProjectCard from './ProjectCard.vue'
  import { getPortfolioCtaColumnClass } from '~/utils/portfolioLayout'

  const props = defineProps<{ title: string; projects: PortfolioCardProject[] }>()

  const sectionRef = ref<HTMLElement | null>(null)
  const selectedFilter = ref<PortfolioFilter>('Todos')
  useSectionReveal(sectionRef, 0.14)

  const filteredProjects = computed(() => {
    if (selectedFilter.value === 'Clientes') {
      return props.projects.filter(project => project.type === 'cliente')
    }

    if (selectedFilter.value === 'Productos propios') {
      return props.projects.filter(project => project.type === 'propio')
    }

    return props.projects
  })

  const portfolioCards = computed(() =>
    filteredProjects.value.map((project, index) => ({
      project,
      variant: getPortfolioCardVariant(index, filteredProjects.value.length)
    }))
  )

  function getPortfolioCardVariant(index: number, projectCount: number): PortfolioCardVariant {
    if (projectCount === 1) return 'balanced'
    return index < 2 ? 'featured' : 'secondary'
  }

  const portfolioCtaDesktopClass = computed(() =>
    getPortfolioCtaColumnClass(filteredProjects.value.length)
  )
</script>

<template>
  <section
    id="portfolio"
    ref="sectionRef"
    class="portfolio-reveal mx-auto w-full max-w-7xl"
    aria-labelledby="portfolio-heading"
  >
    <header class="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-start md:justify-between">
      <div class="max-w-2xl">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent-text">
          {{ title }}
        </p>
        <h2
          id="portfolio-heading"
          class="text-2xl font-semibold leading-tight text-brand-ink md:text-3xl"
        >
          Soluciones que generan Impacto
        </h2>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-brand-muted md:text-base md:leading-7">
          Proyectos que integran tecnología y necesidades concretas para construir soluciones
          útiles.
        </p>
      </div>
      <div class="md:shrink-0 md:pt-7">
        <PortfolioFilters v-model="selectedFilter" />
      </div>
    </header>

    <TransitionGroup
      name="project-list"
      tag="div"
      class="relative grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-6 xl:gap-5"
    >
      <ProjectCard
        v-for="card in portfolioCards"
        :key="card.project.id"
        :project="card.project"
        :variant="card.variant"
      />

      <article
        key="portfolio-all-projects"
        :class="portfolioCtaDesktopClass"
        class="flex min-h-[230px] flex-col gap-6 rounded-2xl border border-brand-border bg-brand-surface-card p-5 text-brand-ink shadow-[0_8px_22px_var(--color-brand-shadow-card)] md:col-span-2 md:p-6"
      >
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-accent-text">
            Portafolio
          </p>
          <h3 class="text-lg font-semibold leading-snug md:text-xl">¿Buscas algo más?</h3>
        </div>
        <NuxtLink v-slot="{ href, navigate }" to="/portafolio" custom>
          <Button
            as="a"
            :href="href"
            theme="primary"
            size="md"
            class="mt-auto w-fit self-end focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
            @click="navigate"
          >
            Ver todos los proyectos
          </Button>
        </NuxtLink>
      </article>
    </TransitionGroup>
  </section>
</template>

<style scoped>
  .portfolio-reveal.is-reveal-pending {
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

    .portfolio-reveal.is-reveal-pending,
    .portfolio-reveal {
      opacity: 1;
      transform: none;
    }
  }
</style>
