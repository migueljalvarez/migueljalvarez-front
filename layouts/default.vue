<script setup lang="ts">
  import { Header } from '~/components/molecules'
  import Contact from '~/components/templates/Contact/Contact.vue'
  import ContactCompact from '~/components/templates/ContactCompact/ContactCompact.vue'

  // Las páginas legales piden la versión compacta con definePageMeta({ contact: 'compact' }).
  const route = useRoute()
</script>
<template>
  <div class="layout">
    <Header />
    <main class="overflow-hidden pt-20">
      <slot />
      <ContactCompact v-if="route.meta.contact === 'compact'" />
      <Contact v-else />
    </main>
  </div>
</template>
