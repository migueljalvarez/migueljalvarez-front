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
      'flex flex-row items-center justify-center gap-2 font-semibold rounded-lg cursor-pointer transition-colors duration-200 motion-reduce:transition-none disabled:text-brand-helper disabled:bg-brand-border disabled:cursor-not-allowed',
      props.iconPosition !== 'left' && 'flex-row-reverse',
      props.uppercase && 'uppercase',
      props.size === 'sm' && 'min-h-8 py-2 px-4 text-xs leading-none',
      props.size === 'md' && 'min-h-9 py-2 px-4 text-sm leading-none',
      props.size === 'lg' && 'min-h-[50px] py-3.5 px-7 text-sm leading-none',
      props.theme === 'primary' && 'bg-brand-accent text-brand-white hover:bg-brand-mid shadow-sm',
      props.theme === 'secondary' &&
        'border border-brand-border bg-transparent text-brand-ink hover:bg-brand-surface-soft',
      props.theme === 'tertiary' && 'bg-brand-accent text-brand-white hover:bg-brand-mid',
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
    :disabled="isLink ? undefined : props.disabled"
  >
    <Icon
      v-if="props.icon"
      :name="props.icon"
      :size="props.size === 'sm' ? 16 : props.size === 'md' ? 20 : 22"
    />
    <slot />
  </component>
</template>
