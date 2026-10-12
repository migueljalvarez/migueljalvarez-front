<script setup lang="ts">
  import { Section } from '~/components/organisms'
  import {
    WORK_FAQ,
    WORK_IDENTITY_NOTE,
    WORK_NON_NEGOTIABLES,
    WORK_POLICY_BLOCKS,
    WORK_COMMITMENTS
  } from '~/data/work'
</script>

<template>
  <Section id="como-trabajo" class="gap-8 bg-brand-surface px-4 py-12 md:gap-10 md:py-16">
    <div class="mx-auto w-full max-w-7xl">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent-text">
        Cómo trabajo
      </p>
      <h1 class="max-w-3xl text-3xl font-semibold leading-tight text-brand-ink md:text-4xl">
        Acuerdos claros para construir con confianza
      </h1>
      <p class="mt-3 max-w-3xl text-base leading-7 text-brand-muted">
        Una colaboración funciona mejor cuando sabemos qué esperar, cómo tomamos decisiones y qué
        pasa después de entregar.
      </p>
    </div>

    <div class="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-2">
      <article
        class="rounded-2xl border border-brand-border bg-brand-surface-card p-6 shadow-[0_8px_22px_var(--color-brand-shadow-card)]"
      >
        <h2 class="text-xl font-semibold text-brand-ink">Me comprometo a</h2>
        <ul class="mt-4 space-y-3 text-sm leading-6 text-brand-muted">
          <li v-for="item in WORK_COMMITMENTS" :key="item" class="flex gap-3">
            <Icon
              name="mdi:check-circle-outline"
              size="19"
              class="mt-0.5 shrink-0 text-brand-blue"
              aria-hidden="true"
            />
            <span>{{ item }}</span>
          </li>
        </ul>
      </article>
      <article
        class="rounded-2xl border border-brand-border bg-brand-surface-card p-6 shadow-[0_8px_22px_var(--color-brand-shadow-card)]"
      >
        <h2 class="text-xl font-semibold text-brand-ink">No acepto</h2>
        <ul class="mt-4 space-y-3 text-sm leading-6 text-brand-muted">
          <li v-for="item in WORK_NON_NEGOTIABLES" :key="item" class="flex gap-3">
            <Icon
              name="mdi:minus-circle-outline"
              size="19"
              class="mt-0.5 shrink-0 text-brand-accent-text"
              aria-hidden="true"
            />
            <span>{{ item }}</span>
          </li>
        </ul>
      </article>
    </div>

    <p
      class="mx-auto w-full max-w-7xl rounded-xl border border-brand-border-strong bg-brand-surface-soft px-5 py-4 text-sm font-medium leading-6 text-brand-ink"
    >
      {{ WORK_IDENTITY_NOTE }}
    </p>

    <div class="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-3">
      <article
        v-for="block in WORK_POLICY_BLOCKS"
        :key="block.id"
        class="rounded-2xl border border-brand-border bg-brand-surface-card p-5 shadow-[0_8px_22px_var(--color-brand-shadow-card)] md:p-6"
      >
        <h2 class="text-lg font-semibold text-brand-ink">{{ block.titulo }}</h2>
        <p class="mt-3 text-sm leading-6 text-brand-muted">{{ block.texto }}</p>
      </article>
    </div>

    <div class="mx-auto w-full max-w-7xl">
      <h2 class="text-2xl font-semibold text-brand-ink">Preguntas frecuentes</h2>
      <div class="mt-5 space-y-3">
        <details
          v-for="item in WORK_FAQ"
          :key="item.pregunta"
          class="group rounded-xl border border-brand-border bg-brand-surface-card px-5 py-4"
        >
          <summary
            class="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-ink marker:content-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          >
            <span>{{ item.pregunta }}</span>
            <Icon
              name="mdi:plus"
              size="19"
              class="shrink-0 text-brand-blue transition-transform group-open:rotate-45 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </summary>
          <p class="pt-3 text-sm leading-6 text-brand-muted">{{ item.respuesta }}</p>
        </details>
      </div>
    </div>
  </Section>
</template>
