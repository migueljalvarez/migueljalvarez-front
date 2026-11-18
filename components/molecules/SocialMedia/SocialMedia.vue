<script lang="ts" setup>
  import type { SocialMediaProps } from '../molecule'

  defineProps<SocialMediaProps>()
</script>

<template>
  <ul class="my-2 flex flex-row gap-2">
    <li
      class="transition-colors duration-200 motion-reduce:transition-none"
      :class="
        onLight
          ? 'text-brand-muted hover:text-brand-ink'
          : 'text-brand-text-subtle hover:text-brand-text-strong'
      "
    >
      <NuxtLink
        :to="link"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="name"
        class="flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
        :class="onLight ? 'focus-visible:outline-brand-blue' : 'focus-visible:outline-brand-white'"
      >
        <Icon :name="icon" :size="size" aria-hidden="true" />
        {{ name }}
      </NuxtLink>
    </li>
  </ul>
</template>
