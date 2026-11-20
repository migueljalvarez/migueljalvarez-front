<script lang="ts" setup>
  import { Eyebrow, Heading } from '~/components/atoms'
  import type { SectionHeaderProps } from '../molecule'

  withDefaults(defineProps<SectionHeaderProps>(), {
    level: 'h2',
    tone: 'light'
  })
</script>

<template>
  <div>
    <Eyebrow v-if="eyebrow" :tone="tone" class="mb-3">
      {{ eyebrow }}
      <slot name="eyebrow-extra" />
    </Eyebrow>
    <Heading :id="headingId" :level="level" :tone="tone">
      {{ heading }}
    </Heading>
    <p
      v-if="description || $slots.default"
      class="mt-3 text-sm leading-6 md:text-base md:leading-7"
      :class="tone === 'dark' ? 'text-brand-text-subtle' : 'text-brand-muted'"
    >
      <slot>{{ description }}</slot>
    </p>
  </div>
</template>
