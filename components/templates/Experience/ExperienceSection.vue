<script setup lang="ts">
  import { Card } from '~/components/atoms'
  import { SectionHeader } from '~/components/molecules'
  import { Section } from '~/components/organisms'
  import { EXPERIENCE_CASES, EXPERIENCE_COPY } from '~/data/experience'
</script>

<template>
  <Section
    id="experience"
    class="gap-8 bg-brand-surface-card px-4 py-12 md:gap-10 md:py-16"
    aria-labelledby="experience-heading"
  >
    <div class="mx-auto w-full max-w-7xl">
      <SectionHeader
        :eyebrow="EXPERIENCE_COPY.eyebrow"
        :heading="EXPERIENCE_COPY.heading"
        :description="EXPERIENCE_COPY.description"
        heading-id="experience-heading"
      />

      <ul class="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
        <li v-for="item in EXPERIENCE_CASES" :key="item.id" class="flex">
          <Card tone="soft" class="w-full p-5 md:p-6">
            <h3 class="text-lg font-semibold text-brand-ink">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-brand-muted md:text-base md:leading-7">
              {{ item.text }}
            </p>
          </Card>
        </li>
      </ul>

      <p class="mt-6 flex flex-wrap items-center gap-x-3 text-sm md:text-base">
        <span class="text-brand-muted">{{ EXPERIENCE_COPY.prompt }}</span>
        <NuxtLink
          to="/como-cobro"
          class="inline-flex min-h-11 items-center font-semibold text-brand-blue underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          {{ EXPERIENCE_COPY.cta }}
        </NuxtLink>
      </p>
    </div>
  </Section>
</template>
