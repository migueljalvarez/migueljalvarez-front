<script setup lang="ts">
  import PortfolioEditor from '~/components/admin/portfolio/PortfolioEditor.vue'

  definePageMeta({ layout: 'admin', crumb: 'Nuevo proyecto' })
  useSeoMeta({ title: 'Nuevo proyecto | Portafolio | Panel', robots: 'noindex, nofollow' })
</script>

<template>
  <PortfolioEditor :entry="null" />
</template>
