<script lang="ts" setup>
  import { Heading } from '~/components/atoms'
  import type { SectionProps } from '../organism'

  const props = withDefaults(defineProps<SectionProps>(), {
    title: ''
  })

  const sectionRef = ref<HTMLElement | null>(null)
  useSectionReveal(sectionRef)

  const sectionClass = computed(() => ({
    'text-brand-ink': props.background === 'bg-white' && !props.backgroundImage,
    'text-brand-white': !!props.backgroundImage,
    [props.background || '']: true
  }))

  const backgroundStyle = computed(() => {
    if (!props.backgroundImage) return {}
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }
  })
</script>

<template>
  <section
    :id="id"
    ref="sectionRef"
    :class="['reveal-section w-full h-auto', sectionClass]"
    :style="backgroundStyle"
  >
    <div class="flex flex-col items-center w-full gap-6">
      <Heading v-if="title" level="h2">{{ title }}</Heading>
      <slot />
    </div>
  </section>
</template>

<style scoped>
  .reveal-section.is-reveal-pending {
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }

  .reveal-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal-section.is-reveal-pending,
    .reveal-section {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
