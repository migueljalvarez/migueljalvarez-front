<script setup lang="ts">
  import Contact from '~/components/templates/Contact/Contact.vue'
  import { Header } from '~/components/molecules'
</script>
<template>
  <div class="layout">
    <Header />
    <main class="overflow-hidden pt-20">
      <slot />
    </main>
    <Contact title="Hablemos" />
  </div>
</template>
