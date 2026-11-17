<script setup lang="ts">
  import AdminPlanned from '~/components/admin/AdminPlanned.vue'
  import { ADMIN_NAV } from '~/constants/admin'

  definePageMeta({ layout: 'admin' })

  const item = ADMIN_NAV.find(entry => entry.to === '/admin/experiencia')!
</script>

<template>
  <AdminPlanned :item="item" />
</template>
