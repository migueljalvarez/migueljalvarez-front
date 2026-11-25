<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { Chip } from '~/components/atoms'
  import { FilterPills, SectionHeader } from '~/components/molecules'
  import { ProjectFillerCard, ProjectListCard } from '~/components/organisms'
  import type { PortfolioFilter } from '~/types/portfolio'
  import {
    filterPortfolioCards,
    hasBothProjectTypes,
    showFillerCard,
    splitFeatured
  } from '~/utils/portfolioList'
  import type { PortfolioListProps } from '../template'

  // Listado `/portafolio`: destacado a ancho completo, resto en grid de 2 columnas y, con menos de 3 proyectos
  // publicados, la tarjeta «Siguiente proyecto». Los datos y su orden vienen de la API.
  const props = defineProps<PortfolioListProps>()

  const selectedFilter = ref<PortfolioFilter>('all')
  const availableFilters = computed<PortfolioFilter[]>(() => ['all', 'client', 'product'])
  const showFilters = computed(() => hasBothProjectTypes(props.projects))

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
  <section class="mx-auto w-full max-w-7xl" aria-labelledby="portfolio-page-heading">
    <header class="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <SectionHeader
        eyebrow="Portafolio"
        heading="Soluciones que generan impacto"
        description="Una selección de productos, plataformas y sistemas construidos para resolver problemas concretos."
        level="h1"
        heading-id="portfolio-page-heading"
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
    </header>

    <div class="flex flex-col gap-6 md:gap-8">
      <ProjectListCard
        v-if="split.featured"
        :key="split.featured.id"
        :project="split.featured"
        featured
      />

      <div
        v-if="split.rest.length || showFiller"
        class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      >
        <ProjectListCard v-for="project in split.rest" :key="project.id" :project="project" />
        <ProjectFillerCard v-if="showFiller" />
      </div>
    </div>
  </section>
</template>
