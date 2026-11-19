<script setup lang="ts">
  import HowWorkContent from '~/components/templates/HowWork/HowWorkContent.vue'

  const { policies } = await usePolicies()

  definePageMeta({ path: '/como-trabajo' })

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
  </div>
</template>
