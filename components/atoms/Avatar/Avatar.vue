<script lang="ts" setup>
  import type { AvatarProps } from '../atom'

  const props = withDefaults(defineProps<AvatarProps>(), {
    size: 'sm'
  })
  const avatarClass = computed(() => ({
    'size-15 lg:size-20': props.size === 'sm',
    'size-20 lg:size-25': props.size === 'md',
    'size-30': props.size === 'lg'
  }))
</script>
<template>
  <div class="flex min-w-max">
    <NuxtImg
      :src="image"
      :alt="name"
      :class="avatarClass"
      format="webp"
      class="self-center object-cover mb-2 border-4 border-blue-400 rounded-full cursor-pointer"
      loading="lazy"
      :preload="true"
    />
  </div>
</template>
// size-20 md:mb-0 md:size-25 lg:size-30
<style></style>
