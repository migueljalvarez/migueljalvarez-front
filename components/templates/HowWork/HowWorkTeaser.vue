<script setup lang="ts">
  import Button from '~/components/atoms/Button/Button.vue'
  import { Section } from '~/components/organisms'
  import { WORK_COMMITMENTS } from '~/data/work'
</script>

<template>
  <Section id="como-trabajo" class="gap-8 px-4 py-12 md:py-16">
    <div
      class="relative mx-auto flex w-full max-w-7xl flex-col gap-6 overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-card p-6 shadow-[0_8px_22px_var(--color-brand-shadow-card)] md:p-8"
    >
      <NuxtImg
        src="only-brand-color.svg"
        width="256"
        height="256"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute -right-20 -top-10 z-0 size-64 select-none opacity-[0.10]"
      />
      <div class="relative z-10">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent-text">
          Cómo trabajo
        </p>
        <h2 class="text-2xl font-semibold leading-tight text-brand-ink md:text-3xl">
          Acuerdos claros para construir con confianza
        </h2>
        <ul
          class="mt-5 grid gap-3 text-sm leading-6 text-brand-muted sm:grid-cols-1 lg:grid-cols-1"
        >
          <li v-for="commitment in WORK_COMMITMENTS" :key="commitment" class="flex gap-2">
            <Icon
              name="mdi:check-circle-outline"
              size="19"
              class="mt-0.5 shrink-0 text-brand-blue"
              aria-hidden="true"
            />
            <span>{{ commitment }}</span>
          </li>
        </ul>
      </div>
      <NuxtLink to="/como-trabajo" class="relative z-10 w-fit self-end">
        <Button
          theme="primary"
          size="md"
          class="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
        >
          Conoce cómo trabajo
        </Button>
      </NuxtLink>
    </div>
  </Section>
</template>
