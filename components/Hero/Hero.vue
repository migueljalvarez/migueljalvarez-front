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
    class="flex flex-wrap justify-center p-2"
    :class="heroClass"
  >
    <p class="p-4 italic sm:w-auto xsm:text-2xl md:text-3xl lg:text-4xl lg:p-10">
      {{ value }}
    </p>
  </section>
</template>

<style></style>
