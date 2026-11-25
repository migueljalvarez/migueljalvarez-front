<script lang="ts" setup>
  import { computed } from 'vue'
  import { Button, Heading } from '~/components/atoms'
  import { BackLink, ImageWithFallback } from '~/components/molecules'
  import {
    ProjectGallery,
    ProjectHighlights,
    ProjectScope,
    ProjectStory
  } from '~/components/organisms'
  import { WHATSAPP_URL } from '~/constants/common'
  import { columnsFor } from '~/utils/portfolioList'
  import type { ProjectDetailProps } from '../template'

  // Ficha pública de un proyecto publicado. Solo se muestra lo que tiene contenido: ninguna sección vacía
  // deja un hueco ni un título huérfano.
  const props = defineProps<ProjectDetailProps>()

  const project = computed(() => props.project)
  const tags = computed(() => (project.value.tags ?? []).filter(tag => !!tag.trim()))
  const audience = computed(() => project.value.audience?.trim() ?? '')
  const facts = computed(() =>
    [
      { label: 'Rol', value: project.value.role },
      { label: 'Año', value: project.value.year },
      { label: 'Duración', value: project.value.duration }
    ].filter(item => !!item.value?.trim())
  )
  const factsGrid = computed(
    () => ({ 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' })[columnsFor(facts.value.length)]
  )
  const hasSide = computed(() => facts.value.length > 0 || !!project.value.url)
  const technologies = computed(() => (project.value.technologies ?? []).filter(Boolean))
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-12 md:gap-16">
    <header
      class="grid grid-cols-1 items-end gap-8"
      :class="hasSide ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-12' : ''"
    >
      <div class="flex min-w-0 flex-col gap-4">
        <BackLink to="/portafolio" class="mb-0 w-fit">Volver al portafolio</BackLink>
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-[0.1em] text-logo-blue">
            {{ project.portfolioType }}
          </span>
          <span
            v-for="tag in tags"
            :key="tag"
            class="rounded-full bg-brand-surface-soft px-3 py-1 text-xs font-semibold text-brand-accent-text"
          >
            {{ tag }}
          </span>
        </div>
        <Heading level="h1">{{ project.title }}</Heading>
        <p class="max-w-2xl text-lg leading-8 text-brand-muted">{{ project.description }}</p>
        <p v-if="audience" class="text-base leading-7 text-brand-muted">
          <span class="font-semibold text-brand-ink">Dirigido a</span>
          {{ audience }}
        </p>
      </div>

      <div v-if="hasSide" class="flex min-w-0 flex-col gap-4">
        <dl
          v-if="facts.length"
          class="grid gap-4 rounded-2xl bg-brand-surface-card p-5 shadow-card"
          :class="factsGrid"
        >
          <div v-for="fact in facts" :key="fact.label" class="min-w-0">
            <dt class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted">
              {{ fact.label }}
            </dt>
            <dd class="mt-1.5 break-words text-sm font-semibold text-brand-ink">
              {{ fact.value }}
            </dd>
          </div>
        </dl>
        <Button
          v-if="project.url"
          v-track="{ id: 'cta_ver_proyecto', slug: project.slug }"
          as="a"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          theme="primary"
          size="lg"
          icon="mdi:open-in-new"
          icon-position="right"
        >
          Ver proyecto
        </Button>
      </div>
    </header>

    <ImageWithFallback
      :src="project.urlImage"
      :alt="`Portada del proyecto ${project.title}`"
      :width="1280"
      :height="720"
      loading="eager"
      fetchpriority="high"
      class="relative aspect-video w-full rounded-[1.25rem] md:aspect-auto md:h-140"
    />

    <ProjectStory
      :problem="project.problem"
      :decision="project.decision"
      :result="project.result"
    />
    <ProjectHighlights :items="project.highlights ?? []" />
    <ProjectScope :items="project.scope ?? []" />
    <ProjectGallery :images="project.gallery ?? []" />

    <section
      v-if="technologies.length"
      class="flex flex-wrap items-center gap-3 border-t border-brand-border pt-8"
      aria-label="Tecnologías"
    >
      <p class="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
        Tecnologías
      </p>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="tech in technologies"
          :key="tech"
          class="rounded-lg border border-brand-shadow bg-brand-surface-card px-3 py-1.5 text-sm font-medium text-brand-ink"
        >
          {{ tech }}
        </li>
      </ul>
    </section>

    <aside
      class="flex flex-col gap-6 rounded-[1.25rem] bg-surface-inverse p-7 text-brand-text-strong md:flex-row md:items-center md:justify-between md:p-12"
      aria-labelledby="project-cta-heading"
    >
      <div class="max-w-xl">
        <h2 id="project-cta-heading" class="text-2xl font-semibold leading-tight md:text-3xl">
          ¿Tienes un problema parecido?
        </h2>
        <p class="mt-3 text-base leading-7 text-brand-text-soft">
          Cuéntame tu caso. Primero lo entendemos; después decidimos cómo construirlo.
        </p>
      </div>
      <Button
        v-track="{ id: 'wa_proyecto', slug: project.slug }"
        as="a"
        :href="WHATSAPP_URL"
        target="_blank"
        rel="noopener noreferrer"
        theme="whatsapp"
        size="lg"
        icon="mdi:whatsapp"
        icon-position="left"
        :on-dark="true"
        class="md:shrink-0"
      >
        Hablemos por WhatsApp
      </Button>
    </aside>
  </div>
</template>
