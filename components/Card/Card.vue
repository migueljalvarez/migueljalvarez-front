<script lang="ts" setup>
const props = defineProps({
  size: { type: String, default: "md" },
});
const cardClass = computed(() => ({
  'w-200': props.size === 'md'
}));
</script>
<template>
  <div :class="cardClass" class="flex flex-col gap-8 p-8 bg-white border-2 border-transparent shadow-lg rounded-xl">
    <slot />
  </div>
</template>

<style></style>
