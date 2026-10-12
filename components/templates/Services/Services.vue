<script setup lang="ts">
  import { Section } from '~/components/organisms'
  import { SERVICE_OFFERINGS } from '~/data/services'
  import ServiceCard from './ServiceCard.vue'
</script>

<template>
  <Section
    id="services"
    class="gap-8 bg-brand-surface px-4 py-12 md:gap-10 md:py-16"
    aria-labelledby="services-heading"
  >
    <div
      class="mx-auto w-full max-w-7xl rounded-2xl border border-brand-border bg-brand-surface-card p-6 shadow-[0_10px_24px_var(--color-brand-shadow-card)] md:p-8"
    >
      <p class="text-sm font-semibold uppercase tracking-[0.08em] text-brand-accent-text">
        Antes de construir
      </p>
      <div class="mt-4 flex flex-col gap-4">
        <h2
          id="services-heading"
          class="max-w-5xl text-2xl font-semibold leading-tight text-brand-ink md:text-3xl"
        >
          La tecnología es importante. Entender el problema, todavía más.
        </h2>
        <p class="max-w-6xl text-base leading-7 text-brand-muted">
          Mi trabajo no empieza escogiendo un framework. Empieza entendiendo qué quieres lograr, qué
          tienes hoy, y qué es realmente
          <span class="text-brand-accent-text">viable con tu presupuesto y tus tiempos</span>
          — no todo lo que suena bien técnicamente es lo correcto para tu negocio.
        </p>
      </div>
    </div>

    <div class="mx-auto w-full max-w-7xl">
      <h3 class="mb-5 text-xl font-semibold text-brand-ink md:text-2xl">¿En qué punto estás?</h3>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ServiceCard
          v-for="offering in SERVICE_OFFERINGS"
          :key="offering.id"
          :offering="offering"
        />
      </div>
    </div>
  </Section>
</template>
