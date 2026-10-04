<script lang="ts" setup>
  import type { PortfolioFilter } from './portfolio.types'

  defineProps<{ modelValue: PortfolioFilter }>()
  const emit = defineEmits<{ 'update:modelValue': [value: PortfolioFilter] }>()

  const filters: PortfolioFilter[] = ['Todos', 'Clientes', 'Productos propios']
</script>

<template>
  <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar proyectos">
    <button
      v-for="filter in filters"
      :key="filter"
      type="button"
      class="min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent-text"
      :class="
        modelValue === filter
          ? ['border-brand-accent bg-brand-accent text-brand-white']
          : [
              'border-brand-border-strong/50 bg-brand-surface-card text-brand-ink',
              'hover:border-brand-accent-text hover:text-brand-accent-text'
            ]
      "
      :aria-pressed="modelValue === filter"
      @click="emit('update:modelValue', filter)"
    >
      {{ filter }}
    </button>
  </div>
</template>
