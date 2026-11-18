<script lang="ts" setup>
  import { Eyebrow } from '~/components/atoms'
  import type { SectionHeaderProps } from '../molecule'

  withDefaults(defineProps<SectionHeaderProps>(), {
    level: 'h2',
    tone: 'light',
    size: 'md'
  })
</script>

<template>
  <div>
    <Eyebrow v-if="eyebrow" :tone="tone" class="mb-3">
      {{ eyebrow }}
      <slot name="eyebrow-extra" />
    </Eyebrow>
    <component
      :is="level"
      :id="headingId"
      class="font-semibold leading-tight"
      :class="[
        size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl',
        tone === 'dark' ? 'text-brand-text-strong' : 'text-brand-ink'
      ]"
    >
      {{ heading }}
    </component>
    <p
      v-if="description || $slots.default"
      class="mt-3 text-sm leading-6 md:text-base md:leading-7"
      :class="tone === 'dark' ? 'text-brand-text-subtle' : 'text-brand-muted'"
    >
      <slot>{{ description }}</slot>
    </p>
  </div>
</template>
