<script setup lang="ts">
import type { SocialMediaType } from "~/common/types";
import { MY_SOCIAL_MEDIA } from "~/constants/common";
import { PUBLIC_ROUTES } from "~/constants/routes";

const socials = ref<SocialMediaType[]>(MY_SOCIAL_MEDIA);

const hoverIcon = (item: SocialMediaType) => {
  item.isHovered = true;
};
const leaveIcon = (item: SocialMediaType) => {
  item.isHovered = false;
};
</script>
<template>
  <footer class="flex flex-col w-full gap-4 bg-black lg:w-8xl h-80">
    <section class="grid grid-cols-4 gap-6 p-16">
      <div class="p-1 text-white">
        <h5 class="font-black uppercase">Menu</h5>
        <div
          v-for="item in PUBLIC_ROUTES"
          :key="item.name"
          class="flex flex-col my-2"
        >
          <ul class="flex flex-col gap-2">
            <li class="text-white cursor-pointer hover:text-blue-400">
              <nuxt-link :to="item.link">{{ item.name }}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="p-1 text-white">
        <h5 class="font-black uppercase">Redes Sociales</h5>
        <div class="flex gap-2">
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
    </section>
    <div
      class="relative flex items-center justify-center gap-2 p-2 bg-blue-400"
    >
      <p>
        Copyright &copy; <strong>{{ new Date().getFullYear() }}</strong>
      </p>
      <strong>Miguel Alvarez</strong>
    </div>
  </footer>
</template>
