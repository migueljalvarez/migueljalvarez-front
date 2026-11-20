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

  const hasChips = computed(
    () =>
      props.showTypeBadge || props.project.status === 'in-development' || !!props.project.tags[0]
  )
  const externalUrl = computed(() =>
    props.project.url && /^https:\/\//.test(props.project.url) ? props.project.url : ''
  )

  const ctaClass =
    'inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-logo-blue underline-offset-4 transition-colors duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-blue motion-reduce:transition-none'
</script>

<template>
  <!-- Tarjeta completa clicable hacia la ficha mediante el enlace "Ver detalle" (se extiende con ::after);
       el enlace externo va por encima (z-20) para no anidar enlaces. -->
  <article
    class="group relative isolate flex min-h-65 min-w-0 flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-card text-brand-ink shadow-card has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-logo-blue"
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
      <!-- El recorte se ancla arriba a la izquierda: allí suelen estar el logo y el título de la imagen. -->
      <ImageWithFallback
        :src="project.image"
        alt=""
        :sizes="variant === 'featured' ? '100vw md:66vw xl:66vw' : '100vw md:50vw xl:33vw'"
        :quality="90"
        image-class="object-cover object-left-top"
        class="absolute inset-0"
      />
    </div>

    <div
      class="flex flex-col p-5 md:p-6"
      :class="[
        growImage ? 'shrink-0' : 'flex-1',
        layoutMode === 'horizontal' ? 'md:justify-center md:gap-0 md:p-10' : ''
      ]"
    >
      <!-- Las etiquetas viven en el cuerpo: sobre la imagen taparían su contenido (logo, título). -->
      <div v-if="hasChips" class="mb-3 flex flex-wrap items-center gap-2">
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
      <div class="mt-auto pt-4" :class="layoutMode === 'horizontal' ? 'md:mt-6 md:pt-0' : ''">
        <p class="text-sm text-brand-muted">Dirigido a {{ withFinalPeriod(project.audience) }}</p>
        <div
          v-if="project.href || externalUrl"
          class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1"
        >
          <NuxtLink
            v-if="project.href"
            v-track="{ id: 'cta_ver_proyecto', slug: project.slug }"
            :to="project.href"
            :class="[
              ctaClass,
              'after:absolute after:inset-0 after:z-10 after:content-[\'\'] focus-visible:outline-none'
            ]"
          >
            Ver detalle
            <span class="sr-only">de {{ project.title }}</span>
            <Icon
              name="mdi:arrow-right"
              size="16"
              class="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </NuxtLink>
          <a
            v-if="externalUrl"
            v-track="{ id: 'cta_ver_proyecto', slug: project.slug }"
            :href="externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            :class="[ctaClass, 'relative z-20']"
          >
            Visitar sitio
            <span class="sr-only">de {{ project.title }} (se abre en una pestaña nueva)</span>
            <Icon name="mdi:open-in-new" size="16" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </article>
</template>
