<script setup lang="ts">
  // Sección del editor: tarjeta con su propio encabezado (h2) y, opcional, una frase que orienta.
  defineProps<{ id: string; title: string; description?: string; tone?: 'default' | 'danger' }>()
</script>

<template>
  <section
    :id="id"
    :aria-labelledby="`${id}-title`"
    class="rounded-2xl border bg-brand-surface-card p-5 md:p-6"
    :class="tone === 'danger' ? 'border-brand-error-border' : 'border-brand-border'"
  >
    <h2
      :id="`${id}-title`"
      class="text-xl font-semibold"
      :class="tone === 'danger' ? 'text-brand-error-text' : 'text-brand-ink'"
    >
      {{ title }}
    </h2>
    <p v-if="description" class="mt-1 max-w-2xl text-sm leading-6 text-brand-muted">
      {{ description }}
    </p>
    <div class="mt-4">
      <slot />
    </div>
  </section>
</template>
