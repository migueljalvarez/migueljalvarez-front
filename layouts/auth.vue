<script setup lang="ts">
  // Layout mínimo para pantallas privadas de acceso: sin menú público del sitio.
  useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-surface">
    <header class="px-4 py-5 sm:px-6">
      <NuxtLink
        to="/"
        class="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
      >
        <Icon name="mdi:arrow-left" size="18" aria-hidden="true" />
        Volver al sitio
      </NuxtLink>
    </header>
    <main class="flex flex-1 items-center justify-center px-4 pb-16">
      <slot />
    </main>
  </div>
</template>
