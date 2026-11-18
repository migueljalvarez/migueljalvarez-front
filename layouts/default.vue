<script setup lang="ts">
  import { Header } from '~/components/molecules'
  import { Footer } from '~/components/organisms'
</script>
<template>
  <div class="layout">
    <Header />
    <main class="overflow-hidden pt-20">
      <slot />
    </main>
    <Footer />
  </div>
</template>
