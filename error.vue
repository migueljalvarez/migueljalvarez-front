<script setup lang="ts">
  import type { NuxtError } from '#app'
  import Button from '~/components/atoms/Button/Button.vue'

  const props = defineProps<{ error: NuxtError }>()

  const isNotFound = computed(() => props.error.statusCode === 404)
  const title = computed(() =>
    isNotFound.value ? 'No encontré esta página' : 'Algo salió mal de mi lado'
  )
  const description = computed(() =>
    isNotFound.value
      ? 'Puede que el enlace esté desactualizado o que la página ya no exista. Te llevo de vuelta para que sigas explorando.'
      : 'Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio; si el problema continúa, escríbeme.'
  )

  useSeoMeta({
    title: () => (isNotFound.value ? 'Página no encontrada' : 'Error'),
    robots: 'noindex, nofollow'
  })

  const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout name="default">
    <section
      class="flex min-h-[70vh] items-center justify-center bg-brand-surface px-4 py-16"
      aria-labelledby="error-heading"
    >
      <div class="mx-auto w-full max-w-xl text-center">
        <p class="font-display text-7xl font-semibold text-brand-blue md:text-8xl">
          {{ error.statusCode }}
        </p>
        <h1 id="error-heading" class="mt-4 text-2xl font-semibold text-brand-ink md:text-3xl">
          {{ title }}
        </h1>
        <p class="mt-3 text-base leading-7 text-brand-muted">{{ description }}</p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button theme="primary" size="md" @click="goHome">Volver al inicio</Button>
          <NuxtLink
            to="/#contact"
            class="inline-flex min-h-11 items-center text-sm font-semibold text-logo-blue underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
            @click="clearError()"
          >
            Escríbeme
          </NuxtLink>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
