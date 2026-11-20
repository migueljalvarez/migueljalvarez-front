<script setup lang="ts">
  import GuideArticle from '~/components/templates/GuideArticle/GuideArticle.vue'
  import { GUIDE_REWRITE_OR_IMPROVE as guide } from '~/data/guides'
  import { buildArticleSchema, buildBreadcrumbList } from '~/utils/seo'

  // URL pública en español por SEO; el archivo se queda en inglés.
  definePageMeta({ path: '/guias/rehacer-o-mejorar-software', layout: 'default' })

  usePageSeo({
    title: guide.seoTitle,
    description: guide.description,
    path: guide.path
  })

  // Datos estructurados: el artículo (autor: el de la portada) y su ruta de migas.
  const siteUrl = useSiteUrl()
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(buildArticleSchema(siteUrl, guide))
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(
          buildBreadcrumbList(siteUrl, [{ name: guide.seoTitle, path: guide.path }])
        )
      }
    ]
  })
</script>

<template>
  <GuideArticle :guide="guide" />
</template>
