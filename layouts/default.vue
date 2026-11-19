<script setup lang="ts">
  import { Header } from '~/components/molecules'
  import Contact from '~/components/templates/Contact/Contact.vue'
</script>
<template>
  <div class="layout">
    <Header />
    <main class="overflow-hidden pt-20">
      <slot />
      <Contact />
    </main>
  </div>
</template>
