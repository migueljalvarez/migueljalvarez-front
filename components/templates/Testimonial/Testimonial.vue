<script lang="ts" setup>
  import type { TestimonialContent } from '~/types/common'

  type TestimonialSlide = {
    id: string
    author: string
    role: string
    quote: string
    image?: string
    profileType?: string
    company?: string
    context?: string
    socialLink?: string
    socialIcon?: string
  }

  const props = defineProps<{ testimonials: TestimonialContent[] }>()

  const slides = computed<TestimonialSlide[]>(() =>
    (props.testimonials ?? []).map(testimonial => ({
      id: `testimonial-${testimonial.id ?? testimonial.author}`,
      author: testimonial.author,
      role: testimonial.role,
      quote: testimonial.quote,
      image: testimonial.image,
      profileType: testimonial.profileType,
      company: testimonial.company,
      context: testimonial.context,
      socialLink: testimonial.socialLink,
      socialIcon: testimonial.socialIcon ?? 'mdi:account-circle-outline'
    }))
  )

  const activeIndex = ref(0)
  const visibleSlides = computed(() => slides.value.length)
  const trackTransform = computed(() => `translateX(-${activeIndex.value * 100}%)`)

  const getQuoteTextClass = (quote: string) => {
    const length = quote.length

    if (length > 220) return 'text-base md:text-lg xl:text-xl'
    if (length > 150) return 'text-lg md:text-xl xl:text-2xl'
    return 'text-xl md:text-2xl xl:text-[2rem]'
  }

  const goToSlide = (index: number) => {
    if (index < 0) {
      activeIndex.value = visibleSlides.value - 1
      return
    }

    if (index >= visibleSlides.value) {
      activeIndex.value = 0
      return
    }

    activeIndex.value = index
  }

  const nextSlide = () => {
    goToSlide(activeIndex.value + 1)
  }

  const prevSlide = () => {
    goToSlide(activeIndex.value - 1)
  }

  const sectionRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    if (!sectionRef.value) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            sectionRef.value?.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 }
    )

    observer.observe(sectionRef.value)
  })
</script>

<template>
  <section
    v-if="slides.length"
    id="testimonial"
    ref="sectionRef"
    class="reveal-section w-full bg-brand-surface-contrast px-4 py-12 md:py-16"
  >
    <div
      class="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[0.85fr_1.4fr] lg:gap-14"
    >
      <div class="max-w-md">
        <p class="text-xs font-semibold tracking-[0.12em] text-brand-text-soft uppercase">
          Testimonios
        </p>
        <h2 class="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          La confianza también es parte del trabajo
        </h2>
        <p class="mt-4 text-sm leading-6 text-brand-text-subtle md:text-base">
          Cada buen resultado empieza con una colaboración clara, cercana y enfocada en resolver el
          problema correcto.
        </p>

        <ul class="mt-6 space-y-4">
          <li class="flex items-start gap-3">
            <Icon name="mdi:target" size="19" class="mt-0.5 shrink-0 text-brand-blue" />
            <div>
              <p class="text-sm font-semibold text-white">Entender antes de construir</p>
              <p class="mt-1 text-xs leading-5 text-brand-text-subtle">
                Alinear objetivos, contexto y prioridades desde el inicio.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="mdi:forum-outline" size="19" class="mt-0.5 shrink-0 text-brand-blue" />
            <div>
              <p class="text-sm font-semibold text-white">Comunicación sin sorpresas</p>
              <p class="mt-1 text-xs leading-5 text-brand-text-subtle">
                Compartir avances y decisiones durante el proceso.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <Icon
              name="mdi:check-circle-outline"
              size="19"
              class="mt-0.5 shrink-0 text-brand-blue"
            />
            <div>
              <p class="text-sm font-semibold text-white">Soluciones con propósito</p>
              <p class="mt-1 text-xs leading-5 text-brand-text-subtle">
                Elegir lo que aporta valor y se puede mantener.
              </p>
            </div>
          </li>
        </ul>

        <NuxtLink
          to="#contact"
          class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-text-soft transition hover:text-white"
        >
          Hablemos de tu proyecto
          <Icon name="mdi:arrow-right" size="17" />
        </NuxtLink>
      </div>

      <div class="w-full max-w-3xl lg:justify-self-end">
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: trackTransform }"
          >
            <article v-for="slide in slides" :key="slide.id" class="min-w-full px-1 md:px-3">
              <div
                class="flex min-h-[260px] flex-col justify-between rounded-2xl border border-brand-border-strong/60 bg-brand-surface-panel-strong p-6 shadow-[0_16px_36px_rgba(3,5,7,0.18)] md:p-10"
              >
                <div class="space-y-4">
                  <span
                    class="inline-flex rounded-full border border-brand-border-strong bg-navy px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-brand-text-soft uppercase"
                  >
                    {{ slide.profileType || 'Perfil verificado' }}
                  </span>

                  <p
                    :class="[
                      'font-display font-medium italic leading-relaxed text-white',
                      getQuoteTextClass(slide.quote)
                    ]"
                  >
                    “{{ slide.quote }}”
                  </p>
                  <p v-if="slide.context" class="text-sm leading-6 text-brand-text-subtle">
                    {{ slide.context }}
                  </p>
                </div>

                <div
                  class="mt-8 flex items-center justify-between gap-4 border-t border-brand-border-strong pt-4"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-brand-accent text-sm font-semibold text-white"
                    >
                      <NuxtImg
                        v-if="slide.image"
                        :src="slide.image"
                        :alt="slide.author"
                        class="h-full w-full object-cover"
                      />
                      <span v-else class="text-xs uppercase">{{ slide.author.charAt(0) }}</span>
                    </div>

                    <div>
                      <p class="font-semibold text-white">{{ slide.author }}</p>
                      <p class="text-sm text-brand-text-subtle">
                        {{ slide.role }}
                        <span v-if="slide.company">· {{ slide.company }}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    v-if="slide.socialLink && slide.socialLink !== '#'"
                    :href="slide.socialLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border-strong bg-navy text-brand-text-soft transition-colors duration-300 hover:border-brand-accent hover:bg-brand-accent hover:text-white"
                    :aria-label="`Perfil de ${slide.author}`"
                  >
                    <Icon :name="slide.socialIcon || 'mdi:account-circle-outline'" size="18" />
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div
          v-if="slides.length > 1"
          class="mt-5 flex items-center justify-between gap-4 px-1 md:px-3"
        >
          <div class="flex items-center gap-2">
            <Button
              v-for="(_, index) in slides"
              :key="`dot-${index}`"
              type="button"
              theme="secondary"
              :aria-label="`Ir al slide ${index + 1}`"
              class="h-2.5 w-2.5 rounded-full border-0 p-0 shadow-none hover:bg-transparent"
              :class="[
                activeIndex === index
                  ? 'w-8 bg-brand-accent'
                  : 'bg-brand-helper/60 hover:bg-brand-accent'
              ]"
              @click="goToSlide(index)"
            />
          </div>

          <div class="flex items-center gap-3">
            <Button
              type="button"
              theme="secondary"
              aria-label="Slide anterior"
              class="h-10 w-10 rounded-full border border-brand-border-strong bg-navy px-0 text-lg text-brand-text-soft hover:bg-brand-accent hover:text-white"
              @click="prevSlide"
            >
              ‹
            </Button>
            <Button
              type="button"
              theme="secondary"
              aria-label="Siguiente slide"
              class="h-10 w-10 rounded-full border border-brand-border-strong bg-navy px-0 text-lg text-brand-text-soft hover:bg-brand-accent hover:text-white"
              @click="nextSlide"
            >
              ›
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .reveal-section {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }

  .reveal-section.is-visible {
    animation: testimonial-reveal 0.5s ease both;
  }

  @keyframes testimonial-reveal {
    0% {
      opacity: 0.35;
      transform: translateY(14px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
