<script lang="ts" setup>
  import { Card } from '~/components/atoms'
  import type { InfoCardProps } from '../molecule'

  withDefaults(defineProps<InfoCardProps>(), { level: 'h3' })
</script>

<template>
  <Card as="article" class="min-w-0 p-5 md:p-6">
    <component :is="level" class="mb-3 text-lg font-semibold leading-tight text-brand-ink">
      {{ title }}
    </component>
    <p class="text-sm leading-6 text-brand-muted md:text-base md:leading-7">
      <slot />
    </p>
  </Card>
</template>
