<script lang="ts" setup>
  import type { BlockquoteProps } from '../molecules'

  const props = withDefaults(defineProps<BlockquoteProps>(), {
    text: 'Text Here',
    color: 'blue'
  })
  const blockquoteClass = computed(() => ({
    'text-brand-accent': props.color === 'blue'
  }))
</script>
<template>
  <div>
    <blockquote
      class="relative z-10 px-8 text-sm italic text-[#4D5868] md:p-8 md:text-lg md:text-left"
    >
      <span
        :class="blockquoteClass"
        class="absolute text-5xl left-1.5 -top-5 md:top-2.5 lg:left-[-30px] lg:top-0 lg:text-8xl font-mono leading-none select-none"
      >
        “
      </span>
      <p class="font-normal">{{ text }}</p>
    </blockquote>
  </div>
</template>

<style></style>
