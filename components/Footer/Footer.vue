<script setup lang="ts">
  import { MY_SOCIAL_MEDIA } from '~/constants/common'
  import { PUBLIC_ROUTES, OTHER_PUBLIC_ROUTES } from '~/constants/routes'
  import type { SocialMediaType } from '~/types/common'

  const socials = ref<SocialMediaType[]>(MY_SOCIAL_MEDIA)

  const hoverIcon = (item: SocialMediaType) => {
    item.isHovered = true
  }
  const leaveIcon = (item: SocialMediaType) => {
    item.isHovered = false
  }
</script>

<template>
  <footer class="flex flex-col w-full bg-black">
    <section
      class="grid w-full grid-cols-1 gap-8 px-4 py-10 mx-auto max-w-7xl md:grid-cols-1 lg:grid-cols-4"
    >
      <!-- Menu -->
      <div>
        <h5 class="mb-2 font-black text-white uppercase">Menu</h5>
        <ul class="flex flex-col gap-2">
          <li
            v-for="item in PUBLIC_ROUTES"
            :key="item.name"
            class="text-white cursor-pointer hover:text-blue-400"
          >
            <nuxt-link :to="item.link">{{ item.name }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div>
        <h5 class="mb-2 font-black text-white uppercase">Enlaces de Interes</h5>
        <ul class="flex flex-col gap-2">
          <li
            v-for="item in OTHER_PUBLIC_ROUTES"
            :key="item.name"
            class="text-white cursor-pointer hover:text-blue-400"
          >
            <nuxt-link :to="item.link">{{ item.name }}</nuxt-link>
          </li>
        </ul>
      </div>
      <!-- Social Media -->
      <div>
        <h5 class="mb-2 font-black text-white uppercase">Contacto</h5>
        <div class="flex flex-wrap gap-3">
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
      </div>
      <!-- Logo & Description -->

      <div class="flex flex-col items-start gap-2 mt-8 lg:mt-0">
        <h5 class="mb-2 font-black text-white uppercase">Sobre Mi</h5>
        <div>
          <NuxtImg
            src="isotipo.svg"
            alt="Miguel Alvarez"
            width="160"
            height="auto"
            loading="lazy"
          />
          <p class="max-w-xl text-sm text-slate-400 sm:text-base">
            Desarrollador de software enfocado en crear soluciones digitales eficientes y
            escalables. Transformo ideas en productos tecnológicos útiles y orientados a resultados.
          </p>
        </div>
      </div>
    </section>
    <div
      class="flex flex-col items-center justify-center gap-2 p-3 text-sm bg-blue-400 text-slate-900 sm:flex-row sm:text-base"
    >
      <p>
        Copyright &copy;
        <strong>{{ new Date().getFullYear() }}</strong>
      </p>
      <span class="hidden mx-2 sm:inline">|</span>
      <strong>Miguel Alvarez</strong>
    </div>
  </footer>
</template>
