<script lang="ts" setup>
  import { cn } from '~/utils/cn'
  import type { ButtonProps } from '../atom'

  const props = withDefaults(defineProps<ButtonProps>(), {
    size: 'sm',
    theme: 'primary',
    uppercase: false,
    iconPosition: 'left',
    type: 'button',
    as: 'button'
  })

  const attrs = useAttrs()
  const classes = computed(() =>
    cn(
      'flex flex-row items-center justify-center gap-2 font-semibold rounded-lg cursor-pointer transition-colors duration-200 disabled:text-brand-helper disabled:bg-brand-border disabled:cursor-not-allowed',
      props.iconPosition !== 'left' && 'flex-row-reverse',
      props.uppercase && 'uppercase',
      props.size === 'sm' && 'py-2 px-4 text-xs leading-none',
      props.size === 'md' && 'py-2 px-4 text-sm leading-none',
      props.size === 'lg' && 'py-3.5 px-7 text-sm leading-none',
      props.theme === 'primary' && 'bg-brand-ink text-white hover:bg-brand-accent shadow-sm',
      props.theme === 'secondary' &&
        'border border-brand-border bg-transparent text-brand-ink hover:bg-brand-surface-soft',
      props.theme === 'tertiary' && 'bg-brand-blue text-white hover:bg-brand-accent',
      typeof attrs.class === 'string' ? attrs.class : undefined
    )
  )

  const isLink = computed(() => props.as === 'a' || !!props.href)

  const componentAttrs = computed(() =>
    isLink.value
      ? { href: props.href, target: props.target, rel: props.rel, ...attrs }
      : { type: props.type, ...attrs }
  )

  defineOptions({ inheritAttrs: false })
</script>

<template>
  <component
    :is="isLink ? 'a' : 'button'"
    v-bind="componentAttrs"
    :class="classes"
    :disabled="!isLink && props.disabled"
  >
    <Icon
      v-if="props.icon"
      :name="props.icon"
      :size="props.size === 'sm' ? 16 : props.size === 'md' ? 20 : 22"
    />
    <slot />
  </component>
</template>

<style></style>
