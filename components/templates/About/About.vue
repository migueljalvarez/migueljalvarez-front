<script lang="ts" setup>
  import Button from '~/components/atoms/Button/Button.vue'
  import { HOME_COPY, PRIMARY_CTA_LABEL } from '~/constants/common'

  const sectionRef = ref<HTMLElement | null>(null)
  const highlights = HOME_COPY.about.highlights
  const counters = ref([0, 0])
  let counterObserver: IntersectionObserver | undefined
  let animationFrame: number | null = null

  const setFinalCounters = () => {
    counters.value = [10, 4]
  }

  onMounted(() => {
    const section = sectionRef.value
    if (!section) return

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      setFinalCounters()
      return
    }

    counterObserver = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return

        counterObserver?.disconnect()
        const startedAt = performance.now()

        const updateCounters = (now: number) => {
          const progress = Math.min((now - startedAt) / 900, 1)
          const easedProgress = 1 - (1 - progress) ** 3
          counters.value = [Math.floor(10 * easedProgress), Math.floor(4 * easedProgress)]

          if (progress < 1) {
            animationFrame = window.requestAnimationFrame(updateCounters)
          } else {
            setFinalCounters()
            animationFrame = null
          }
        }

        animationFrame = window.requestAnimationFrame(updateCounters)
      },
      { threshold: 0.16 }
    )

    counterObserver.observe(section)
  })

  onBeforeUnmount(() => {
    counterObserver?.disconnect()
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
  })
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="w-full bg-brand-surface px-4 py-12 text-brand-ink dark:bg-brand-surface-contrast dark:text-brand-text-strong md:py-16"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 md:gap-10">
      <div class="about-intro-layout grid min-w-0 items-stretch">
        <div class="about-photo group/photo relative min-w-0">
          <div
            class="about-photo-frame absolute overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-card p-2 shadow-[0_8px_22px_var(--color-brand-shadow-card)] dark:border-brand-border-strong dark:bg-brand-surface-panel"
          >
            <NuxtImg
              src="ma.webp"
              alt="Miguel Álvarez, ingeniero de sistemas, trabajando en remoto"
              width="600"
              sizes="100vw sm:544px lg:460px"
              format="webp"
              loading="lazy"
              class="h-full w-full rounded-xl object-cover object-center"
            />
          </div>

          <div
            class="absolute bottom-0 right-0 z-20 flex translate-x-2 translate-y-2 items-center gap-3 rounded-full border border-brand-blue/30 bg-brand-surface-card/95 px-4 py-2 shadow-[0_8px_22px_var(--color-brand-shadow-card)] dark:border-brand-blue/40 dark:bg-brand-surface-panel/95"
          >
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 dark:bg-brand-blue/20"
              aria-hidden="true"
            >
              <Icon
                name="mdi:map-marker"
                size="20"
                class="text-brand-blue dark:text-brand-text-soft"
              />
            </span>
            <div class="leading-tight">
              <p class="text-xs font-semibold text-brand-ink dark:text-brand-text-strong">
                {{ HOME_COPY.about.location }}
              </p>
              <p class="text-[11px] text-brand-muted dark:text-brand-text-subtle">
                {{ HOME_COPY.about.remote }}
              </p>
            </div>
          </div>
        </div>

        <div class="relative z-10 flex min-w-0 flex-col justify-center gap-5 py-2 md:gap-6">
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent-text dark:text-brand-text-soft"
            >
              {{ HOME_COPY.about.eyebrow }}
            </p>
            <h2 class="text-3xl font-semibold leading-tight md:text-4xl">
              {{ HOME_COPY.about.heading }}
            </h2>
          </div>

          <p
            class="text-sm leading-6 text-brand-muted dark:text-brand-text-subtle md:text-base md:leading-7"
          >
            Hola, soy
            <strong class="text-brand-ink dark:text-brand-text-strong">Miguel</strong>
            , ingeniero de sistemas. Me dedico al desarrollo de software, partiendo de la necesidad
            inicial y preparando el camino para crecer en el futuro. Trabajo con pasión por lo que
            hago.
          </p>

          <div class="about-highlights-grid grid w-full gap-3">
            <article
              v-for="(item, index) in highlights"
              :key="item.label"
              class="flex min-w-0 flex-col justify-center rounded-xl border border-brand-border bg-brand-surface-soft px-4 py-3 dark:border-brand-border-strong dark:bg-brand-surface-panel"
            >
              <p
                class="text-xl font-bold leading-tight text-brand-ink dark:text-brand-text-strong md:text-2xl"
              >
                <template v-if="index === 0">{{ counters[0] }}+</template>
                <template v-else-if="index === 1">{{ counters[1] }}</template>
                <template v-else>{{ item.value }}</template>
              </p>
              <p class="mt-1 text-xs leading-5 text-brand-muted dark:text-brand-text-subtle">
                {{ item.label }}
              </p>
            </article>
          </div>
        </div>
      </div>

      <div class="about-story-layout grid">
        <article
          class="rounded-2xl border border-brand-border bg-brand-surface-card p-6 shadow-[0_8px_22px_var(--color-brand-shadow-card)] dark:border-brand-border-strong dark:bg-brand-surface-panel md:p-8"
        >
          <span
            class="mb-4 flex size-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface-soft dark:border-brand-border-strong dark:bg-brand-surface-contrast"
            aria-hidden="true"
          >
            <Icon
              name="mdi:code-tags"
              size="20"
              class="text-brand-accent-text dark:text-brand-text-soft"
            />
          </span>
          <p
            class="text-sm leading-6 text-brand-muted dark:text-brand-text-subtle md:text-base md:leading-7"
          >
            He colaborado con equipos internacionales de habla hispana en proyectos de IoT,
            LegalTech, outsourcing y consultoría, e identidad digital. Pasar por sectores tan
            distintos me ha permitido conocer
            <strong
              class="rounded-sm bg-brand-blue/10 px-1 text-brand-accent-text dark:bg-brand-blue/20 dark:text-brand-text-soft"
            >
              los errores que casi nadie nota hasta que ya duelen
            </strong>
            .
          </p>
          <blockquote
            class="mt-5 border-l-2 border-brand-border-strong bg-brand-surface-soft px-4 py-3 text-sm leading-6 text-brand-muted dark:border-brand-blue dark:bg-brand-surface-contrast dark:text-brand-text-subtle md:px-5 md:py-4 md:text-base md:leading-7"
          >
            Por ejemplo, no dimensionar ni proyectar a futuro un proyecto lleva a mala
            planificación, reprocesos y módulos que nadie entiende por separado.
          </blockquote>
        </article>

        <article
          class="rounded-2xl border border-brand-border bg-brand-surface-card p-6 shadow-[0_8px_22px_var(--color-brand-shadow-card)] dark:border-brand-border-strong dark:bg-brand-surface-panel md:p-8"
        >
          <span
            class="mb-4 flex size-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface-soft dark:border-brand-border-strong dark:bg-brand-surface-contrast"
            aria-hidden="true"
          >
            <Icon
              name="mdi:coffee"
              size="20"
              class="text-brand-accent-text dark:text-brand-text-soft"
            />
          </span>
          <p
            class="text-sm leading-6 text-brand-muted dark:text-brand-text-subtle md:text-base md:leading-7"
          >
            Soy una persona
            <strong class="text-brand-ink dark:text-brand-text-strong">relajada y tranquila</strong>
            , apasionado de la tecnología y la cultura geek. Me gusta salir a caminar y olvidarme un
            poco de las cosas, los días de pizza, las salidas con amigos y compartir siempre un buen
            café. También relajarme viendo películas y series, y estar siempre buscando algo nuevo
            que aprender.
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .about-intro-layout,
  .about-story-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }

  .about-photo {
    min-height: 20rem;
  }

  .about-photo-frame {
    inset: 0.5rem;
    overflow: hidden;
  }

  .about-highlights-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .about-life-label {
    transition: transform 200ms ease;
  }

  .about-life-label--coffee {
    transform: rotate(-6deg);
  }

  .about-life-label--pizza {
    transform: translateY(-50%) rotate(3deg);
  }

  .about-life-label--walk {
    transform: rotate(3deg);
  }

  @media (max-width: 39.999rem) {
    .about-photo > .absolute.z-20 {
      right: 0.75rem;
      bottom: 0.75rem;
      transform: translateY(50%);
    }
  }

  .about-photo:hover .about-life-label {
    transform: rotate(0);
  }

  .about-photo:hover .about-life-label--pizza {
    transform: translateY(-50%) rotate(0);
  }

  .about-story-layout {
    gap: 1rem;
  }

  @media (min-width: 40rem) {
    .about-highlights-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (min-width: 64rem) {
    .about-intro-layout {
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
      gap: 3rem;
    }

    .about-photo {
      min-height: 0;
    }

    .about-story-layout {
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
      gap: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .about-life-label {
      transition: none;
    }
  }
</style>
