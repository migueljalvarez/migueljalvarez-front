<script lang="ts" setup>
  import { computed } from 'vue'
  import { Heading } from '~/components/atoms'
  import { columnsFor } from '~/utils/portfolioList'
  import type { ProjectStoryProps } from '../organism'

  // «La historia»: hasta 3 tarjetas numeradas. Si falta una se omite solo esa y el grid se reparte; sin ninguna,
  // la sección no se renderiza (ni título huérfano).
  const props = defineProps<ProjectStoryProps>()

  const steps = computed(() =>
    [
      { title: 'El problema', text: props.problem },
      { title: 'Lo que decidí y por qué', text: props.decision },
      { title: 'El resultado', text: props.result }
    ].filter(step => !!step.text?.trim())
  )

  const gridClass = computed(
    () =>
      ({ 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' })[
        columnsFor(steps.value.length)
      ]
  )
</script>

<template>
  <section v-if="steps.length" aria-labelledby="project-story-heading">
    <Heading id="project-story-heading" level="h2" class="mb-6">La historia</Heading>
    <ol class="grid grid-cols-1 gap-5 md:gap-6" :class="gridClass">
      <li
        v-for="(step, index) in steps"
        :key="step.title"
        class="flex min-w-0 flex-col gap-3 rounded-2xl bg-brand-surface-card p-6 shadow-card md:p-7"
      >
        <span class="font-display text-3xl font-semibold text-brand" aria-hidden="true">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        <h3 class="text-lg font-semibold leading-tight text-brand-ink md:text-xl">
          {{ step.title }}
        </h3>
        <p class="whitespace-pre-line text-base leading-7 text-brand-muted">{{ step.text }}</p>
      </li>
    </ol>
  </section>
</template>
