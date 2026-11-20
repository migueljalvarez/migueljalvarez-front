<script setup lang="ts">
  import { ref } from 'vue'
  import { DEVELOPMENT_PHASES, HOME_COPY } from '~/constants/common'
  import type { ServiceCardProps } from '../organism'
  import { Card, Chip, HexMarker } from '~/components/atoms'

  const { offering } = defineProps<ServiceCardProps>()

  const phaseNumber = (phase: number) => String(phase).padStart(2, '0')

  const detailsDialog = ref<HTMLDialogElement | null>(null)

  const openDetails = () => detailsDialog.value?.showModal()
  const closeDetails = () => detailsDialog.value?.close()

  const closeOnBackdrop = (event: MouseEvent) => {
    if (event.target === event.currentTarget) closeDetails()
  }
</script>

<template>
  <Card
    :id="offering.id"
    as="article"
    class="flex h-full flex-col p-5 transition-shadow hover:shadow-card motion-reduce:transition-none md:p-6"
  >
    <p class="min-h-10 text-sm font-normal leading-5 text-brand-muted">
      {{ offering.situation }}
    </p>
    <h4 class="mt-2 text-lg font-semibold leading-snug text-brand-ink md:text-xl">
      {{ offering.title }}
    </h4>

    <p class="mt-3 mb-4 text-sm leading-6 text-brand-muted">
      {{ offering.audience }}
    </p>

    <div class="mt-auto border-t border-brand-border pt-3">
      <div class="mb-2 flex flex-wrap gap-2">
        <Chip v-for="tag in offering.tags" :key="tag">{{ tag }}</Chip>
      </div>
      <button
        type="button"
        aria-haspopup="dialog"
        :aria-controls="`service-details-${offering.id}`"
        class="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 text-left font-semibold text-brand-accent-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
        @click="openDetails"
      >
        <span>{{ HOME_COPY.services.detailsCta }}</span>
        <Icon name="mdi:chevron-down" size="19" class="shrink-0 -rotate-90" aria-hidden="true" />
      </button>
    </div>

    <!-- Al destino de teleports de Nuxt (al final del HTML): con «body» las ventanas salían ANTES del h1 en el código fuente. -->
    <Teleport to="#teleports">
      <dialog
        :id="`service-details-${offering.id}`"
        ref="detailsDialog"
        class="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-2xl border border-brand-border bg-brand-surface-card p-0 text-brand-ink shadow-dialog backdrop:bg-brand-navy/70"
        :aria-labelledby="`service-details-title-${offering.id}`"
        @click="closeOnBackdrop"
        @cancel.prevent="closeDetails"
        @keydown.esc.prevent="closeDetails"
      >
        <div class="p-5 sm:p-7 md:p-8">
          <div class="flex items-start justify-between gap-5">
            <div class="min-w-0">
              <p class="mb-2 text-sm font-medium text-brand-muted">
                {{ offering.situation }}
              </p>
              <h2
                :id="`service-details-title-${offering.id}`"
                class="max-w-3xl text-xl font-semibold leading-snug text-brand-ink sm:text-2xl"
              >
                {{ offering.title }}
              </h2>
            </div>
            <button
              type="button"
              class="flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-ink transition-colors hover:bg-brand-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              :aria-label="`Cerrar detalles de ${offering.situation}`"
              @click="closeDetails"
            >
              <Icon name="mdi:close" size="20" aria-hidden="true" />
            </button>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <Card
              v-for="detail in [
                { title: HOME_COPY.services.detailLabels.audience, text: offering.audience },
                { title: HOME_COPY.services.detailLabels.approach, text: offering.approach },
                { title: HOME_COPY.services.detailLabels.deliverables, text: offering.deliverables }
              ]"
              :key="detail.title"
              tone="soft"
              as="section"
              class="p-4 sm:p-5"
            >
              <h3 class="text-sm font-semibold text-brand-ink">{{ detail.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-brand-muted">{{ detail.text }}</p>
            </Card>
          </div>

          <section class="mt-6 border-t border-brand-border pt-5">
            <h3 class="mb-3 text-sm font-semibold text-brand-muted">
              {{ HOME_COPY.services.detailLabels.phases }}
            </h3>
            <ol
              class="grid gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-3"
              :aria-label="`Fases aplicables: ${offering.situation}`"
            >
              <li
                v-for="(phase, index) in DEVELOPMENT_PHASES"
                :key="phase.title"
                class="flex items-center gap-3"
              >
                <!-- El marcador es decorativo: el nombre visible y el texto para lectores dicen la fase y si aplica. -->
                <HexMarker
                  :label="phaseNumber(index + 1)"
                  :active="offering.phases.includes(index + 1)"
                  compact
                />
                <span
                  class="text-sm leading-5"
                  :class="
                    offering.phases.includes(index + 1)
                      ? 'font-medium text-brand-ink'
                      : 'text-brand-muted'
                  "
                >
                  {{ phase.title }}
                  <span class="sr-only">
                    {{ offering.phases.includes(index + 1) ? ', incluida' : ', no incluida' }}
                  </span>
                </span>
              </li>
            </ol>
          </section>

          <section v-if="offering.guide" class="mt-6 border-t border-brand-border pt-5">
            <h3 class="mb-1 text-sm font-semibold text-brand-muted">Guía relacionada</h3>
            <NuxtLink
              :to="offering.guide.to"
              class="inline-flex min-h-11 items-center text-base font-medium text-logo-blue underline underline-offset-4 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
              @click="closeDetails"
            >
              {{ offering.guide.label }}
            </NuxtLink>
          </section>
        </div>
      </dialog>
    </Teleport>
  </Card>
</template>
