<script lang="ts" setup>
  import { Button, Eyebrow, Heading } from '~/components/atoms'
  import { BackLink, CheckList } from '~/components/molecules'
  import { WHATSAPP_URL } from '~/constants/common'
  import type { GuideArticleProps } from '../template'

  const props = defineProps<GuideArticleProps>()

  const updatedAtLabel = computed(() =>
    new Date(`${props.guide.updatedAt}T12:00:00`).toLocaleDateString('es-CO', {
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

      <Eyebrow class="mb-3">{{ guide.eyebrow }}</Eyebrow>
      <Heading level="h1">{{ guide.title }}</Heading>
      <p class="mt-3 text-sm text-brand-muted">Última actualización: {{ updatedAtLabel }}</p>

      <div class="mt-6 space-y-3">
        <p
          v-for="paragraph in guide.intro"
          :key="paragraph"
          class="text-base leading-7 text-brand-muted"
        >
          {{ paragraph }}
        </p>
      </div>

      <nav
        aria-label="Contenido de la guía"
        class="mt-6 rounded-2xl border border-brand-border bg-brand-surface-card p-5"
      >
        <ul class="grid gap-2 text-sm sm:grid-cols-2">
          <li v-for="section in guide.sections" :key="section.id">
            <a
              :href="`#${section.id}`"
              class="inline-flex min-h-11 items-center text-logo-blue underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
            >
              {{ section.title }}
            </a>
          </li>
        </ul>
      </nav>

      <article class="mt-6 space-y-8">
        <section
          v-for="section in guide.sections"
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
          <ol
            v-if="section.items && section.ordered"
            class="mt-3 list-decimal space-y-2 pl-6 text-base leading-7 text-brand-muted marker:font-semibold marker:text-logo-blue"
          >
            <li v-for="item in section.items" :key="item" class="pl-1">{{ item }}</li>
          </ol>
          <CheckList v-else-if="section.items" :items="section.items" size="md" class="mt-3" />
        </section>

        <section
          aria-labelledby="guide-cta-title"
          class="rounded-2xl border border-brand-border bg-brand-surface-card p-5 md:p-6"
        >
          <h2 id="guide-cta-title" class="text-xl font-semibold text-brand-ink">
            {{ guide.cta.heading }}
          </h2>
          <p class="mt-3 text-base leading-7 text-brand-muted">{{ guide.cta.text }}</p>
          <Button
            as="a"
            :href="WHATSAPP_URL"
            target="_blank"
            rel="noopener noreferrer"
            theme="whatsapp"
            icon="mdi:whatsapp"
            icon-position="left"
            class="mt-4 w-full sm:w-fit"
          >
            {{ guide.cta.label }}
          </Button>
        </section>
      </article>
    </div>
  </div>
</template>
