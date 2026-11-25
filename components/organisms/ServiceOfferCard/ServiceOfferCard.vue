<script lang="ts" setup>
  import { computed } from 'vue'
  import { Card, Chip } from '~/components/atoms'
  import { CheckList } from '~/components/molecules'
  import { describeOfferPrice } from '~/utils/pricing'
  import type { ServiceOfferCardProps } from '../organism'

  // Oferta con su precio «desde». El precio de lanzamiento solo existe mientras el panel lo tenga activo.
  const props = defineProps<ServiceOfferCardProps>()

  const price = computed(() => describeOfferPrice(props.offer))
</script>

<template>
  <Card as="article" elevated class="flex h-full flex-col p-5 md:p-6">
    <h3 class="text-xl leading-tight font-semibold text-brand-ink">{{ offer.title }}</h3>
    <p class="mt-3 text-sm leading-6 text-brand-muted md:text-base md:leading-7">
      {{ offer.summary }}
    </p>

    <CheckList v-if="offer.includes.length" :items="offer.includes" class="mt-4" />

    <p v-if="offer.duration" class="mt-4 text-sm text-brand-muted">{{ offer.duration }}</p>

    <div class="mt-auto border-t border-brand-border pt-4">
      <p class="sr-only">{{ price.label }}</p>
      <div aria-hidden="true">
        <template v-if="price.regular">
          <p class="flex flex-wrap items-baseline gap-x-1.5 text-sm text-brand-muted">
            <span>{{ price.launch ? 'Precio normal desde' : 'Desde' }}</span>
            <s v-if="price.launch" class="tabular-nums">{{ price.regular }}</s>
            <span v-else class="text-2xl font-semibold text-brand-ink tabular-nums">
              {{ price.regular }}
            </span>
          </p>
          <p v-if="price.launch" class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span class="text-2xl font-semibold text-brand-ink tabular-nums">
              Desde {{ price.launch }}
            </span>
            <Chip v-if="offer.launchNote" tone="brand" size="sm" pill>{{ offer.launchNote }}</Chip>
          </p>
        </template>
        <p v-else class="text-base font-medium text-brand-ink">{{ unpricedLabel }}</p>
      </div>
    </div>
  </Card>
</template>
