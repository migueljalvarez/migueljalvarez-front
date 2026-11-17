<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
      type?: 'button' | 'submit'
      disabled?: boolean
    }>(),
    { variant: 'secondary', type: 'button' }
  )

  const classes = computed(
    () =>
      ({
        primary: 'bg-brand-accent text-brand-white hover:bg-brand-mid',
        secondary: 'border border-brand-border text-brand-ink hover:bg-brand-surface-soft',
        danger: 'text-brand-error-text hover:bg-brand-error-bg',
        ghost: 'text-brand-accent-text hover:bg-brand-surface-soft'
      })[props.variant]
  )
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-60"
    :class="classes"
  >
    <slot />
  </button>
</template>
