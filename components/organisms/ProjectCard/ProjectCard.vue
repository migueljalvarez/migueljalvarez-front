<script lang="ts" setup>
  import { computed } from 'vue'
  import { NuxtLink } from '#components'
  import { Chip } from '~/components/atoms'
  import { ImageWithFallback } from '~/components/molecules'
  import { withFinalPeriod } from '~/utils/text'
  import type { ProjectCardProps } from '../organism'

  const props = withDefaults(defineProps<ProjectCardProps>(), { headingLevel: 'h3' })

  /** La imagen absorbe la altura sobrante cuando la tarjeta es más alta que su contenido (evita huecos en blanco). */
  const growImage = computed(
    () =>
      (props.layoutMode === 'three' && props.variant === 'featured') ||
      (props.layoutMode === 'two' && props.variant !== 'featured') ||
      (props.layoutMode === 'bento' && props.variant !== 'featured')
  )
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
      class="relative aspect-video w-full overflow-hidden bg-brand-surface-panel"
      :class="
        layoutMode === 'horizontal'
          ? 'shrink-0 md:aspect-auto md:min-h-80 md:w-3/5'
          : growImage
            ? 'shrink-0 md:aspect-auto md:min-h-60 md:flex-1'
            : 'shrink-0 md:aspect-16/10'
      "
    >
      <ImageWithFallback
        :src="project.image"
        alt=""
        :sizes="variant === 'featured' ? '100vw md:66vw xl:66vw' : '100vw md:50vw xl:33vw'"
        :quality="90"
        class="absolute inset-0"
      />
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
      class="relative z-10 flex flex-col p-5 md:p-6"
      :class="[
        growImage ? 'shrink-0' : 'flex-1',
        layoutMode === 'horizontal' ? 'md:justify-center md:gap-0 md:p-10' : ''
      ]"
    >
      <component
        :is="headingLevel"
        class="font-semibold leading-tight"
        :class="layoutMode === 'horizontal' ? 'text-xl md:text-3xl' : 'text-lg sm:text-xl'"
      >
        {{ project.title }}
      </component>
      <p
        class="mt-2 text-sm leading-5 text-brand-muted"
        :class="layoutMode === 'horizontal' ? 'md:mt-3 md:text-base md:leading-7' : ''"
      >
        {{ withFinalPeriod(project.description) }}
      </p>
      <p
        class="mt-auto pt-4 text-sm text-brand-muted"
        :class="layoutMode === 'horizontal' ? 'md:mt-6 md:pt-0' : ''"
      >
        Dirigido a {{ withFinalPeriod(project.audience) }}
      </p>
      <span
        v-if="layoutMode === 'horizontal' && project.href"
        class="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand-accent-text md:mt-5"
        aria-hidden="true"
      >
        Ver proyecto
        <Icon
          name="mdi:arrow-right"
          size="16"
          class="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </span>
    </div>
  </component>
</template>
