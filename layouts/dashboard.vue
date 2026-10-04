<script setup lang="ts">
  const session = useCookie('admin_session', {
    default: () => '',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  const user = computed(() =>
    session.value === 'mock-admin' ? { email: 'admin@mock.local' } : { email: 'Admin mock' }
  )

  const logout = async () => {
    try {
      await $fetch('/api/admin/logout', { method: 'POST' })
      session.value = ''
      await navigateTo('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
</script>

<template>
  <div class="min-h-screen bg-[#F5F7FA] text-navy">
    <aside class="fixed left-0 top-0 h-full w-72 border-r border-[#E9EEF5] bg-navy p-5 text-white">
      <div class="mb-8">
        <p class="text-xs uppercase tracking-[0.14em] text-[#DDEAFB]">Panel</p>
        <h1 class="mt-2 text-2xl font-semibold">Dashboard</h1>
      </div>

      <nav class="space-y-2 text-sm">
        <NuxtLink
          to="/dashboard"
          class="block rounded-xl px-3 py-2 text-[#DDEAFB] transition hover:bg-[#1A2433]"
        >
          Inicio
        </NuxtLink>
        <NuxtLink
          to="/dashboard/portfolio"
          class="block rounded-xl px-3 py-2 text-[#DDEAFB] transition hover:bg-[#1A2433]"
        >
          Portafolio
        </NuxtLink>
        <NuxtLink
          to="/dashboard/testimonials"
          class="block rounded-xl px-3 py-2 text-[#DDEAFB] transition hover:bg-[#1A2433]"
        >
          Testimonios
        </NuxtLink>
        <NuxtLink
          to="/dashboard/me"
          class="block rounded-xl px-3 py-2 text-[#DDEAFB] transition hover:bg-[#1A2433]"
        >
          Datos del Hero
        </NuxtLink>
        <NuxtLink
          to="/dashboard/experience"
          class="block rounded-xl px-3 py-2 text-[#DDEAFB] transition hover:bg-[#1A2433]"
        >
          Experiencia
        </NuxtLink>
        <NuxtLink
          to="/dashboard/cv"
          class="block rounded-xl px-3 py-2 text-[#DDEAFB] transition hover:bg-[#1A2433]"
        >
          CV / ATS
        </NuxtLink>
      </nav>

      <div class="mt-8 rounded-xl border border-[#2F4469] bg-[#1A2433] p-3">
        <p class="text-xs uppercase tracking-[0.12em] text-[#DDEAFB]">Sesión</p>
        <p class="mt-2 text-sm font-medium text-white">{{ user?.email || 'Admin' }}</p>
      </div>

      <button
        type="button"
        class="mt-8 w-full rounded-xl border border-[#2F4469] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#DDEAFB] transition hover:bg-[#1A2433]"
        @click="logout"
      >
        Cerrar sesión
      </button>
    </aside>

    <div class="ml-72 min-h-screen p-8">
      <slot />
    </div>
  </div>
</template>
