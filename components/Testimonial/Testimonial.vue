
<script lang="ts" setup>
import type { Testimonial, SocialMediaType } from "~/common/types";
 defineProps({
  items: { type: Array<Testimonial>, required: true },

    
});
const iconStyles = {
  base: {
    color: "gray",
  },
  hover: {
    color: "oklch(70.7% 0.165 254.624)",
  },
};

const hoverIcon = (item: SocialMediaType) => {
  item.isHovered = true;
};
const leaveIcon = (item: SocialMediaType) => {
  item.isHovered = false;
};
</script>
<template>
  <div
    v-for="(item, index) in items"
    :key="index"
    class="flex flex-col w-3/5 gap-2 overflow-hidden bg-gray-100 h-120 rounded-xl"
  >
    <img
      :src="item.image"
      :alt="item.name"
      class="self-center object-cover mt-4 rounded-full cursor-pointer size-36"
    />
    <div class="flex flex-col items-center justify-center p-4">
      <h4 class="flex flex-row text-lg font-bold uppercase place-items-center">
        {{ item.name }}
        <span class="flex flex-row gap-2 px-2">
          <a
            v-for="social in item.socialMedia"
            :key="social.name"
            :href="social.link"
            target="_blank"
            class="flex flex-row"
          >
            <Icon
              :name="social.icon"
              :size="24"
              :style="social.isHovered ? iconStyles.hover : iconStyles.base"
              @mouseover="hoverIcon(social)"
              @mouseleave="leaveIcon(social)"
            />
          </a>
        </span>
      </h4>
      <p class="text-sm text-gray-500">{{ item.position }}</p>
      <div class="overflow-auto max-h-40">
        <p class="w-full p-1 mt-1 text-gray-500 text-md text-wrap">
          <q>{{ item.description }}</q>
        </p>
      </div>
    </div>
  </div>
</template>

