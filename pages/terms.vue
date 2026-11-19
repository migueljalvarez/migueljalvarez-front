<script setup lang="ts">
  import { LegalDocument } from '~/components/templates'
  import { getTermsSections, TERMS_UPDATED_AT } from '~/data/terms'

  definePageMeta({ path: '/terminos-y-condiciones', contact: 'compact' })

  usePageSeo({
    title: 'Términos y condiciones',
    description:
      'Condiciones de uso de este sitio y cómo se acuerdan los servicios de desarrollo de software: propiedad intelectual, uso aceptable, responsabilidad y ley aplicable.',
    path: '/terminos-y-condiciones'
  })

  const { holder } = useLegalHolder()
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
