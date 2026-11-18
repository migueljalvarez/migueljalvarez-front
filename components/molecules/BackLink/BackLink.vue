<script lang="ts" setup>
  import type { BackLinkProps } from '../molecule'

  defineProps<BackLinkProps>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue motion-reduce:transition-none"
  >
    <Icon name="mdi:arrow-left" size="18" aria-hidden="true" />
    <slot />
  </NuxtLink>
</template>
