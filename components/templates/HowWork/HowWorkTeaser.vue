<script setup lang="ts">
  import Button from '~/components/atoms/Button/Button.vue'
  import { WORK_COMMITMENTS } from '~/data/work'
</script>

<template>
  <section
    aria-labelledby="work-teaser-heading"
    class="relative z-10 mx-auto w-full max-w-7xl border-t border-brand-border-strong/70 pt-8"
  >
    <div
      class="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-brand-border-strong/70 bg-brand-surface-panel/95 p-6 text-brand-text-strong shadow-[0_8px_22px_var(--color-brand-shadow-card)] md:p-8"
    >
      <NuxtImg
        src="only-brand-color.svg"
        width="256"
        height="256"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute -right-20 -bottom-10 z-0 size-64 select-none opacity-[0.08]"
      />
      <div class="relative z-10">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-soft">
          Cómo trabajo
        </p>
        <h3
          id="work-teaser-heading"
          class="text-2xl font-semibold leading-tight text-brand-text-strong md:text-3xl"
        >
          Acuerdos claros para construir con confianza
        </h3>
        <ul class="mt-5 flex flex-col gap-3 text-sm leading-6 text-brand-text-subtle">
          <li
            v-for="commitment in WORK_COMMITMENTS.slice(0, 3)"
            :key="commitment"
            class="flex gap-2"
          >
            <Icon
              name="mdi:check-circle-outline"
              size="19"
              class="mt-0.5 shrink-0 text-brand-blue"
              aria-hidden="true"
            />
            <span>{{ commitment }}</span>
          </li>
        </ul>
        <div class="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <NuxtLink v-slot="{ href, navigate }" to="/como-trabajo" custom>
            <Button
              as="a"
              :href="href!"
              theme="primary"
              size="md"
              class="w-fit focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white"
              @click="navigate"
            >
              Ver cómo trabajo
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
