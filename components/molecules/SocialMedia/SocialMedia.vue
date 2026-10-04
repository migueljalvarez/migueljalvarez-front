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
      color: '#C9D1DC'
    },
    hover: {
      color: '#F5F7FA'
    }
  }
</script>
<template>
  <div>
    <div class="flex flex-col my-2">
      <ul class="flex flex-row gap-2">
        <li
          :key="name"
          class="text-[#C9D1DC] cursor-pointer hover:text-[#F5F7FA] transition-colors duration-200"
        >
          <NuxtLink :to="link" target="_blank" :aria-label="name" class="flex items-center gap-2">
            <Icon
              :name="icon"
              :size="size"
              :style="isHovered ? iconStyles.hover : iconStyles.base"
            />
            {{ name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
<style></style>
