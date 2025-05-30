<script lang="ts" setup>
  import { ref } from 'vue'
  import { MY_SOCIAL_MEDIA } from '~/constants/common'
  import { PUBLIC_ROUTES } from '~/constants/routes'
  import type { SocialMediaType } from '~/types/common'

  const sidebarOpen = ref(false)
  const socials = ref<SocialMediaType[]>(MY_SOCIAL_MEDIA)

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const hoverIcon = (item: SocialMediaType) => {
    item.isHovered = true
  }
  const leaveIcon = (item: SocialMediaType) => {
    item.isHovered = false
  }
</script>

<template>
  <header class="flex items-center w-full h-20 px-6 text-white bg-black">
    <!-- Menú tradicional para md+ -->
    <div class="md:hidden">
      <NuxtImg src="isotipo.svg" alt="Miguel Alvarez" width="100" height="auto" loading="lazy" />
    </div>
    <nav class="hidden gap-8 ml-2 font-semibold uppercase md:flex">
      <nuxt-link
        v-for="item in PUBLIC_ROUTES"
        :key="item.name"
        :to="item.link"
        class="transition-colors duration-300 hover:text-blue-400"
      >
        {{ item.name }}
      </nuxt-link>
    </nav>

    <!-- Social media (md+) -->
    <div class="hidden gap-4 ml-auto md:flex">
      <SocialMedia
        v-for="item in socials"
        :key="item.name"
        :link="item.link"
        :name="item.name"
        :icon="item.icon"
        :is-hovered="item.isHovered"
        orientation="horizontal"
        :size="24"
        @mouseover="hoverIcon(item)"
        @mouseleave="leaveIcon(item)"
      />
    </div>

    <!-- Botón hamburguesa (solo móvil) -->
    <button
      aria-label="Toggle menu"
      class="p-2 ml-auto rounded md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400"
      @click="toggleSidebar"
    >
      <svg
        class="w-6 h-6 transition-transform duration-300 ease-in-out"
        :class="sidebarOpen ? 'rotate-90' : 'rotate-0'"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          v-if="!sidebarOpen"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </header>

  <!-- Sidebar móvil -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full bg-zinc-400/10 text-white w-72 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-50',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'md:hidden '
    ]"
  >
    <div>
      <!-- Contenedor para botón cerrar alineado a la derecha -->
      <div class="flex justify-end mb-8">
        <button
          aria-label="Close menu"
          class="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          @click="toggleSidebar"
        >
          <svg
            class="w-6 h-6 transition-transform duration-300 ease-in-out hover:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Menú sidebar -->
      <nav class="flex flex-col gap-6 text-lg font-semibold uppercase">
        <nuxt-link
          v-for="item in PUBLIC_ROUTES"
          :key="item.name"
          :to="item.link"
          class="transition-colors duration-300 hover:text-blue-400"
          @click="toggleSidebar"
        >
          {{ item.name }}
        </nuxt-link>
      </nav>
    </div>

    <!-- Social media abajo -->
    <div class="flex gap-6">
      <SocialMedia
        v-for="item in socials"
        :key="item.name"
        :link="item.link"
        :name="item.name"
        :icon="item.icon"
        :is-hovered="item.isHovered"
        orientation="horizontal"
        :size="28"
        @mouseover="hoverIcon(item)"
        @mouseleave="leaveIcon(item)"
      />
    </div>
  </aside>

  <!-- Fondo oscuro al abrir sidebar -->
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
    @click="toggleSidebar"
  />
</template>

<style scoped>
  /* Puedes agregar aquí estilos extra si quieres */
</style>
