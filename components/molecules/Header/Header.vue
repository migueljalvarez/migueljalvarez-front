<script lang="ts" setup>
  import { useSocialMedia } from '~/composables/useSocialMedia'
  import { PUBLIC_ROUTES } from '~/constants/routes'
  import type { SocialMediaType } from '~/types/common'
  import SocialMedia from '../SocialMedia/SocialMedia.vue'

  const sidebarOpen = ref(false)

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const hoverIcon = (item: SocialMediaType) => {
    item.isHovered = true
  }
  const leaveIcon = (item: SocialMediaType) => {
    item.isHovered = false
  }

  const route = useRoute()

  const isActive = (link: string) => {
    return route.fullPath === link
  }
  const isActiveClass = (link: string) => {
    return isActive(link) ? 'text-blue-400' : 'text-white'
  }
  const { socials } = useSocialMedia()
</script>

<template>
  <header
    class="z-50 flex items-center w-full h-20 gap-4 px-2 overflow-hidden text-white bg-black shadow-md lg:justify-center"
  >
    <div class="flex items-center justify-between w-full max-w-[1440px] mx-auto px-0 lg:px-8">
      <NuxtImg
        src="brand_white_v2.svg"
        width="250"
        height="40"
        alt="Miguel Alvarez"
        format="webp"
        class="flex object-contain px-2"
      />

      <!-- Menú tradicional para md+ -->
      <nav
        class="items-center justify-end hidden w-full gap-4 font-semibold uppercase md:gap-8 lg:flex"
      >
        <nuxt-link
          v-for="item in PUBLIC_ROUTES"
          :key="item.name"
          :to="item.link"
          :class="isActiveClass(item.link)"
          class="transition-colors duration-300 hover:text-blue-400"
        >
          {{ item.name }}
        </nuxt-link>
      </nav>

      <!-- Botón hamburguesa (solo móvil) -->
      <div class="flex items-center justify-end w-full mx-auto max-w-7xl lg:hidden">
        <button
          aria-label="Toggle menu"
          :class="sidebarOpen ? 'hidden' : 'block'"
          class="p-2 ml-auto rounded lg:hidden focus:outline-none focus:transparent"
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
      </div>
    </div>
  </header>

  <!-- Sidebar móvil -->
  <aside
    class="fixed top-0 left-0 z-50 flex flex-col justify-between w-full h-full max-w-xs p-6 overflow-y-auto text-white transition-transform duration-300 ease-in-out transform bg-black lg:hidden"
    :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }"
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
