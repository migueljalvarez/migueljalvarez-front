<script setup lang="ts">
  import { Header } from '~/components/molecules'
  import ContactCompact from '~/components/templates/ContactCompact/ContactCompact.vue'
  import { lazySection } from '~/utils/lazySection'

  // El formulario (y su validación) se hidrata al acercarse al pie; el HTML ya viene del SSR.
  const Contact = lazySection(() => import('~/components/templates/Contact/Contact.vue'))

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
