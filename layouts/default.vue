<script setup lang="ts">
  import { Header } from '~/components/molecules'
</script>
<template>
  <div class="layout">
    <Header />
    <main class="overflow-hidden pt-20">
      <slot />
    </main>
  </div>
</template>
