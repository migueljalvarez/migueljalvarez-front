<script setup lang="ts">
  useSeoMeta({ title: 'Panel', robots: 'noindex, nofollow' })

  const { data: sessionData } = await useFetch<{ email: string }>('/api/admin/session')

  const user = computed(() => ({ email: sessionData.value?.email ?? 'Admin' }))

  const logout = async () => {
    try {
      await $fetch('/api/admin/logout', { method: 'POST' })
      await navigateTo('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
</script>

<template>
  <div class="min-h-screen bg-brand-surface text-brand-ink">
    <header
      class="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border-soft bg-brand-navy px-6 py-4 text-brand-text-strong"
    >
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-soft">Panel</p>
        <p class="text-lg font-semibold">Miguel Álvarez</p>
      </div>
      <div class="flex items-center gap-4">
        <p class="text-sm text-brand-text-subtle">{{ user.email }}</p>
        <button
          type="button"
          class="min-h-11 rounded-xl border border-brand-border-strong px-4 text-sm font-semibold text-brand-text-soft transition hover:bg-brand-surface-panel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white"
          @click="logout"
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl p-6 md:p-8">
      <slot />
    </main>
  </div>
</template>
