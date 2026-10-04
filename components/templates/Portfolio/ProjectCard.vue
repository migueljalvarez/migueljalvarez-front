<script lang="ts" setup>
  import { NuxtLink } from '#components'
  import type { PortfolioCardProject } from './portfolio.types'

  defineProps<{
    project: PortfolioCardProject
    featured?: boolean
    desktopFeatured?: boolean
    desktopSecondary?: boolean
    desktopBalanced?: boolean
  }>()
</script>

<template>
  <component
    :is="project.href ? NuxtLink : 'article'"
    :to="project.href"
    class="project-card group relative isolate flex min-h-[280px] min-w-0 flex-col justify-end overflow-hidden rounded-3xl border border-brand-border-soft/70 bg-brand-surface-panel shadow-[0_8px_22px_var(--color-brand-shadow-card)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-brand-blue-on-dark hover:shadow-[0_12px_28px_var(--color-brand-shadow-card)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent-text motion-reduce:transform-none motion-reduce:transition-none md:min-h-0"
    :class="{
      'md:h-[310px]': featured,
      'md:h-[230px]': !featured,
      'xl:col-span-3 xl:h-[320px]': desktopFeatured,
      'xl:col-span-2 xl:h-[230px]': desktopSecondary,
      'xl:col-span-3 xl:h-[310px]': desktopBalanced,
      'xl:col-span-2': !desktopFeatured && !desktopSecondary && !desktopBalanced
    }"
    :aria-label="project.href ? `${project.title}: ver proyecto` : undefined"
  >
    <div class="project-card__image absolute inset-0 -z-20 bg-brand-surface-panel">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="''"
        aria-hidden="true"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100 motion-reduce:transition-none"
        loading="lazy"
      />
      <div v-else class="project-card__pattern h-full w-full" />
    </div>

    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-brand-project-overlay via-brand-project-overlay/70 to-brand-project-overlay/5"
    />

    <div class="relative z-10 max-w-3xl p-5 pb-7 text-brand-text-strong sm:p-6 sm:pb-7">
      <div class="mb-3 flex flex-wrap items-center gap-2 pr-12">
        <span
          class="rounded-full border px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm"
          :class="
            project.type === 'cliente'
              ? 'border-brand-blue-on-dark/70 bg-brand-surface-contrast/90 text-brand-blue-on-dark'
              : 'border-brand-accent/80 bg-brand-accent text-brand-text-strong'
          "
        >
          {{ project.type === 'cliente' ? 'Cliente' : 'Producto propio' }}
        </span>
        <span
          v-if="project.mock"
          class="rounded-full border border-brand-border-soft/80 bg-brand-surface-contrast/90 px-3 py-1 text-xs font-medium text-brand-text-subtle backdrop-blur-sm"
        >
          Mock
        </span>
        <span
          v-if="project.status"
          class="rounded-full border border-brand-border-soft/80 bg-brand-surface-contrast/90 px-3 py-1 text-xs text-brand-text-subtle backdrop-blur-sm"
        >
          {{ project.status }}
        </span>
      </div>

      <h3 class="mb-2 text-xl font-semibold leading-tight sm:text-2xl xl:text-xl">
        {{ project.title }}
      </h3>
      <p
        class="line-clamp-2 max-w-2xl text-sm leading-6 text-brand-text-subtle md:text-base xl:text-sm xl:leading-5"
      >
        {{ project.description }}
      </p>

      <div class="mt-3 flex flex-wrap gap-1.5 pr-12">
        <span
          class="rounded-full border border-brand-border-soft/70 bg-brand-surface-contrast/90 px-2.5 py-1 text-xs text-brand-text-subtle backdrop-blur-sm"
        >
          {{ project.projectKind }}
        </span>
        <span
          class="rounded-full border border-brand-border-soft/70 bg-brand-surface-contrast/90 px-2.5 py-1 text-xs text-brand-text-subtle backdrop-blur-sm"
        >
          {{ project.sector }}
        </span>
      </div>
      <p
        class="mt-2 w-fit rounded bg-brand-surface-contrast/80 px-1.5 py-0.5 pr-12 text-xs leading-5 text-brand-text-subtle xl:text-xs xl:leading-4"
      >
        Dirigido a {{ project.audience }}
      </p>
    </div>

    <span
      v-if="project.href"
      class="absolute bottom-5 right-5 z-20 flex size-11 items-center justify-center rounded-full border border-brand-border-soft bg-brand-surface-panel/75 text-brand-text-strong backdrop-blur-sm transition-colors duration-200 group-hover:border-brand-blue-on-dark group-hover:bg-brand-accent group-focus-visible:border-brand-accent group-focus-visible:bg-brand-accent motion-reduce:transition-none"
      aria-hidden="true"
    >
      <Icon
        name="mdi:arrow-right"
        size="21"
        class="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:transition-none"
      />
    </span>
  </component>
</template>

<style scoped>
  .project-card__pattern {
    background-color: var(--color-brand-surface-panel);
    background-image:
      radial-gradient(
        circle at 75% 25%,
        color-mix(in srgb, var(--color-brand-blue-on-dark) 22%, transparent),
        transparent 35%
      ),
      repeating-linear-gradient(
        135deg,
        transparent 0 20px,
        color-mix(in srgb, var(--color-brand-border-soft) 32%, transparent) 20px 21px
      );
  }
</style>
