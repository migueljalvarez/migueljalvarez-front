<script lang="ts" setup>
  import type { PortfolioFilter } from '~/types/portfolio'

  defineProps<{ modelValue: PortfolioFilter; filters: PortfolioFilter[] }>()
  const emit = defineEmits<{ 'update:modelValue': [value: PortfolioFilter] }>()
</script>

<template>
  <div
    class="flex w-fit max-w-full items-center gap-1 rounded-xl border border-brand-border-strong/50 bg-brand-surface-soft p-1"
    role="group"
    aria-label="Filtrar proyectos"
  >
    <button
      v-for="filter in filters"
      :key="filter"
      type="button"
      class="min-h-11 flex-1 whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      :class="
        modelValue === filter
          ? 'border-brand-accent bg-brand-accent text-brand-white shadow-sm'
          : 'border-transparent bg-transparent text-brand-ink hover:bg-brand-surface-card hover:text-brand-accent-text'
      "
      :aria-pressed="modelValue === filter"
      @click="emit('update:modelValue', filter)"
    >
      {{ filter }}
    </button>
  </div>
</template>
