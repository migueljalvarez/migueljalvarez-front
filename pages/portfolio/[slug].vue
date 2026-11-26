<script lang="ts" setup>
  import { Button, Heading } from '~/components/atoms'
  import ProjectDetail from '~/components/templates/ProjectDetail/ProjectDetail.vue'
  import type { PortfolioType } from '~/types/common'
  import {
    absoluteUrl,
    buildBreadcrumbList,
    buildProjectSchema,
    projectSeoTitle,
    toMetaDescription
  } from '~/utils/seo'

  definePageMeta({
    path: '/portafolio/:slug()',
    layout: 'default',
    keepalive: true,
    title: 'Detalle del proyecto'
  })

  const route = useRoute()
  const slug = computed(() => String(route.params.slug || ''))
  const project = ref<PortfolioType | null>(null)

  const { items: projects } = await usePortfolio()

  watch(
    () => slug.value,
    value => {
      if (!value) return
      const found = (projects.value as PortfolioType[]).find(
        item => item.slug === value && item.status !== 'in-development'
      )
      project.value = found ?? null
    },
    { immediate: true }
  )

  const siteUrl = useSiteUrl()
  const seoImage = computed(() => absoluteUrl(siteUrl, project.value?.ogImage ?? '/og-image.jpg'))
  const seoTitle = computed(() =>
    project.value ? projectSeoTitle(project.value) : 'Proyecto no encontrado'
  )
  const seoDescription = computed(() =>
    toMetaDescription(project.value?.description ?? 'Proyecto del portafolio de Miguel Álvarez.')
  )
  useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    robots: () => (project.value ? 'index, follow' : 'noindex, nofollow'),
    ogType: 'article',
    ogLocale: 'es_CO',
    ogSiteName: 'Miguel Álvarez',
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogUrl: () => `${siteUrl}/portafolio/${slug.value}`,
    ogImage: seoImage,
    twitterCard: 'summary_large_image',
    twitterTitle: seoTitle,
    twitterDescription: seoDescription,
    twitterImage: seoImage
  })
  useHead({ link: [{ rel: 'canonical', href: () => `${siteUrl}/portafolio/${slug.value}` }] })
  // Datos estructurados: migas de pan y la ficha como obra del autor (solo si el proyecto existe).
  useHead({
    script: computed(() =>
      project.value
        ? [
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify(
                buildBreadcrumbList(siteUrl, [
                  { name: 'Portafolio', path: '/portafolio' },
                  { name: project.value.title, path: `/portafolio/${slug.value}` }
                ])
              )
            },
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify(buildProjectSchema(siteUrl, project.value))
            }
          ]
        : []
    )
  })

  // Respuesta 404 real (no un "soft 404") cuando el proyecto no existe o no tiene ficha pública.
  if (!project.value && import.meta.server) {
    const event = useRequestEvent()
    if (event) setResponseStatus(event, 404)
  }
</script>

<template>
  <section class="w-full bg-brand-surface px-4 py-12 md:py-16">
    <ProjectDetail v-if="project" :project="project" />

    <div
      v-else
      class="mx-auto max-w-2xl rounded-2xl border border-brand-border bg-brand-surface-card p-8 text-center"
    >
      <Heading level="h1" variant="section">Proyecto no encontrado</Heading>
      <p class="mt-3 text-brand-muted">No existe un detalle disponible para esta ruta.</p>
      <Button to="/portafolio" theme="secondary" class="mt-5 inline-flex">
        Volver al portafolio
      </Button>
    </div>
  </section>
</template>
