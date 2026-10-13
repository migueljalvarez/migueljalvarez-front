<script lang="ts" setup>
  import { NuxtLink } from '#components'
  import type { PortfolioCardProject, PortfolioCardVariant } from './portfolio.types'

  defineProps<{
    project: PortfolioCardProject
    variant: PortfolioCardVariant
  }>()
</script>

<template>
  <component
    :is="project.href ? NuxtLink : 'article'"
    :to="project.href"
    class="group relative isolate flex min-w-0 flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-card text-brand-ink shadow-[0_8px_22px_var(--color-brand-shadow-card)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-brand-border-strong hover:shadow-[0_12px_28px_var(--color-brand-shadow-card)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent-text motion-reduce:transform-none motion-reduce:transition-none"
    :class="[
      {
        'md:min-h-[310px]': variant === 'featured' || variant === 'balanced',
        'min-h-[200px] md:min-h-[230px]': variant === 'secondary'
      }
    ]"
    :aria-label="project.href ? `${project.title}: ver proyecto` : undefined"
  >
    <div
      class="relative w-full overflow-hidden bg-brand-surface-panel"
      :class="variant === 'secondary' ? 'h-36 md:h-40' : 'h-40 md:h-52 xl:h-56'"
    >
      <img
        v-if="project.image"
        :src="project.image"
        :alt="''"
        aria-hidden="true"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100 motion-reduce:transition-none"
        loading="lazy"
      />
      <div
        v-else
        class="h-full w-full bg-brand-surface-panel [background-image:radial-gradient(circle_at_75%_25%,color-mix(in_srgb,var(--color-brand-blue)_22%,transparent),transparent_35%),repeating-linear-gradient(135deg,transparent_0_20px,color-mix(in_srgb,var(--color-brand-border-soft)_32%,transparent)_20px_21px)]"
      />
      <div class="absolute left-4 top-4 flex flex-wrap items-center gap-2">
        <span
          class="rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-white"
          :class="
            project.type === 'cliente'
              ? 'border-brand-blue bg-brand-blue'
              : 'border-emerald-600 bg-emerald-600'
          "
        >
          {{ project.type === 'cliente' ? 'Cliente' : 'Producto propio' }}
        </span>
        <span
          v-if="project.mock"
          class="rounded-md border border-brand-border bg-brand-surface-soft px-2.5 py-1 text-[11px] text-brand-muted"
        >
          Mock
        </span>
        <span
          v-if="project.status"
          class="rounded-md border border-brand-border bg-brand-surface-soft px-2.5 py-1 text-[11px] text-brand-muted"
        >
          {{ project.status }}
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-4 md:p-5">
      <h3 class="text-lg font-semibold leading-tight sm:text-xl">
        {{ project.title }}
      </h3>
      <p class="mt-2 text-sm leading-5 text-brand-muted">
        {{ project.description }}
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <span
          class="rounded-md border border-brand-border bg-brand-surface-soft px-2.5 py-1 text-[11px] text-brand-muted"
        >
          {{ project.projectKind }}
        </span>
        <span
          class="rounded-md border border-brand-border bg-brand-surface-soft px-2.5 py-1 text-[11px] text-brand-muted"
        >
          {{ project.sector }}
        </span>
      </div>
      <div
        class="mt-auto flex items-center justify-between gap-3 pt-4"
      >
        <p class="min-w-0 flex-1 text-xs text-brand-muted">Dirigido a {{ project.audience }}</p>
        <Icon
          v-if="project.href"
          name="mdi:arrow-right"
          size="16"
          class="shrink-0 text-brand-blue transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </div>
    </div>
  </component>
</template>
