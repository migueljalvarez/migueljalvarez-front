<script setup lang="ts">
  // Aviso de éxito o error. La región vive siempre en el DOM y solo el mensaje aparece y desaparece:
  // así los lectores de pantalla lo anuncian (`status` = amable, `alert` = inmediato). Sin mensaje no
  // ocupa espacio: el margen (`gap`: arriba o abajo) solo se aplica mientras hay mensaje. Las acciones
  // (p. ej. "Reintentar") van en el slot.
  withDefaults(
    defineProps<{ tone?: 'success' | 'error'; message?: string; gap?: 'top' | 'bottom' }>(),
    { tone: 'success', gap: 'bottom' }
  )
</script>

<template>
  <div
    :role="tone === 'error' ? 'alert' : 'status'"
    aria-atomic="true"
    :class="message ? (gap === 'top' ? 'mt-4' : 'mb-4') : undefined"
  >
    <div
      v-if="message"
      class="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-3 py-2 text-sm font-medium"
      :class="
        tone === 'error'
          ? 'border-brand-error-border bg-brand-error-bg text-brand-error-text'
          : 'border-brand-success-border bg-brand-success-bg text-brand-success-text'
      "
    >
      <Icon
        :name="tone === 'error' ? 'mdi:alert-circle-outline' : 'mdi:check-circle-outline'"
        size="20"
        class="shrink-0"
        aria-hidden="true"
      />
      <p class="min-w-0 flex-1 leading-6">{{ message }}</p>
      <slot />
    </div>
  </div>
</template>
