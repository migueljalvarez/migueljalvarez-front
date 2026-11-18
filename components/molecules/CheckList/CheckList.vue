<script lang="ts" setup>
  import type { CheckListProps } from '../molecule'

  withDefaults(defineProps<CheckListProps>(), {
    tone: 'light',
    size: 'sm',
    icon: 'mdi:check-circle-outline',
    iconClass: undefined,
    inline: false
  })

  const textOf = (item: CheckListProps['items'][number]) =>
    typeof item === 'string' ? item : item.text
  const noteOf = (item: CheckListProps['items'][number]) =>
    typeof item === 'string' ? undefined : item.note
</script>

<template>
  <ul
    :class="[
      inline ? 'flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5' : 'space-y-3',
      size === 'md' ? 'text-base leading-7' : 'text-sm leading-6',
      tone === 'dark' ? 'text-brand-text-subtle' : 'text-brand-muted'
    ]"
  >
    <li v-for="item in items" :key="textOf(item)" class="flex gap-3">
      <Icon
        :name="icon"
        size="19"
        class="shrink-0"
        :class="[
          size === 'md' ? 'mt-1' : 'mt-0.5',
          iconClass ?? (tone === 'dark' ? 'text-brand-text-soft' : 'text-brand-blue')
        ]"
        aria-hidden="true"
      />
      <span>
        {{ textOf(item) }}
        <span v-if="noteOf(item)" class="block text-xs leading-5">{{ noteOf(item) }}</span>
      </span>
    </li>
  </ul>
</template>
