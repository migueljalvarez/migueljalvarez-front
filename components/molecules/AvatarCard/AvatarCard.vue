<script lang="ts" setup>
  import { Avatar, Badge } from '~/components/atoms'

  import type { AvatarCardProps } from '../molecules'
  import { Icon } from '#components'
  import type { SocialMediaType } from '~/types/common'

  defineProps<AvatarCardProps>()

  const iconStyles = {
    base: { color: 'gray' },
    hover: { color: 'oklch(70.7% 0.165 254.624)' }
  }
  const hoverIcon = (item: SocialMediaType) => {
    item.isHovered = true
  }
  const leaveIcon = (item: SocialMediaType) => {
    item.isHovered = false
  }
</script>
<template>
  <div class="flex items-center justify-start gap-2">
    <Avatar :image="image" :name="name" />
    <div class="flex flex-col items-center justify-start min-w-max">
      <div class="flex items-center">
        <p class="py-2 text-lg font-black text-white uppercase">{{ name }}</p>
        <span v-for="social in socialMedia" :key="social.name" class="gap-2 px-2">
          <NuxtLink
            :href="social.link"
            target="_blank"
            class="flex flex-row"
            :aria-label="social.name"
          >
            <Icon
              :name="social.icon"
              :size="22"
              :style="social.isHovered ? iconStyles.hover : iconStyles.base"
              @mouseover="hoverIcon(social)"
              @mouseleave="leaveIcon(social)"
            />
          </NuxtLink>
        </span>
      </div>
      <p class="w-full text-xs font-normal text-gray-500 md:text-sm">
        {{ subTitle }}
      </p>
      <Badge
        class="self-start py-2 text-xs font-normal md:text-sm"
        :theme="type === 'Trabajo' ? 'warning' : 'success'"
        :value="type"
      />
    </div>
  </div>
</template>
<style></style>
