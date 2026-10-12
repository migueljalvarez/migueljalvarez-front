<script setup lang="ts">
  import { ref } from 'vue'
  import { DEVELOPMENT_PHASES } from '~/constants/common'
  import type { ServiceOffering } from '~/data/services'
  import PhaseMarker from './PhaseMarker.vue'

  const { offering } = defineProps<{
    offering: ServiceOffering
  }>()

  const detailsDialog = ref<HTMLDialogElement | null>(null)

  const openDetails = () => detailsDialog.value?.showModal()
  const closeDetails = () => detailsDialog.value?.close()

  const closeOnBackdrop = (event: MouseEvent) => {
    if (event.target === event.currentTarget) closeDetails()
  }
</script>

<template>
  <article
    :id="offering.id"
    class="flex h-full flex-col rounded-2xl border border-brand-border bg-brand-surface-card p-5 text-brand-ink shadow-[0_8px_22px_var(--color-brand-shadow-card)] md:p-6"
  >
    <p class="min-h-10 text-sm font-normal leading-5 text-brand-muted">
      {{ offering.situacion }}
    </p>
    <h4 class="mt-2 text-lg font-semibold leading-snug text-brand-ink md:text-xl">
      {{ offering.titulo }}
    </h4>

    <p class="mt-3 text-sm leading-6 text-brand-muted">
      {{ offering.paraQuien }}
    </p>

    <div class="mt-auto border-t border-brand-border pt-3">
      <div class="mb-2 flex flex-wrap gap-2">
        <span
          v-for="tag in offering.etiquetas"
          :key="tag"
          class="rounded-md border border-brand-border bg-brand-surface-soft px-2.5 py-1 text-xs font-medium text-brand-muted"
        >
          {{ tag }}
        </span>
      </div>
      <button
        type="button"
        aria-haspopup="dialog"
        :aria-controls="`service-details-${offering.id}`"
        class="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 text-left font-semibold text-brand-accent-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
        @click="openDetails"
      >
        <span>Ver detalle</span>
        <Icon name="mdi:chevron-down" size="19" class="shrink-0 -rotate-90" aria-hidden="true" />
      </button>
    </div>

    <Teleport to="body">
      <dialog
        :id="`service-details-${offering.id}`"
        ref="detailsDialog"
        class="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-2xl border border-brand-border bg-brand-surface-card p-0 text-brand-ink shadow-[0_20px_60px_var(--color-brand-shadow-card)] backdrop:bg-brand-navy/70"
        :aria-labelledby="`service-details-title-${offering.id}`"
        @click="closeOnBackdrop"
        @cancel.prevent="closeDetails"
        @keydown.esc.prevent="closeDetails"
      >
        <div class="p-5 sm:p-7 md:p-8">
          <div class="flex items-start justify-between gap-5">
            <div class="min-w-0">
              <p class="mb-2 text-sm font-medium text-brand-muted">
                {{ offering.situacion }}
              </p>
              <h2
                :id="`service-details-title-${offering.id}`"
                class="max-w-3xl text-xl font-semibold leading-snug text-brand-ink sm:text-2xl"
              >
                {{ offering.titulo }}
              </h2>
            </div>
            <button
              type="button"
              class="flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-ink transition-colors hover:bg-brand-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              :aria-label="`Cerrar detalles de ${offering.situacion}`"
              @click="closeDetails"
            >
              <Icon name="mdi:close" size="20" aria-hidden="true" />
            </button>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <section
              v-for="detail in [
                { title: 'Para quién', text: offering.paraQuien },
                { title: 'Cómo ayudo', text: offering.comoAyudo },
                { title: 'Qué recibes', text: offering.queRecibes }
              ]"
              :key="detail.title"
              class="rounded-xl border border-brand-border bg-brand-surface-soft p-4 sm:p-5"
            >
              <h3 class="text-sm font-semibold text-brand-ink">{{ detail.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-brand-muted">{{ detail.text }}</p>
            </section>
          </div>

          <section class="mt-6 border-t border-brand-border pt-5">
            <h3 class="mb-3 text-sm font-semibold text-brand-muted">Fases aplicables</h3>
            <ol
              class="flex flex-wrap gap-2"
              :aria-label="`Fases aplicables: ${offering.situacion}`"
            >
              <li v-for="(phase, index) in DEVELOPMENT_PHASES" :key="phase.title">
                <PhaseMarker
                  :phase="index + 1"
                  :active="offering.fases.includes(index + 1)"
                  compact
                />
              </li>
            </ol>
          </section>
        </div>
      </dialog>
    </Teleport>
  </article>
</template>
