<script setup lang="ts">
  import { Card } from '~/components/atoms'
  import { CheckList, SectionHeader } from '~/components/molecules'
  import { Section } from '~/components/organisms'
  import { WORK_FAQ, WORK_NON_NEGOTIABLES, WORK_COMMITMENTS } from '~/data/work'
  import type { PolicyBlock } from '~/utils/publicContent'

  /** Acuerdos de trabajo (API con respaldo en el código); el resto del copy es identidad de marca. */
  defineProps<{ policies: PolicyBlock[] }>()
</script>

<template>
  <Section id="como-trabajo" class="gap-8 bg-brand-surface px-4 py-12 md:gap-10 md:py-16">
    <div class="mx-auto w-full max-w-7xl">
      <SectionHeader
        eyebrow="Cómo trabajo"
        heading="Acuerdos claros para construir con confianza"
        description="Una colaboración funciona mejor cuando sabemos qué esperar, cómo tomamos decisiones y qué pasa después de entregar."
        level="h1"
        size="lg"
        class="max-w-3xl"
      />
    </div>

    <div class="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-2">
      <Card as="article" elevated class="p-6">
        <h2 class="text-xl font-semibold text-brand-ink">Me comprometo a</h2>
        <CheckList :items="WORK_COMMITMENTS" class="mt-4" />
      </Card>
      <Card id="no-acepto" as="article" elevated class="p-6">
        <h2 class="text-xl font-semibold text-brand-ink">Lo que no hago</h2>
        <CheckList
          :items="WORK_NON_NEGOTIABLES.map(item => ({ text: item.texto, note: item.nota }))"
          icon="mdi:minus-circle-outline"
          icon-class="text-brand-accent-text"
          class="mt-4"
        />
      </Card>
    </div>

    <div class="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-3">
      <Card v-for="block in policies" :key="block.id" as="article" elevated class="p-5 md:p-6">
        <h2 class="text-lg font-semibold text-brand-ink">{{ block.title }}</h2>
        <p class="mt-3 text-sm leading-6 text-brand-muted">{{ block.body }}</p>
      </Card>
    </div>

    <div class="mx-auto w-full max-w-7xl">
      <h2 class="text-2xl font-semibold text-brand-ink">Preguntas frecuentes</h2>
      <div class="mt-5 space-y-3">
        <Card
          v-for="item in WORK_FAQ"
          :key="item.pregunta"
          as="details"
          tone="light"
          class="group rounded-xl px-5 py-4"
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
        </Card>
      </div>
    </div>
  </Section>
</template>
