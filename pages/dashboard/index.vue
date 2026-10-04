<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
  })
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C2F4C]">Dashboard</p>
      <h1 class="mt-2 text-3xl font-semibold text-navy">Panel de contenido</h1>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <NuxtLink
        to="/dashboard/portfolio"
        class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
      >
        <p class="text-xs uppercase tracking-[0.12em] text-[#7E8897]">Sección</p>
        <h2 class="mt-2 text-xl font-semibold text-navy">Portafolio</h2>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/testimonials"
        class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
      >
        <p class="text-xs uppercase tracking-[0.12em] text-[#7E8897]">Sección</p>
        <h2 class="mt-2 text-xl font-semibold text-navy">Testimonios</h2>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/me"
        class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
      >
        <p class="text-xs uppercase tracking-[0.12em] text-[#7E8897]">Sección</p>
        <h2 class="mt-2 text-xl font-semibold text-navy">Datos del Hero</h2>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/experience"
        class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
      >
        <p class="text-xs uppercase tracking-[0.12em] text-[#7E8897]">Sección</p>
        <h2 class="mt-2 text-xl font-semibold text-navy">Experiencia</h2>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/cv"
        class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
      >
        <p class="text-xs uppercase tracking-[0.12em] text-[#7E8897]">Generador</p>
        <h2 class="mt-2 text-xl font-semibold text-navy">CV / ATS</h2>
      </NuxtLink>
    </div>
  </div>
</template>
