<script lang="ts" setup>
  type StatusMessageProps = {
    /** Icono (mdi:*) decorativo. */
    icon: string
    title: string
    /** `h1` cuando el mensaje es el encabezado principal de la página. */
    level?: 'h1' | 'h2'
    tone?: 'success' | 'neutral' | 'warning'
    /** `alert` para errores que deben anunciarse de inmediato; `status` para el resto. */
    role?: 'status' | 'alert'
  }

  // Mensaje de estado de una página interior (gracias, enlace no válido, error). Icono decorativo en un
  // marcador redondo, título (h2) y texto/acciones en el slot.
  withDefaults(defineProps<StatusMessageProps>(), { tone: 'neutral', role: 'status', level: 'h2' })

  const tones = {
    success: 'bg-brand-success-bg text-brand-success-text',
    neutral: 'bg-brand-surface-soft text-brand-accent-text',
    warning: 'bg-brand-warning-bg text-brand-warning-text'
  }
</script>

<template>
  <div class="text-center" :role="role">
    <span
      class="mx-auto flex size-14 items-center justify-center rounded-full"
      :class="tones[tone]"
      aria-hidden="true"
    >
      <Icon :name="icon" size="28" />
    </span>
    <component :is="level" class="mt-5 text-2xl font-semibold leading-tight text-brand-ink">
      {{ title }}
    </component>
    <div class="mx-auto mt-3 max-w-md text-base leading-7 text-brand-muted">
      <slot />
    </div>
    <div v-if="$slots.actions" class="mt-6 flex flex-wrap justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>
