<script setup lang="ts">
  import { Eyebrow } from '~/components/atoms'
  import { BackLink, CheckList } from '~/components/molecules'
  import { PRIVACY_SECTIONS, PRIVACY_UPDATED_AT } from '~/data/privacy'

  definePageMeta({ path: '/privacidad' })

  usePageSeo({
    title: 'Política de tratamiento de datos',
    description:
      'Cómo trato los datos personales que compartes a través del formulario de contacto: finalidades, derechos y cómo ejercerlos.',
    path: '/privacidad'
  })

  const updatedAt = new Date(`${PRIVACY_UPDATED_AT}T12:00:00`).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
</script>

<template>
  <div class="bg-brand-surface px-4 py-8 md:py-12">
    <div class="mx-auto w-full max-w-3xl">
      <BackLink to="/" class="mb-8">Volver al inicio</BackLink>

      <Eyebrow class="mb-3">Privacidad</Eyebrow>
      <h1 class="text-3xl font-semibold leading-tight text-brand-ink md:text-4xl">
        Política de tratamiento de datos personales
      </h1>
      <p class="mt-3 text-sm text-brand-muted">Última actualización: {{ updatedAt }}</p>

      <nav
        aria-label="Contenido de la política"
        class="mt-8 rounded-2xl border border-brand-border bg-brand-surface-card p-5"
      >
        <ul class="grid gap-2 text-sm sm:grid-cols-2">
          <li v-for="section in PRIVACY_SECTIONS" :key="section.id">
            <a
              :href="`#${section.id}`"
              class="inline-flex min-h-11 items-center text-brand-accent-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
            >
              {{ section.title }}
            </a>
          </li>
        </ul>
      </nav>

      <article class="mt-8 space-y-8">
        <section
          v-for="section in PRIVACY_SECTIONS"
          :id="section.id"
          :key="section.id"
          class="scroll-mt-24"
        >
          <h2 class="text-xl font-semibold text-brand-ink">{{ section.title }}</h2>
          <p
            v-for="paragraph in section.paragraphs"
            :key="paragraph"
            class="mt-3 text-base leading-7 text-brand-muted"
          >
            {{ paragraph }}
          </p>
          <CheckList v-if="section.items" :items="section.items" size="md" class="mt-3" />
        </section>
      </article>
    </div>
  </div>
</template>
