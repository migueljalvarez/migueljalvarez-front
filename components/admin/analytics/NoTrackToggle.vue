<script setup lang="ts">
  // «No contar mis visitas»: guarda una marca solo en este navegador. Casilla nativa (accesible por
  // teclado), objetivo de 44 px y un texto de estado que se anuncia al cambiar.
  const { disabled, failed, toggle } = useNoTrack()
</script>

<template>
  <div class="rounded-lg border border-brand-border p-3">
    <label class="flex min-h-11 cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        class="mt-0.5 size-5 shrink-0 accent-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-blue"
        :checked="disabled"
        @change="toggle(($event.target as HTMLInputElement).checked)"
      />
      <span>
        <span class="block text-sm font-medium text-brand-ink">No contar mis visitas</span>
        <span class="mt-1 block text-xs leading-5 text-brand-muted">
          Guarda una marca solo en este navegador para que tus clics en el sitio público no se
          cuenten. Actívalo en cada navegador o dispositivo desde el que pruebes el sitio.
        </span>
      </span>
    </label>
    <p class="mt-1 pl-8 text-xs font-medium" role="status" aria-live="polite">
      <span v-if="failed" class="text-brand-error-text">
        Este navegador no permitió guardar la marca. Tus clics se seguirán contando.
      </span>
      <span v-else-if="disabled" class="text-brand-success-text">
        Activado: en este navegador no se cuentan tus clics.
      </span>
      <span v-else class="text-brand-muted">
        Desactivado: en este navegador tus clics se cuentan.
      </span>
    </p>
  </div>
</template>
