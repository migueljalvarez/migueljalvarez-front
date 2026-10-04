<script setup lang="ts">
  import { Header } from '~/components/molecules'
</script>
<template>
  <div class="layout overflow-x-hidden">
    <Header />
    <main class="overflow-hidden pt-20 scrollbar-gutter:stable">
      <slot />
    </main>
  </div>
</template>
