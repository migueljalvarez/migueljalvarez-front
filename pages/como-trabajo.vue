<script setup lang="ts">
  import Contact from '~/components/templates/Contact/Contact.vue'
  import HowWorkContent from '~/components/templates/HowWork/HowWorkContent.vue'

  useSeoMeta({
    title: 'Cómo trabajo',
    description: 'Conoce mis compromisos, políticas de trabajo y respuestas a preguntas frecuentes.'
  })
</script>

<template>
  <div>
    <HowWorkContent />
    <Contact title="Hablemos" />
  </div>
</template>
