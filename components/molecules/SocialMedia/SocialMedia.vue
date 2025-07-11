<script lang="ts" setup>
  defineProps({
    link: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    isHovered: { type: Boolean, required: true },

    size: { type: Number, required: true }
  })

  const iconStyles = {
    base: {
      color: 'white'
    },
    hover: {
      color: 'oklch(70.7% 0.165 254.624)'
    }
  }
</script>
<template>
  <div>
    <div class="flex flex-col my-2">
      <ul class="flex flex-row gap-2">
        <li :key="name" class="text-white cursor-pointer hover:text-gray-400">
          <NuxtLink :to="link" target="_blank" :aria-label="name">
            <Icon
              :name="icon"
              :size="size"
              :style="isHovered ? iconStyles.hover : iconStyles.base"
            />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
<style></style>
