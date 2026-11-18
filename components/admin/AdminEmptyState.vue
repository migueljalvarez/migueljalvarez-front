<script setup lang="ts">
  // Estado vacío: qué es esto, por qué está vacío y una acción para crear el primero.
  defineProps<{ icon: string; title: string; description: string }>()
</script>

<template>
  <div
    class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-8 text-center"
  >
    <Icon :name="icon" size="32" class="mx-auto text-brand-helper" aria-hidden="true" />
    <h2 class="mt-3 text-lg font-semibold text-brand-ink">{{ title }}</h2>
    <p class="mx-auto mt-1 max-w-md text-sm leading-6 text-brand-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5 flex justify-center">
      <slot />
    </div>
  </div>
</template>
