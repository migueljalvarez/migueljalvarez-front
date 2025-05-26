<script lang="ts" setup>
const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    default: "bg-gray-200",
  },
})
const bannerClass = computed(() => ({
 "bg-slate-200/60 text-slate-900": props.theme === 'info',
 "bg-green-200/60 text-green-900": props.theme === 'success',
 "bg-yellow-200/60 text-yellow-900": props.theme === 'warning',
 "bg-red-200 text-red-500": props.theme === 'danger',
}))

</script>
<template>
  <div>
    <p class="px-4 text-sm rounded-full" :class="bannerClass">{{value}}</p>
  </div>
</template>

<style></style>
