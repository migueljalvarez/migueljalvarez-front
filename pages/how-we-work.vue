<script setup lang="ts">
  import HowWorkContent from '~/components/templates/HowWork/HowWorkContent.vue'

  const { policies } = await usePolicies()

  definePageMeta({ path: '/como-trabajo' })

  usePageSeo({
    title: 'Cómo trabajo',
    description:
      'Mis compromisos, lo que no hago y cómo trabajamos juntos: acuerdos claros, código y accesos tuyos, y respuestas a las preguntas frecuentes.',
    path: '/como-trabajo'
  })
</script>

<template>
  <div>
    <HowWorkContent :policies="policies" />
  </div>
</template>
