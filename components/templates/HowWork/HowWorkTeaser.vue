<script setup lang="ts">
  import { Button, Card } from '~/components/atoms'
  import { CheckList, SectionHeader } from '~/components/molecules'
  import { WORK_COMMITMENTS } from '~/data/work'
  import { HOME_COPY } from '~/constants/common'
</script>

<template>
  <section
    aria-labelledby="work-teaser-heading"
    class="relative z-10 mx-auto w-full max-w-7xl border-t border-brand-border-strong/70 pt-8"
  >
    <Card
      tone="dark"
      class="relative flex flex-col gap-5 overflow-hidden bg-brand-surface-panel/95 p-6 md:p-8"
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
        <SectionHeader
          :eyebrow="HOME_COPY.work.eyebrow"
          :heading="HOME_COPY.work.heading"
          heading-id="work-teaser-heading"
          level="h3"
          tone="dark"
        />
        <CheckList :items="WORK_COMMITMENTS.slice(0, 3)" tone="dark" class="mt-5" />
        <div class="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button to="/como-trabajo" theme="primary" size="md" on-dark class="w-fit">
            {{ HOME_COPY.work.cta }}
          </Button>
        </div>
      </div>
    </Card>
  </section>
</template>
