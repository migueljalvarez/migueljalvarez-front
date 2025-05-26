<script lang="ts" setup>
const props = defineProps({
  value: { type: String, required: true },
  color: { type: String, required: true },
});
const heroClass = computed(() => ({
  "bg-gray-200": props.color === "gray" ? true : false,
}));
</script>
<template>
  <section
    class="flex items-center justify-center w-full lg:w-8xl"
    :class="heroClass"
  >
    <p class="p-10 text-4xl italic">
      {{ value }}
    </p>
  </section>
</template>

<style></style>
