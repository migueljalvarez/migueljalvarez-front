<script lang="ts" setup>
  import type { ProjectScopeProps } from '../organism'

  // «Qué incluyó»: título a la izquierda y la lista con check en dos columnas a la derecha. Vacío: se omite.
  defineProps<ProjectScopeProps>()
</script>

<template>
  <section
    v-if="items.length"
    class="grid grid-cols-1 gap-6 md:gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
    aria-labelledby="project-scope-heading"
  >
    <div class="flex flex-col gap-3">
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-logo-blue">Alcance</p>
      <h2
        id="project-scope-heading"
        class="text-2xl font-semibold leading-tight text-brand-ink md:text-3xl"
      >
        Qué incluyó
      </h2>
    </div>
    <ul class="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      <li
        v-for="item in items"
        :key="item"
        class="flex min-w-0 gap-3 text-base leading-6 text-brand-ink"
      >
        <Icon
          name="mdi:check-circle-outline"
          size="22"
          class="mt-0.5 shrink-0 text-logo-blue"
          aria-hidden="true"
        />
        <span class="min-w-0 break-words">{{ item }}</span>
      </li>
    </ul>
  </section>
</template>
