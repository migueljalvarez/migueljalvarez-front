<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { Chip } from '~/components/atoms'
  import { FilterPills, SectionHeader } from '~/components/molecules'
  import { ProjectFillerCard, ProjectListCard } from '~/components/organisms'
  import { HOME_COPY } from '~/constants/common'
  import type { PortfolioFilter } from '~/types/portfolio'
  import { getAvailablePortfolioFilters } from '~/utils/portfolioFilters'
  import { filterPortfolioCards, showFillerCard, splitFeatured } from '~/utils/portfolioList'
  import type { PortfolioListProps } from '../template'

  // Portafolio público (`/portafolio` y la home): destacado a ancho completo, resto en grid de 2 columnas y, con
  // menos de 3 proyectos publicados, la tarjeta «Siguiente proyecto». Los datos y su orden vienen de la API.
  const props = withDefaults(defineProps<PortfolioListProps>(), {
    eyebrow: 'Portafolio',
    heading: 'Lo que he construido y por qué',
    description:
      'Una selección de productos, plataformas y sistemas construidos para resolver problemas concretos.',
    headingLevel: 'h1',
    sectionId: 'portfolio-page',
    showFilters: true,
    showViewAll: false,
    reveal: false
  })

  const sectionRef = ref<HTMLElement | null>(null)
  if (props.reveal) useSectionReveal(sectionRef, 0.14)

  // Bajo el h1 de la página los títulos de tarjeta son h2; bajo el h2 de la home, h3.
  const cardHeadingLevel = computed(() => (props.headingLevel === 'h1' ? 'h2' : 'h3'))

  const selectedFilter = ref<PortfolioFilter>('all')
  // Los chips de filtro solo existen si hay al menos un proyecto de cada tipo.
  const availableFilters = computed(() => getAvailablePortfolioFilters(props.projects))
  const showFilters = computed(() => props.showFilters && availableFilters.value.length > 2)

  const visible = computed(() =>
    showFilters.value ? filterPortfolioCards(props.projects, selectedFilter.value) : props.projects
  )
  const split = computed(() => splitFeatured(visible.value))
  // El relleno solo acompaña al listado completo: con un filtro activo sería ruido.
  const showFiller = computed(
    () => selectedFilter.value === 'all' && showFillerCard(props.projects)
  )
  const hasSampleData = computed(() => props.projects.some(project => project.sample))
</script>

<template>
  <section
    :id="sectionId"
    ref="sectionRef"
    class="portfolio-reveal mx-auto w-full max-w-7xl"
    :aria-labelledby="`${sectionId}-heading`"
  >
    <header class="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <SectionHeader
        :eyebrow="eyebrow"
        :heading="heading"
        :description="description"
        :level="headingLevel"
        :heading-id="`${sectionId}-heading`"
        class="max-w-3xl"
      >
        <template #eyebrow-extra>
          <Chip
            v-if="hasSampleData"
            tone="warning"
            size="sm"
            pill
            class="ml-2 normal-case tracking-normal"
          >
            Datos de ejemplo (solo desarrollo)
          </Chip>
        </template>
      </SectionHeader>
      <FilterPills
        v-if="showFilters"
        v-model="selectedFilter"
        :filters="availableFilters"
        class="md:shrink-0"
      />
      <NuxtLink
        v-else-if="showViewAll"
        to="/portafolio"
        class="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-logo-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent-text md:shrink-0"
      >
        {{ HOME_COPY.portfolio.allCta }}
        <Icon name="mdi:arrow-right" size="16" aria-hidden="true" />
      </NuxtLink>
    </header>

    <div class="flex flex-col gap-6 md:gap-8">
      <ProjectListCard
        v-if="split.featured"
        :key="split.featured.id"
        :project="split.featured"
        :heading-level="cardHeadingLevel"
        featured
      />

      <div
        v-if="split.rest.length || showFiller"
        class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      >
        <ProjectListCard
          v-for="project in split.rest"
          :key="project.id"
          :project="project"
          :heading-level="cardHeadingLevel"
        />
        <ProjectFillerCard v-if="showFiller" :heading-level="cardHeadingLevel" />
      </div>
    </div>
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
    .portfolio-reveal,
    .portfolio-reveal.is-reveal-pending {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
