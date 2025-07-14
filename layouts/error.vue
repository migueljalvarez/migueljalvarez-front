<!-- layouts/error.vue -->
<script setup lang="ts">
  interface NuxtError {
    statusCode: number
    statusMessage?: string
    message: string
    stack?: string
    url?: string
    cause?: unknown
  }
  defineProps<{ error: NuxtError }>()
</script>
<template>
  <div>
    <h1>Error {{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
  </div>
</template>
