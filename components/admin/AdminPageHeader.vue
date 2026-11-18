<script setup lang="ts">
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
  }>()
</script>

<template>
  <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div class="min-w-0">
      <p
        v-if="eyebrow"
        class="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent-text"
      >
        {{ eyebrow }}
      </p>
      <h1 class="text-2xl font-semibold leading-tight text-brand-ink md:text-3xl">{{ title }}</h1>
      <p v-if="description" class="mt-2 max-w-2xl text-base leading-7 text-brand-muted">
        {{ description }}
      </p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
