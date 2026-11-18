<script lang="ts" setup>
  import { cn } from '~/utils/cn'
  import type { CardProps } from '../atom'

  const props = withDefaults(defineProps<CardProps>(), {
    tone: 'light',
    as: 'div',
    elevated: false
  })

  const attrs = useAttrs()
  defineOptions({ inheritAttrs: false })

  // cn() resuelve conflictos: la clase del llamador (radio, fondo, relleno) gana a la base.
  const classes = computed(() =>
    cn(
      'border',
      props.tone === 'light' &&
        'rounded-2xl border-brand-border bg-brand-surface-card text-brand-ink',
      props.tone === 'soft' &&
        'rounded-xl border-brand-border bg-brand-surface-soft text-brand-ink',
      props.tone === 'dark' &&
        'rounded-2xl border-brand-border-strong/70 bg-brand-surface-panel text-brand-text-strong',
      props.elevated && 'shadow-card',
      typeof attrs.class === 'string' ? attrs.class : undefined
    )
  )
  const rest = computed(() => {
    const others = { ...attrs }
    delete others.class
    return others
  })
</script>

<template>
  <component :is="as" v-bind="rest" :class="classes">
    <slot />
  </component>
</template>
