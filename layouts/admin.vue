<script setup lang="ts">
  import AppLogo from '~/components/atoms/AppLogo/AppLogo.vue'
  import { ADMIN_NAV, ADMIN_NAV_GROUPS } from '~/constants/admin'

  useSeoMeta({ title: 'Panel', robots: 'noindex, nofollow' })

  const route = useRoute()
  const { session, logout } = useAdminSession()
  const email = computed(() => session.value?.email ?? 'Admin')

  const menuOpen = ref(false)
  watch(
    () => route.path,
    () => {
      menuOpen.value = false
    }
  )

  const isActive = (to: string) =>
    to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)
  // Las pantallas anidadas (p. ej. el editor de un proyecto) declaran su migaja con `meta.crumb`.
  const crumb = computed(() => (route.meta.crumb as string | undefined) ?? '')
  const current = computed(() => ADMIN_NAV.find(item => isActive(item.to)))
  const groups = ADMIN_NAV_GROUPS.map(group => ({
    ...group,
    items: ADMIN_NAV.filter(item => item.group === group.id)
  }))
</script>

<template>
  <div class="min-h-screen bg-brand-surface text-brand-ink lg:grid lg:grid-cols-[16rem_1fr]">
    <a
      href="#admin-main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-white focus:px-4 focus:py-2"
    >
      Saltar al contenido
    </a>

    <!-- Barra superior (móvil) -->
    <header
      class="flex items-center justify-between gap-3 bg-brand-navy px-4 py-3 text-brand-text-strong lg:hidden"
    >
      <NuxtLink to="/admin" class="text-base font-semibold">Panel</NuxtLink>
      <button
        type="button"
        class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-brand-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white"
        :aria-expanded="menuOpen"
        aria-controls="admin-nav"
        aria-label="Abrir menú"
        @click="menuOpen = !menuOpen"
      >
        <Icon :name="menuOpen ? 'mdi:close' : 'mdi:menu'" size="22" aria-hidden="true" />
      </button>
    </header>

    <!-- Menú lateral -->
    <aside
      id="admin-nav"
      class="bg-brand-navy px-4 py-5 text-brand-text-strong lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col"
      :class="menuOpen ? 'block' : 'hidden lg:flex'"
    >
      <NuxtLink
        to="/admin"
        class="mb-6 hidden items-center gap-2 px-2 lg:flex"
        aria-label="Inicio del panel"
      >
        <AppLogo variant="compact" surface="dark" :height="32" />
      </NuxtLink>
      <p
        class="mb-2 hidden px-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-subtle lg:block"
      >
        Panel privado
      </p>

      <nav aria-label="Secciones del panel" class="flex-1 overflow-y-auto">
        <div
          v-for="(group, index) in groups"
          :key="group.id"
          :class="index > 0 ? 'mt-6' : ''"
          :role="group.label ? 'group' : undefined"
          :aria-labelledby="group.label ? `admin-nav-${group.id}` : undefined"
        >
          <p
            v-if="group.label"
            :id="`admin-nav-${group.id}`"
            class="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-subtle"
          >
            {{ group.label }}
          </p>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in group.items"
              :key="item.to"
              :to="item.to"
              :aria-current="isActive(item.to) ? 'page' : undefined"
              class="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white"
              :class="
                isActive(item.to)
                  ? 'bg-brand-surface-panel text-brand-white'
                  : 'text-brand-text-soft hover:bg-brand-surface-panel/70'
              "
            >
              <Icon :name="item.icon" size="20" aria-hidden="true" />
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
      </nav>

      <div class="mt-6 rounded-xl border border-brand-border-strong bg-brand-surface-panel p-3">
        <p class="text-xs uppercase tracking-[0.12em] text-brand-text-subtle">Sesión</p>
        <p class="mt-1 truncate text-sm font-medium text-brand-white">{{ email }}</p>
        <div class="mt-3 flex gap-2">
          <NuxtLink
            to="/"
            class="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-brand-border-strong text-xs font-semibold text-brand-text-soft transition hover:bg-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white"
          >
            Ver sitio
          </NuxtLink>
          <button
            type="button"
            class="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-brand-border-strong text-xs font-semibold text-brand-text-soft transition hover:bg-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white"
            @click="logout"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>

    <!-- Contenido -->
    <main id="admin-main" class="min-w-0 p-5 md:p-8">
      <nav v-if="current && current.to !== '/admin'" aria-label="Ruta" class="mb-4 text-sm">
        <ol class="flex items-center gap-2 text-brand-muted">
          <li class="flex items-center">
            <NuxtLink
              to="/admin"
              class="-mx-1 inline-flex min-h-11 items-center rounded px-1 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Panel
            </NuxtLink>
          </li>
          <li aria-hidden="true">/</li>
          <li v-if="crumb">
            <NuxtLink
              :to="current.to"
              class="-mx-1 inline-flex min-h-11 items-center rounded px-1 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              {{ current.label }}
            </NuxtLink>
          </li>
          <li v-if="crumb" aria-hidden="true">/</li>
          <li aria-current="page" class="font-medium text-brand-ink">
            {{ crumb || current.label }}
          </li>
        </ol>
      </nav>
      <slot />
    </main>
  </div>
</template>
