<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
  })

  // Módulos previstos para el panel privado (ver plan de trabajo). Aún no están construidos.
  const upcomingModules = [
    'Leads',
    'Testimonios',
    'Proyectos y clientes',
    'Equipo, horas y pagos',
    'Políticas y tarifas',
    'Experiencia'
  ]
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent-text">
        Panel privado
      </p>
      <h1 class="mt-2 text-3xl font-semibold text-brand-ink">Sesión activa</h1>
      <p class="mt-3 max-w-2xl text-base leading-7 text-brand-muted">
        La autenticación funciona. Los módulos de gestión se construirán cuando la base de datos
        esté lista.
      </p>
    </div>

    <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="module in upcomingModules"
        :key="module"
        class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-5 text-sm font-medium text-brand-muted"
      >
        {{ module }}
        <span class="mt-1 block text-xs font-normal text-brand-helper">Próximamente</span>
      </li>
    </ul>
  </div>
</template>
