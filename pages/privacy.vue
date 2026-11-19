<script setup lang="ts">
  import { LegalDocument } from '~/components/templates'
  import { getPrivacySections, PRIVACY_UPDATED_AT } from '~/data/privacy'

  definePageMeta({ path: '/privacidad', contact: 'compact' })

  usePageSeo({
    title: 'Política de tratamiento de datos',
    description:
      'Cómo trato los datos personales que compartes a través del formulario de contacto: finalidades, derechos y cómo ejercerlos.',
    path: '/privacidad'
  })

  const { holder } = useLegalHolder()
  const sections = computed(() => getPrivacySections(holder.value))
</script>

<template>
  <LegalDocument
    eyebrow="Privacidad"
    title="Política de tratamiento de datos personales"
    nav-label="Contenido de la política"
    :updated-at="PRIVACY_UPDATED_AT"
    :sections="sections"
  />
</template>
