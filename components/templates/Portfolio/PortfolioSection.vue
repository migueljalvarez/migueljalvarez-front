<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import type {
    PortfolioCardProject,
    PortfolioCardVariant,
    PortfolioFilter,
    PortfolioLayoutMode
  } from './portfolio.types'
  import Button from '~/components/atoms/Button/Button.vue'
  import PortfolioFilters from './PortfolioFilters.vue'
  import ProjectCard from './ProjectCard.vue'
  import { HOME_COPY } from '~/constants/common'
  import { getAvailablePortfolioFilters } from '~/utils/portfolioFilters'

  const props = withDefaults(
    defineProps<{
      title: string
      projects: PortfolioCardProject[]
      heading?: string
      description?: string
      headingLevel?: 'h1' | 'h2'
      sectionId?: string
      showViewAll?: boolean
      reveal?: boolean
    }>(),
    {
      heading: HOME_COPY.portfolio.heading,
      description: HOME_COPY.portfolio.description,
      headingLevel: 'h2',
      sectionId: 'portfolio',
      showViewAll: true,
      reveal: true
    }
  )

  const sectionRef = ref<HTMLElement | null>(null)
  const selectedFilter = ref<PortfolioFilter>('Todos')
  if (props.reveal) useSectionReveal(sectionRef, 0.14)

  const availableFilters = computed(() => getAvailablePortfolioFilters(props.projects))
  const hasMultipleProjectTypes = computed(() => availableFilters.value.length > 2)

  const layout = computed(() => {
    const count = props.projects.length
    const mode: PortfolioLayoutMode =
      count === 0
        ? 'empty'
        : count === 1
          ? 'horizontal'
          : count === 2
            ? 'two'
            : count === 3
              ? 'three'
              : 'bento'

    return {
      mode,
      showFilters: count >= 4 && availableFilters.value.length > 2,
      showViewAllCard: count >= 4 && props.showViewAll,
      showViewAllLink: count > 0 && count < 4 && props.showViewAll,
      gridClass:
        mode === 'horizontal'
          ? 'md:grid-cols-1'
          : mode === 'two'
            ? 'md:grid-cols-3'
            : mode === 'three'
              ? 'md:auto-rows-min md:grid-cols-3'
              : 'md:grid-cols-2 xl:grid-cols-6'
    }
  })

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
    filteredProjects.value.map((project, index) => {
      let variant: PortfolioCardVariant = 'default'

      if (layout.value.mode === 'horizontal') variant = 'horizontal'
      else if (layout.value.mode === 'two' || layout.value.mode === 'three') {
        variant = index === 0 ? 'featured' : 'default'
      } else if (layout.value.mode === 'bento') {
        variant = project.primary || index === 0 ? 'featured' : 'default'
      }

      return { project, variant }
    })
  )
</script>

<template>
  <section
    v-if="layout.mode !== 'empty'"
    :id="sectionId"
    ref="sectionRef"
    class="portfolio-reveal mx-auto w-full max-w-7xl"
    :aria-labelledby="`${sectionId}-heading`"
  >
    <header class="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-start md:justify-between">
      <div class="max-w-3xl">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent-text">
          {{ title }}
        </p>
        <component
          :is="headingLevel"
          :id="`${sectionId}-heading`"
          class="text-2xl font-semibold leading-tight text-brand-ink md:text-3xl"
        >
          {{ heading }}
        </component>
        <p class="mt-3 max-w-3xl text-sm leading-6 text-brand-muted md:text-base md:leading-7">
          {{ description }}
        </p>
      </div>
      <div v-if="layout.showFilters" class="md:shrink-0 md:pt-7">
        <PortfolioFilters v-model="selectedFilter" :filters="availableFilters" />
      </div>
      <NuxtLink
        v-else-if="layout.showViewAllLink"
        to="/portafolio"
        class="inline-flex min-h-10 items-center gap-1 self-end text-sm font-semibold text-brand-accent-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent-text md:ml-auto md:mt-7"
      >
        Ver todos los proyectos
        <Icon name="mdi:arrow-right" size="16" aria-hidden="true" />
      </NuxtLink>
    </header>

    <TransitionGroup
      :css="showViewAll"
      tag="div"
      class="relative grid min-w-0 grid-cols-1 gap-4 md:gap-5 xl:gap-5"
      :class="layout.gridClass"
      enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="absolute transition duration-200 ease-out motion-reduce:transition-none"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
      move-class="transition duration-200 ease-out motion-reduce:transition-none"
    >
      <ProjectCard
        v-for="card in portfolioCards"
        :key="card.project.id"
        :project="card.project"
        :variant="card.variant"
        :layout-mode="layout.mode"
        :show-type-badge="hasMultipleProjectTypes"
      />

      <article
        v-if="layout.showViewAllCard"
        key="portfolio-all-projects"
        class="col-span-full flex min-h-0 flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl border border-brand-border-strong bg-brand-surface-contrast p-5 text-left text-brand-text-strong shadow-[0_8px_22px_var(--color-brand-shadow-card)] sm:flex-row sm:items-center sm:gap-6 md:p-6"
      >
        <div class="flex min-w-0 items-center gap-4">
          <span
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-surface-panel"
            aria-hidden="true"
          >
            <Icon name="mdi:folder-multiple-outline" size="24" class="text-brand-text-soft" />
          </span>
          <div class="min-w-0">
            <h3 class="mt-1 text-md font-semibold leading-snug text-brand-text-strong md:text-xl">
              {{ HOME_COPY.portfolio.allHeading }}
            </h3>
            <p class="mt-1 text-xs leading-6 text-brand-text-subtle">
              {{ HOME_COPY.portfolio.allDescription }}
            </p>
          </div>
        </div>
        <NuxtLink v-slot="{ href, navigate }" to="/portafolio" custom>
          <Button as="a" :href="href ?? undefined" theme="primary" size="md" @click="navigate">
            {{ HOME_COPY.portfolio.allCta }}
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

  @media (prefers-reduced-motion: reduce) {
    .portfolio-reveal {
      transition: none;
    }

    .portfolio-reveal.is-reveal-pending,
    .portfolio-reveal {
      opacity: 1;
      transform: none;
    }
  }
</style>
