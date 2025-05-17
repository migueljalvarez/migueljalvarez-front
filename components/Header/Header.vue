<script lang="ts" setup>
import { PUBLIC_ROUTES } from "~/constants/routes";
import { MY_SOCIAL_MEDIA } from "~/constants/common";
import type {  SocialMediaType } from "~/common/types";
const socials = ref<SocialMediaType[]>(MY_SOCIAL_MEDIA);
const hoverIcon = (item: SocialMediaType) => {
  item.isHovered = true;
};
const leaveIcon = (item: SocialMediaType) => {
  item.isHovered = false;
};
</script>
<template>
  <header class="w-full h-20 bg-black lg:w-8xl">

    <div class="flex flex-row items-center justify-start h-full gap-2 mx-8">
      <ul
        v-for="item in PUBLIC_ROUTES"
        :key="item.name"
        class="flex flex-row gap-2 mx-2 font-black uppercase"
      >
        <li class="text-white cursor-pointer hover:text-blue-400">
          <nuxt-link :to="item.link">{{ item.name }}</nuxt-link>
        </li>
      </ul>
      <div class="flex gap-2 ml-auto">
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
  </header>
</template>

<style></style>
