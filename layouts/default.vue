<script setup lang="ts">
  import { Header, Footer } from '~/components/molecules'
</script>
<template>
  <div class="layout">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>
