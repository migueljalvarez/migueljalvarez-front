<script lang="ts" setup>
  import Button from '~/components/atoms/Button/Button.vue'
  import HeroCurve from '~/components/atoms/Hero/HeroCurve.vue'
  import Title from '~/components/atoms/Title/Title.vue'

  import { MAIN_TITLE_PRESENTATION, MAIN_TITLE_PRESENTATION_COMPLEMENT } from '~/constants/common'
  import type { Me } from '~/types/common'

  const name = ref('')
  const subtitle = ref('Desarrollador backend/full-stack independiente')

  const showWave = ref(false)
  const props = defineProps<{ me: Me | null }>()
  let waveTimeout: ReturnType<typeof setTimeout> | null = null

  onMounted(async () => {
    if (props.me) {
      name.value = props.me.name
      // TODO: volver a conectar a datos reales cuando se migre a Supabase — por ahora hardcodeado
      // fullDescription.value = props.me.jobDescription || ''
      waveTimeout = setTimeout(() => {
        showWave.value = true
      }, 500)
    }
  })

  onUnmounted(() => {
    if (waveTimeout) {
      clearTimeout(waveTimeout)
    }
  })
</script>
<template>
  <section
    class="hero-section relative -mt-20 flex min-h-[620px] w-full items-center overflow-hidden bg-cover bg-[position:58%_center] pt-32 pb-[72px] text-brand-text-strong md:min-h-[680px] md:pt-36 md:pb-24"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <div
        class="main-content relative z-20 flex w-full max-w-2xl flex-col justify-center gap-2 text-brand-text-strong lg:w-1/2 lg:py-6"
      >
        <h1
          class="mb-4 max-w-full text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.05em] text-brand-text-strong"
        >
          <span class="block break-words">
            {{ MAIN_TITLE_PRESENTATION }}
            <Transition name="wave-fade">
              <NuxtImg
                v-if="showWave"
                src="/waving.webp"
                alt="👋"
                width="32"
                height="32"
                aria-label="saludo"
                class="wave-animation inline-flex h-7 w-7 translate-y-0.5 items-center justify-center sm:h-9 sm:w-9"
                draggable="false"
                loading="lazy"
              />
            </Transition>
            ,
          </span>
          <span class="block break-words">
            {{ `${MAIN_TITLE_PRESENTATION_COMPLEMENT} ${name}!` }}
          </span>
        </h1>

        <Title
          :text="subtitle"
          variant="h2"
          class="hero-subtitle justify-start p-1 leading-[1.15]"
        />
        <p class="max-w-[60ch] text-base font-normal leading-7 text-brand-text-strong/85">
          Convierto ideas en sitios web, sistemas y MVPs que tu negocio puede sostener — no solo
          lanzar. Antes de escribir código, entiendo bien el problema que hay detrás.
        </p>

        <div class="mt-4 grid w-full gap-2 sm:grid-cols-2">
          <NuxtLink to="https://wa.link/bxjfgq" target="_blank" class="w-full">
            <Button
              class="h-full w-full whitespace-nowrap"
              size="lg"
              icon="mdi:whatsapp"
              icon-position="left"
              theme="tertiary"
            >
              Hablemos de tu proyecto
            </Button>
          </NuxtLink>

          <NuxtLink to="#portfolio" class="w-full">
            <Button
              class="h-full w-full whitespace-nowrap border-brand-white/60 text-brand-text-strong hover:bg-brand-white/10 hover:text-brand-text-strong"
              size="lg"
              theme="secondary"
            >
              Ver portafolio
            </Button>
          </NuxtLink>
        </div>

        <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-[13px]">
          <span class="font-semibold text-brand-text-strong">9+ años de experiencia</span>
          <span class="text-brand-text-strong/85">·</span>
          <span class="text-brand-text-strong/85">Desarrollo full-stack: backend y frontend</span>
          <span class="text-brand-text-strong/85">·</span>
          <span class="text-brand-text-strong/85">Medellín, Colombia</span>
        </div>
      </div>

      <a
        href="#portfolio"
        class="relative z-30 mt-2 inline-flex items-center gap-2 self-start rounded-full
        border border-brand-white/25 bg-brand-surface-contrast/75 px-3 py-1.5 text-xs
        font-medium text-brand-text-strong shadow-lg backdrop-blur-sm transition-colors duration-200
        hover:bg-brand-surface-contrast focus-visible:outline-2 focus-visible:outline-offset-4
        focus-visible:outline-brand-blue sm:absolute sm:bottom-12 sm:right-8 sm:mt-0 md:bottom-16
        lg:right-[max(2rem,calc((100vw-80rem)/2))]"
      >
        <span class="font-semibold">Caso real:</span>
        <span>Tu Radio AR Stereo</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>
    <HeroCurve />
  </section>
</template>
<style scoped>
  .hero-section {
    background-image:
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--color-brand-surface-contrast) 94%, transparent) 0%,
        color-mix(in srgb, var(--color-brand-surface-contrast) 80%, transparent) 43%,
        color-mix(in srgb, var(--color-brand-surface-contrast) 25%, transparent) 100%
      ),
      url('/bg.webp');
  }

  .hero-subtitle :deep(h2) {
    color: var(--color-brand-text-strong);
  }

  .main-content {
    animation: slide-in-up 0.6s ease both;
  }

  @keyframes slide-in-up {
    from {
      opacity: 0;
      transform: translateX(-24px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Saludo animado */
  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .wave-animation {
    display: inline-block;
    transform-origin: 70% 70%;
    animation: wave 2s ease-in-out infinite;
  }

  /* Transición opcional */
  .wave-fade-enter-active {
    transition: opacity 0.4s ease;
  }
  .wave-fade-enter-from {
    opacity: 0;
  }

  .fade-up-enter-active {
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }
  .fade-up-enter-from {
    opacity: 0;
    transform: translateY(30px);
  }
  .fade-up-enter-to {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .main-content,
    .wave-animation {
      animation: none;
    }

    .wave-fade-enter-active,
    .fade-up-enter-active {
      transition: none;
    }
  }

  @media (max-width: 639px) {
    .hero-section {
      background-position: 63% center;
      background-image:
        linear-gradient(
          90deg,
          color-mix(in srgb, var(--color-brand-surface-contrast) 90%, transparent) 0%,
          color-mix(in srgb, var(--color-brand-surface-contrast) 72%, transparent) 100%
        ),
        url('/bg.webp');
    }
  }
</style>
