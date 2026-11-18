<script setup lang="ts">
  import Contact from '~/components/templates/Contact/Contact.vue'
  import HowWorkContent from '~/components/templates/HowWork/HowWorkContent.vue'

  const { policies } = await usePolicies()

  usePageSeo({
    title: 'Cómo trabajo',
    description:
      'Conoce mis compromisos, políticas de trabajo y respuestas a preguntas frecuentes.',
    path: '/como-trabajo'
  })
</script>

<template>
  <div>
    <HowWorkContent :policies="policies" />
    <Contact title="Hablemos" />
  </div>
</template>
