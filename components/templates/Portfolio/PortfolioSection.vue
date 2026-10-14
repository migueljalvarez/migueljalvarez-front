<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import type { PortfolioCardProject, PortfolioFilter } from './portfolio.types'
  import Button from '~/components/atoms/Button/Button.vue'
  import PortfolioFilters from './PortfolioFilters.vue'
  import ProjectCard from './ProjectCard.vue'
  import { getPortfolioCardVariant, getPortfolioCtaColumnClass } from '~/utils/portfolioLayout'
  import { HOME_COPY } from '~/constants/common'

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

  const filteredProjects = computed(() => {
    if (selectedFilter.value === 'Clientes') {
      return props.projects.filter(project => project.type === 'cliente')
    }

    if (selectedFilter.value === 'Productos propios') {
      return props.projects.filter(project => project.type === 'propio')
    }

    return props.projects
  })

  const portfolioCards = computed(() => {
    const projectCount = filteredProjects.value.length

    return filteredProjects.value.map(project => ({
      project,
      variant: getPortfolioCardVariant(project, projectCount)
    }))
  })

  const portfolioCtaDesktopClass = computed(() =>
    getPortfolioCtaColumnClass(portfolioCards.value.map(card => card.variant))
  )
</script>

<template>
  <section
    :id="sectionId"
    ref="sectionRef"
    class="portfolio-reveal mx-auto w-full max-w-7xl"
    :aria-labelledby="`${sectionId}-heading`"
  >
    <header class="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-start md:justify-between">
      <div class="max-w-2xl">
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
        <p class="mt-3 max-w-2xl text-sm leading-6 text-brand-muted md:text-base md:leading-7">
          {{ description }}
        </p>
      </div>
      <div class="md:shrink-0 md:pt-7">
        <PortfolioFilters v-model="selectedFilter" />
      </div>
    </header>

    <TransitionGroup
      :css="showViewAll"
      tag="div"
      class="relative grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-6 xl:gap-5"
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
      />

      <article
        v-if="showViewAll"
        key="portfolio-all-projects"
        :class="portfolioCtaDesktopClass"
        class="flex min-h-80 flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl border border-brand-border-strong bg-brand-surface-contrast p-5 text-center text-brand-text-strong shadow-[0_8px_22px_var(--color-brand-shadow-card)] md:col-span-2 md:p-6"
      >
        <div class="flex flex-col items-center">
          <span
            class="flex size-14 items-center justify-center rounded-xl bg-brand-surface-panel"
            aria-hidden="true"
          >
            <Icon name="mdi:folder-multiple-outline" size="28" class="text-brand-text-soft" />
          </span>
          <p class="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-text-soft">
            {{ HOME_COPY.portfolio.allLabel }}
          </p>
          <h3 class="mt-2 text-lg font-semibold leading-snug text-brand-text-strong md:text-xl">
            {{ HOME_COPY.portfolio.allHeading }}
          </h3>
          <p class="mt-3 max-w-[34ch] text-sm leading-6 text-brand-text-subtle">
            {{ HOME_COPY.portfolio.allDescription }}
          </p>
        </div>
        <NuxtLink v-slot="{ href, navigate }" to="/portafolio" custom>
          <Button
            as="a"
            :href="href ?? undefined"
            theme="primary"
            size="md"
            uppercase
            class="mt-auto w-full border border-brand-border-strong bg-brand-surface-panel text-brand-text-strong shadow-none hover:bg-brand-mid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
            @click="navigate"
          >
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
