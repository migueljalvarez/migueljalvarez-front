<script setup lang="ts">
  import LegalDocument from '~/components/templates/LegalDocument/LegalDocument.vue'
  import { getTermsSections, TERMS_UPDATED_AT } from '~/data/terms'

  definePageMeta({ path: '/terminos-y-condiciones', contact: 'compact' })

  useBreadcrumbJsonLd([{ name: 'Términos y condiciones', path: '/terminos-y-condiciones' }])
  usePageSeo({
    title: 'Términos y condiciones',
    description:
      'Condiciones de uso de este sitio y de los servicios de desarrollo de software: propiedad intelectual, uso aceptable, responsabilidad y ley aplicable.',
    path: '/terminos-y-condiciones'
  })

  const { holder } = await useLegalHolder()
  const sections = computed(() => getTermsSections(holder.value))
</script>

<template>
  <LegalDocument
    eyebrow="Legal"
    title="Términos y condiciones"
    nav-label="Contenido de los términos"
    :updated-at="TERMS_UPDATED_AT"
    :sections="sections"
  />
</template>
