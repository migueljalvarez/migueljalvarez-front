<script lang="ts" setup>
  import { computed } from 'vue'
  import { columnsFor } from '~/utils/portfolioList'
  import type { ProjectHighlightsProps } from '../organism'

  // Cifras destacadas (0–6) en una banda oscura. Sin cifras, la sección no se renderiza.
  const props = defineProps<ProjectHighlightsProps>()

  const gridClass = computed(
    () =>
      ({ 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' })[
        columnsFor(props.items.length)
      ]
  )
</script>

<template>
  <section
    v-if="items.length"
    class="rounded-[1.25rem] bg-surface-inverse p-7 text-brand-text-strong md:p-12"
    aria-labelledby="project-highlights-heading"
  >
    <h2
      id="project-highlights-heading"
      class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-warm"
    >
      Cifras destacadas
    </h2>
    <ul class="mt-6 grid grid-cols-1 gap-8 md:mt-8" :class="gridClass">
      <li v-for="item in items" :key="item.label" class="flex min-w-0 flex-col gap-1.5">
        <span class="font-display text-4xl font-semibold md:text-5xl">{{ item.value }}</span>
        <span class="text-sm leading-6 text-brand-text-subtle">{{ item.label }}</span>
      </li>
    </ul>
  </section>
</template>
