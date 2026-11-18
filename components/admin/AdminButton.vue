<script setup lang="ts">
  import { NuxtLink } from '#components'

  // Botón del panel (44 px de alto). Con `loadingLabel`, el texto de carga ocupa el mismo ancho que el
  // normal: el botón no cambia de tamaño al enviar. Con `to` es un enlace interno y con `href`, un
  // enlace externo en pestaña nueva; en ambos casos se ve igual que un botón.
  const props = withDefaults(
    defineProps<{
      variant?: 'primary' | 'secondary' | 'danger' | 'danger-solid' | 'ghost'
      type?: 'button' | 'submit'
      disabled?: boolean
      loading?: boolean
      loadingLabel?: string
      to?: string
      href?: string
    }>(),
    { variant: 'secondary', type: 'button' }
  )

  const tag = computed(() => (props.href ? 'a' : props.to ? NuxtLink : 'button'))
  const attrs = computed(() => {
    if (props.href) return { href: props.href, target: '_blank', rel: 'noopener' }
    if (props.to) return { to: props.to }
    return {
      type: props.type,
      disabled: props.disabled || props.loading,
      'aria-busy': props.loading || undefined
    }
  })

  const classes = computed(
    () =>
      ({
        primary: 'bg-brand-accent text-brand-white hover:bg-brand-mid',
        secondary: 'border border-brand-border text-brand-ink hover:bg-brand-surface-soft',
        danger: 'text-brand-error-text hover:bg-brand-error-bg',
        'danger-solid': 'bg-brand-error-text text-brand-white hover:bg-brand-danger-text',
        ghost: 'text-brand-accent-text hover:bg-brand-surface-soft'
      })[props.variant]
  )
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-60"
    :class="classes"
  >
    <span v-if="loadingLabel" class="grid">
      <span
        class="col-start-1 row-start-1 inline-flex items-center justify-center gap-2"
        :class="{ invisible: loading }"
      >
        <slot />
      </span>
      <span
        class="col-start-1 row-start-1 inline-flex items-center justify-center gap-2"
        :class="{ invisible: !loading }"
      >
        <Icon name="mdi:loading" size="18" class="motion-safe:animate-spin" aria-hidden="true" />
        {{ loadingLabel }}
      </span>
    </span>
    <slot v-else />
  </component>
</template>
