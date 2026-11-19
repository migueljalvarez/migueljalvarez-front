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
  const primaryClasses = computed(() =>
    props.onDark
      ? // Sobre oscuro: ámbar (texto oscuro, 9,2:1). Deshabilitado: tenue con borde discontinuo. Enviando: conserva el ámbar.
        'border border-transparent bg-brand-warm text-brand-navy hover:bg-brand-warm/85 hover:ring-4 hover:ring-brand-warm/25 disabled:border-dashed disabled:border-brand-border-strong disabled:bg-brand-warm/10 disabled:text-brand-text-subtle disabled:ring-0 disabled:hover:bg-brand-warm/10 data-[loading=true]:disabled:border-solid data-[loading=true]:disabled:border-transparent data-[loading=true]:disabled:bg-brand-warm data-[loading=true]:disabled:text-brand-navy data-[loading=true]:disabled:hover:bg-brand-warm'
      : 'bg-brand-accent text-brand-white hover:bg-brand-mid'
  )
  const classes = computed(() =>
    cn(
      'flex flex-row items-center justify-center gap-2 font-semibold rounded-lg cursor-pointer data-[loading=true]:cursor-progress data-[loading=true]:disabled:opacity-100 transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:text-brand-muted disabled:bg-brand-surface-soft disabled:border-brand-border-strong disabled:shadow-none disabled:cursor-not-allowed disabled:hover:bg-brand-surface-soft',
      props.onDark ? 'focus-visible:outline-brand-white' : 'focus-visible:outline-brand-blue',
      props.iconPosition !== 'left' && 'flex-row-reverse',
      props.uppercase && 'uppercase',
      // Objetivo táctil mínimo de 44 px (min-h-11) en todos los tamaños
      props.size === 'sm' && 'min-h-11 py-2 px-4 text-xs leading-none',
      props.size === 'md' && 'min-h-11 py-2 px-4 text-sm leading-none',
      props.size === 'lg' && 'min-h-12.5 py-3.5 px-7 text-sm leading-none',
      // Principal: navy sobre fondo claro; ámbar con texto oscuro sobre fondo oscuro.
      props.theme === 'primary' && primaryClasses.value,
      props.theme === 'secondary' &&
        (props.onDark
          ? 'border border-brand-text-soft bg-transparent text-brand-text-strong hover:bg-brand-white/10'
          : 'border border-brand-border bg-transparent text-brand-ink hover:bg-brand-surface-soft'),
      props.theme === 'tertiary' && primaryClasses.value,
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
    :aria-busy="props.loading ? 'true' : undefined"
    :data-loading="props.loading ? 'true' : undefined"
  >
    <Icon
      v-if="props.loading"
      name="mdi:loading"
      :size="props.size === 'sm' ? 16 : props.size === 'md' ? 20 : 22"
      class="motion-safe:animate-spin"
      aria-hidden="true"
    />
    <Icon
      v-if="props.icon"
      :name="props.icon"
      :size="props.size === 'sm' ? 16 : props.size === 'md' ? 20 : 22"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>
