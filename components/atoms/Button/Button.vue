<script lang="ts" setup>
  import { cn } from '~/utils/cn'
  import type { ButtonProps } from '../atom'

  const props = withDefaults(defineProps<ButtonProps>(), {
    size: 'md',
    theme: 'primary',
    uppercase: false,
    onDark: false,
    iconPosition: 'left',
    type: 'button',
    as: 'button'
  })

  const attrs = useAttrs()
  const classes = computed(() =>
    cn(
      'flex flex-row items-center justify-center gap-2 font-semibold rounded-lg cursor-pointer transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:text-brand-muted disabled:bg-brand-surface-soft disabled:border-brand-border-strong disabled:shadow-none disabled:cursor-not-allowed disabled:hover:bg-brand-surface-soft',
      props.onDark ? 'focus-visible:outline-brand-white' : 'focus-visible:outline-brand-blue',
      props.iconPosition !== 'left' && 'flex-row-reverse',
      props.uppercase && 'uppercase',
      // Objetivo táctil mínimo de 44 px (min-h-11) en todos los tamaños
      props.size === 'sm' && 'min-h-11 py-2 px-4 text-xs leading-none',
      props.size === 'md' && 'min-h-11 py-2 px-4 text-sm leading-none',
      props.size === 'lg' && 'min-h-12.5 py-3.5 px-7 text-sm leading-none',
      props.theme === 'primary' && 'bg-brand-accent text-brand-white hover:bg-brand-mid',
      props.theme === 'secondary' &&
        (props.onDark
          ? 'border border-brand-text-soft bg-transparent text-brand-text-strong hover:bg-brand-white/10'
          : 'border border-brand-border bg-transparent text-brand-ink hover:bg-brand-surface-soft'),
      props.theme === 'tertiary' && 'bg-brand-accent text-brand-white hover:bg-brand-mid',
      props.theme === 'whatsapp' && 'bg-brand-whatsapp text-brand-white hover:bg-brand-whatsapp/90',
      typeof attrs.class === 'string' ? attrs.class : undefined
    )
  )

  const isInternalLink = computed(() => !!props.to)
  const isLink = computed(() => isInternalLink.value || props.as === 'a' || !!props.href)
  const tag = computed(() =>
    isInternalLink.value ? resolveComponent('NuxtLink') : isLink.value ? 'a' : 'button'
  )

  const componentAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    if (isInternalLink.value) return { to: props.to, ...rest }
    return isLink.value
      ? { href: props.href, target: props.target, rel: props.rel, ...rest }
      : { type: props.type, ...rest }
  })

  defineOptions({ inheritAttrs: false })
</script>

<template>
  <component
    :is="tag"
    v-bind="componentAttrs"
    :class="classes"
    :disabled="isLink ? undefined : props.disabled"
    :aria-disabled="!isLink && props.disabled ? 'true' : undefined"
  >
    <Icon
      v-if="props.icon"
      :name="props.icon"
      :size="props.size === 'sm' ? 16 : props.size === 'md' ? 20 : 22"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>
