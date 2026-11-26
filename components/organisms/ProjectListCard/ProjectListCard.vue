<script lang="ts" setup>
  import { computed } from 'vue'
  import { Button } from '~/components/atoms'
  import { ImageWithFallback } from '~/components/molecules'
  import { withFinalPeriod } from '~/utils/text'
  import type { ProjectListCardProps } from '../organism'

  // Tarjeta del listado `/portafolio`. `featured` = destacado a ancho completo (portada a la izquierda);
  // sin él, tarjeta de grid (portada 16:9 arriba). En desarrollo: solo tarjeta, sin «Ver detalle» ni enlace.
  const props = withDefaults(defineProps<ProjectListCardProps>(), {
    featured: false,
    headingLevel: 'h2'
  })

  const inDevelopment = computed(() => props.project.status === 'in-development')
  const detailHref = computed(() => (inDevelopment.value ? '' : props.project.href))
  const externalUrl = computed(() =>
    !inDevelopment.value && props.project.url && /^https:\/\//.test(props.project.url)
      ? props.project.url
      : ''
  )
  const typeLabel = computed(() =>
    props.project.type === 'client' ? 'Cliente' : 'Producto propio'
  )
  const firstTag = computed(() => props.project.tags[0] ?? '')
  const audience = computed(() => props.project.audience?.trim() ?? '')

  const linkClass =
    'inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-logo-blue underline-offset-4 transition-colors duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-blue motion-reduce:transition-none'
  const outlineButtonClass = 'border-brand-accent text-brand-accent hover:bg-tint'
</script>

<template>
  <!-- Tarjeta de grid: clicable entera hacia la ficha con el enlace «Ver detalle» extendido (::after);
       el enlace externo va por encima (z-20) para no anidar enlaces. -->
  <article
    class="group relative isolate flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] bg-brand-surface-card text-brand-ink has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-logo-blue"
    :class="[
      featured ? 'shadow-card-lg lg:flex-row' : 'shadow-card',
      !featured && detailHref ? 'cursor-pointer' : ''
    ]"
  >
    <div
      class="relative aspect-video w-full shrink-0 overflow-hidden bg-brand-surface-panel"
      :class="featured ? 'lg:aspect-auto lg:min-h-96 lg:w-1/2' : ''"
    >
      <ImageWithFallback
        :src="project.image"
        :alt="`Portada del proyecto ${project.title}`"
        :sizes="featured ? '100vw lg:50vw' : '100vw md:50vw'"
        :quality="90"
        image-class="object-cover object-left-top"
        class="absolute inset-0"
      />
      <span
        v-if="firstTag"
        class="absolute left-4 top-4 z-10 max-w-[70%] truncate rounded-full bg-brand-white px-3 py-1.5 text-xs font-semibold text-brand-ink shadow-card"
      >
        {{ firstTag }}
      </span>
      <span
        v-if="inDevelopment"
        class="absolute right-4 top-4 z-10 rounded-full bg-brand-warm px-3 py-1.5 text-xs font-semibold text-brand-navy"
      >
        En desarrollo
      </span>
    </div>

    <div
      class="flex min-w-0 flex-1 flex-col gap-3 p-6 md:p-7"
      :class="featured ? 'lg:justify-center lg:gap-4 lg:p-10' : ''"
    >
      <p class="text-xs font-semibold uppercase tracking-[0.1em] text-logo-blue">{{ typeLabel }}</p>
      <component
        :is="headingLevel"
        class="font-semibold leading-tight"
        :class="featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'"
      >
        {{ project.title }}
      </component>
      <p
        class="text-sm leading-6 text-brand-muted"
        :class="featured ? 'md:text-base md:leading-7' : ''"
      >
        {{ withFinalPeriod(project.description) }}
      </p>
      <p v-if="audience" class="text-sm leading-6 text-brand-muted">
        <span class="font-semibold text-brand-ink">Dirigido a</span>
        {{ withFinalPeriod(audience) }}
      </p>

      <div
        v-if="detailHref || externalUrl"
        class="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-2"
      >
        <template v-if="featured">
          <Button
            v-if="detailHref"
            v-track="{ id: 'cta_ver_proyecto', slug: project.slug }"
            :to="detailHref"
            theme="primary"
            size="md"
            icon="mdi:arrow-right"
            icon-position="right"
          >
            Ver detalle
            <span class="sr-only">de {{ project.title }}</span>
          </Button>
          <Button
            v-if="externalUrl"
            v-track="{ id: 'cta_ver_proyecto', slug: project.slug }"
            as="a"
            :href="externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            theme="secondary"
            size="md"
            icon="mdi:open-in-new"
            icon-position="right"
            :class="outlineButtonClass"
          >
            Ver proyecto
            <span class="sr-only">de {{ project.title }} (se abre en una pestaña nueva)</span>
          </Button>
        </template>
        <template v-else>
          <NuxtLink
            v-if="detailHref"
            v-track="{ id: 'cta_ver_proyecto', slug: project.slug }"
            :to="detailHref"
            :class="[
              linkClass,
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
            :class="[linkClass, 'relative z-20']"
          >
            Ver proyecto
            <span class="sr-only">de {{ project.title }} (se abre en una pestaña nueva)</span>
            <Icon name="mdi:open-in-new" size="16" aria-hidden="true" />
          </a>
        </template>
      </div>
    </div>
  </article>
</template>
