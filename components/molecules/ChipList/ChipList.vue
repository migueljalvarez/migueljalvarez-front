<script lang="ts" setup>
  import { Chip } from '~/components/atoms'
  import type { ChipListProps } from '../molecule'

  defineProps<ChipListProps>()
</script>

<template>
  <ul class="flex flex-wrap gap-2" :aria-label="label">
    <li v-for="item in items" :key="item" class="min-w-0">
      <Chip pill class="max-w-full break-words">{{ item }}</Chip>
    </li>
  </ul>
</template>
