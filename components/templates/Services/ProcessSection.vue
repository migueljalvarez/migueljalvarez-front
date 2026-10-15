<script lang="ts" setup>
  import { Section } from '~/components/organisms'
  import { DEVELOPMENT_PHASES, HOME_COPY } from '~/constants/common'
  import HowWorkTeaser from '~/components/templates/HowWork/HowWorkTeaser.vue'
  import PhaseMarker from './PhaseMarker.vue'

  const backgroundRef = ref<HTMLElement | null>(null)
  let sectionElement: HTMLElement | null = null
  let animationFrame: number | null = null

  const updateBackgroundPosition = () => {
    animationFrame = null
    if (!sectionElement || !backgroundRef.value) return

    const { top, height } = sectionElement.getBoundingClientRect()
    const progress = (window.innerHeight - top) / (window.innerHeight + height)
    const offset = (progress - 0.5) * 80
    backgroundRef.value.style.transform = `translate3d(0, ${offset}px, 0) scale(1.15)`
  }

  const handleScroll = () => {
    if (animationFrame !== null) return
    animationFrame = window.requestAnimationFrame(updateBackgroundPosition)
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    sectionElement = backgroundRef.value?.closest<HTMLElement>('#proceso') ?? null
    if (!sectionElement) return

    updateBackgroundPosition()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame)
    }
  })
</script>

<template>
  <Section
    id="proceso"
    aria-labelledby="process-heading"
    class="process-section relative isolate gap-8 overflow-hidden px-4 py-8 md:gap-10 md:py-12"
  >
    <div
      ref="backgroundRef"
      class="process-background pointer-events-none absolute inset-x-0 top-[-10%] bottom-[-10%] z-0"
      aria-hidden="true"
    />
    <div class="relative z-10 mx-auto w-full max-w-7xl">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-soft">
        {{ HOME_COPY.process.eyebrow }}
      </p>
      <div class="flex flex-col gap-4">
        <h2
          id="process-heading"
          class="max-w-5xl text-2xl font-semibold leading-tight text-brand-text-strong md:text-3xl"
        >
          {{ HOME_COPY.process.heading }}
        </h2>
        <div class="max-w-6xl">
          <p class="text-sm leading-6 text-brand-text-strong">
            {{ HOME_COPY.process.description }}
          </p>
        </div>
      </div>
    </div>

    <ol
      class="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
    >
      <li v-for="(phase, index) in DEVELOPMENT_PHASES" :key="phase.title" class="min-w-0">
        <article
          class="h-full rounded-2xl border border-brand-border-strong/70 bg-brand-surface-panel/95 p-5 text-brand-text-strong backdrop-blur-sm transition duration-200 hover:border-brand-blue/70 hover:bg-brand-surface-panel-strong focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-blue motion-reduce:transition-none md:p-6"
        >
          <div class="mb-4 flex items-center gap-3">
            <PhaseMarker :phase="index + 1" />
            <h3 class="text-base font-semibold text-brand-text-strong">{{ phase.title }}</h3>
          </div>

          <p class="text-sm leading-6 text-brand-text-subtle">{{ phase.description }}</p>
        </article>
      </li>
    </ol>

    <HowWorkTeaser />
  </Section>
</template>

<style scoped>
  .process-background {
    background-image:
      linear-gradient(
        color-mix(in srgb, var(--color-brand-project-overlay) 82%, transparent),
        color-mix(in srgb, var(--color-brand-project-overlay) 86%, transparent)
      ),
      url('/testimonial-bg.webp');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    will-change: transform;
  }

  @media (prefers-reduced-motion: reduce) {
    .process-background {
      will-change: auto;
    }
  }
</style>
