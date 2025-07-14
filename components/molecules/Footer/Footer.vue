<script setup lang="ts">
  import { useSocialMedia } from '~/composables/useSocialMedia'
  import { PUBLIC_ROUTES } from '~/constants/routes'

  import type { SocialMediaType } from '~/types/common'
  import SocialMedia from '../SocialMedia/SocialMedia.vue'

  const hoverIcon = (item: SocialMediaType) => {
    item.isHovered = true
  }
  const leaveIcon = (item: SocialMediaType) => {
    item.isHovered = false
  }
  const { socials } = useSocialMedia()
</script>

<template>
  <footer class="box-border flex flex-col w-full bg-black">
    <section
      class="grid w-full grid-cols-1 gap-8 px-4 py-10 mx-auto max-w-7xl md:grid-cols-1 lg:grid-cols-4"
    >
      <!-- Menu -->
      <div>
        <p class="py-2 text-lg font-black text-white uppercase">Menu</p>
        <ul class="flex flex-col gap-2 uppercase">
          <li
            v-for="item in PUBLIC_ROUTES"
            :key="item.name"
            class="text-white cursor-pointer hover:text-blue-400"
          >
            <NuxtLink :to="item.link">{{ item.name }}</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Social Media -->
      <div>
        <p class="py-2 text-lg font-black text-white uppercase">Contacto</p>
        <div class="flex flex-wrap gap-3">
          <SocialMedia
            v-for="item in socials"
            :key="item.name"
            :link="item.link"
            :name="item.name"
            :icon="item.icon"
            :is-hovered="item.isHovered"
            orientation="horizontal"
            :size="32"
            @mouseover="hoverIcon(item)"
            @mouseleave="leaveIcon(item)"
          />
        </div>
      </div>
      <div></div>
      <!-- Logo & Description -->
      <div class="flex flex-col items-start gap-4 mt-8 lg:mt-0">
        <p class="py-2 text-lg font-black text-white uppercase">Sobre Mi</p>
        <NuxtImg
          src="brand_white.svg"
          width="150"
          height="43"
          alt="Miguel Alvarez"
          format="webp"
          loading="lazy"
        />
        <div>
          <p class="max-w-xl text-sm text-slate-400 sm:text-base">
            Desarrollador de software enfocado en crear soluciones digitales eficientes y
            escalables. Transformo ideas en productos tecnológicos útiles y orientados a resultados.
          </p>
        </div>
      </div>
    </section>
    <div
      class="flex w-full px-4 py-4 mx-auto text-sm bg-blue-400 grid-cols text-slate-900 sm:flex-row sm:text-base"
    >
      <p class="flex justify-center w-full gap-8 px-4 mx-auto max-w-7xl">
        <strong>
          &copy; {{ new Date().getFullYear() }} Miguel Alvarez
          <span class="font-normal">| Desarrollo de Software</span>
        </strong>
      </p>
    </div>
  </footer>
</template>
