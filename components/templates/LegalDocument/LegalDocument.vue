<script lang="ts" setup>
  import { Eyebrow } from '~/components/atoms'
  import { BackLink, CheckList } from '~/components/molecules'
  import type { LegalDocumentProps } from '../template'

  const props = defineProps<LegalDocumentProps>()

  const updatedAtLabel = computed(() =>
    new Date(`${props.updatedAt}T12:00:00`).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  )
</script>

<template>
  <div class="bg-brand-surface px-4 py-12 md:py-16">
    <div class="mx-auto w-full max-w-3xl">
      <BackLink to="/" class="mb-6">Volver al inicio</BackLink>

      <Eyebrow class="mb-3">{{ eyebrow }}</Eyebrow>
      <h1 class="text-3xl font-semibold leading-tight text-brand-ink md:text-4xl">
        {{ title }}
      </h1>
      <p class="mt-3 text-sm text-brand-muted">Última actualización: {{ updatedAtLabel }}</p>

      <nav
        :aria-label="navLabel"
        class="mt-6 rounded-2xl border border-brand-border bg-brand-surface-card p-5"
      >
        <ul class="grid gap-2 text-sm sm:grid-cols-2">
          <li v-for="section in sections" :key="section.id">
            <a
              :href="`#${section.id}`"
              class="inline-flex min-h-11 items-center text-brand-accent-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
            >
              {{ section.title }}
            </a>
          </li>
        </ul>
      </nav>

      <article class="mt-6 space-y-8">
        <section
          v-for="section in sections"
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
          <NuxtLink
            v-if="section.link"
            :to="section.link.to"
            class="mt-2 inline-flex min-h-11 items-center text-base font-medium text-brand-accent-text underline underline-offset-4 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          >
            {{ section.link.label }}
          </NuxtLink>
        </section>
      </article>
    </div>
  </div>
</template>
