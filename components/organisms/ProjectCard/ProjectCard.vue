<script lang="ts" setup>
  import { NuxtLink } from '#components'
  import { Chip } from '~/components/atoms'
  import type { ProjectCardProps } from '../organism'

  withDefaults(defineProps<ProjectCardProps>(), { headingLevel: 'h3' })
</script>

<template>
  <component
    :is="project.href ? NuxtLink : 'article'"
    :to="project.href"
    class="group relative isolate flex min-h-65 min-w-0 flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-card text-brand-ink shadow-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent-text"
    :class="[
      { 'cursor-pointer': project.href },
      layoutMode === 'horizontal' ? 'md:flex-row' : '',
      layoutMode === 'two' ? (variant === 'featured' ? 'md:col-span-2' : 'md:col-span-1') : '',
      layoutMode === 'three'
        ? variant === 'featured'
          ? 'md:col-span-2 md:row-span-2'
          : 'md:col-span-1 md:min-h-64'
        : '',
      layoutMode === 'bento'
        ? variant === 'featured'
          ? 'md:col-span-2 xl:col-span-4'
          : 'md:col-span-1 xl:col-span-2'
        : ''
    ]"
    :aria-label="project.href ? `${project.title}: ver proyecto` : project.title"
  >
    <div
      class="relative aspect-video w-full shrink-0 md:aspect-16/10 overflow-hidden bg-brand-surface-panel"
      :class="layoutMode === 'horizontal' ? 'md:w-1/2' : ''"
    >
      <NuxtImg
        v-if="project.image"
        :src="project.image"
        :alt="''"
        aria-hidden="true"
        :sizes="variant === 'featured' ? '100vw md:66vw xl:66vw' : '100vw md:50vw xl:33vw'"
        format="webp"
        :quality="90"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div
        v-else
        class="relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--color-brand-surface-contrast),var(--color-brand-navy),var(--color-brand-mid))] text-brand-text-soft"
      >
        <svg
          class="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 320 200"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <g stroke="currentColor" stroke-width="1.5">
            <path
              d="M80 8h40l20 35-20 35H80L60 43 80 8Zm120 0h40l20 35-20 35h-40l-20-35 20-35ZM20 78h40l20 35-20 35H20L0 113l20-35Zm120 0h40l20 35-20 35h-40l-20-35 20-35Zm120 0h40l20 35-20 35h-40l-20-35 20-35Z"
            />
          </g>
        </svg>
        <p
          aria-hidden="true"
          class="relative z-10 max-w-[80%] text-center text-lg font-semibold leading-tight text-brand-text-strong md:text-xl"
        >
          {{ project.title }}
        </p>
      </div>
      <div class="absolute left-4 top-4 flex flex-wrap items-center gap-2">
        <Chip
          v-if="showTypeBadge"
          :tone="project.type === 'client' ? 'brand' : 'success'"
          uppercase
        >
          {{ project.type === 'client' ? 'Cliente' : 'Producto propio' }}
        </Chip>
        <Chip v-if="project.status === 'in-development'" tone="warning">En desarrollo</Chip>
        <Chip v-if="project.tags[0]">{{ project.tags[0] }}</Chip>
      </div>
    </div>

    <div
      class="relative z-10 flex flex-1 flex-col p-5 md:p-6"
      :class="[layoutMode === 'horizontal' ? 'md:flex-1 md:justify-center' : '']"
    >
      <component :is="headingLevel" class="text-lg font-semibold leading-tight sm:text-xl">
        {{ project.title }}
      </component>
      <p class="mt-2 text-sm leading-5 text-brand-muted">
        {{ project.description }}
      </p>
      <p class="mt-auto pt-4 text-sm text-brand-muted">Dirigido a {{ project.audience }}</p>
    </div>
  </component>
</template>
