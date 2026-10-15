<script lang="ts" setup>
  import { NuxtLink } from '#components'
  import type {
    PortfolioCardProject,
    PortfolioCardVariant,
    PortfolioLayoutMode
  } from './portfolio.types'

  defineProps<{
    project: PortfolioCardProject
    variant: PortfolioCardVariant
    layoutMode: PortfolioLayoutMode
    showTypeBadge: boolean
  }>()
</script>

<template>
  <component
    :is="project.href ? NuxtLink : 'article'"
    :to="project.href"
    class="group relative isolate flex min-h-65 min-w-0 flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-card text-brand-ink shadow-[0_8px_22px_var(--color-brand-shadow-card)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent-text"
    :class="[
      { 'cursor-pointer': project.href },
      layoutMode === 'horizontal' ? 'md:flex-row' : '',
      layoutMode === 'two'
        ? variant === 'featured'
          ? 'md:col-span-2'
          : 'md:col-span-1'
        : '',
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
    :aria-label="`${project.title}: ver proyecto`"
  >
    <div
      class="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-brand-surface-panel"
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
            <path d="M80 8h40l20 35-20 35H80L60 43 80 8Zm120 0h40l20 35-20 35h-40l-20-35 20-35ZM20 78h40l20 35-20 35H20L0 113l20-35Zm120 0h40l20 35-20 35h-40l-20-35 20-35Zm120 0h40l20 35-20 35h-40l-20-35 20-35Z" />
          </g>
        </svg>
        <p
          class="relative z-10 max-w-[80%] text-center text-lg font-semibold leading-tight text-brand-text-strong md:text-xl"
        >
          {{ project.title }}
        </p>
      </div>
      <div class="absolute left-4 top-4 flex flex-wrap items-center gap-2">
        <span
          v-if="showTypeBadge"
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
          v-if="project.tags[0]"
          class="rounded-md border border-brand-border bg-brand-surface-soft px-2.5 py-1 text-[11px] text-brand-muted"
        >
          {{ project.tags[0] }}
        </span>
      </div>
    </div>

    <div
      class="relative z-10 flex flex-1 flex-col p-4 md:p-5"
      :class="[
        layoutMode === 'horizontal' ? 'md:flex-1 md:justify-center' : '',
        layoutMode === 'three' && variant === 'default' ? 'md:p-3' : ''
      ]"
    >
      <h3 class="text-lg font-semibold leading-tight sm:text-xl">
        {{ project.title }}
      </h3>
      <p class="mt-2 text-sm leading-5 text-brand-muted">
        {{ project.description }}
      </p>
      <div v-if="project.href" class="mt-auto flex items-center justify-between gap-3 pt-4">
        <p class="min-w-0 flex-1 text-xs text-brand-muted">Dirigido a {{ project.audience }}</p>
        <Icon
          name="mdi:arrow-right"
          size="16"
          class="shrink-0 text-brand-blue"
          aria-hidden="true"
        />
      </div>
    </div>
  </component>
</template>
