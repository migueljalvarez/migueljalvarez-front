<script lang="ts" setup>
  import Button from '~/components/atoms/Button/Button.vue'
  import HeroCurve from '~/components/atoms/Hero/HeroCurve.vue'
  import Title from '~/components/atoms/Title/Title.vue'

  const subtitle = 'Desarrollo de Software y Soluciones Digitales'
</script>
<template>
  <section
    class="hero-section relative -mt-20 flex min-h-[620px] w-full items-center overflow-hidden bg-cover bg-[position:58%_center] pt-24 pb-[72px] text-brand-text-strong sm:pt-20 md:min-h-[680px] md:pb-24"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <div
        class="main-content relative z-20 flex w-full max-w-2xl flex-col justify-center gap-2 text-brand-text-strong lg:w-1/2 lg:py-6"
      >
        <p
          class="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-brand-surface-contrast/80 px-4 py-2 text-xs font-semibold text-brand-text-soft shadow-sm"
        >
          <span
            class="availability-indicator size-2.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          Disponible para nuevos proyectos &amp; consultoría técnica
        </p>
        <h1
          class="mb-4 max-w-full text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.05em] text-brand-text-strong"
        >
          <span class="block break-words">
            Tus ideas merecen convertirse en grandes soluciones.
          </span>
        </h1>

        <Title
          :text="subtitle"
          variant="h2"
          class="hero-subtitle justify-start p-1 leading-[1.15]"
        />
        <p class="max-w-[60ch] text-base font-normal leading-7 text-brand-text-strong/85">
          Soy Miguel, ingeniero de sistemas con más de 9 años de experiencia desarrollando software.
          Ayudo a emprendedores y empresas a transformar sus ideas y necesidades en soluciones
          digitales funcionales, escalables y pensadas para crecer.
        </p>

        <div class="mt-4 flex w-full gap-2 items-center sm:mt-6 sm:gap-4">
          <Button
            as="a"
            href="https://wa.link/bxjfgq"
            target="_blank"
            rel="noopener noreferrer"
            class="whitespace-nowrap bg-brand-whatsapp text-brand-white hover:bg-brand-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white"
            size="md"
            icon="mdi:whatsapp"
            icon-position="left"
            theme="tertiary"
          >
            Hablemos de tu proyecto
          </Button>

          <Button
            as="a"
            href="#portfolio"
            class="whitespace-nowrap border-brand-white/60 text-brand-text-strong hover:bg-brand-white/10 hover:text-brand-text-strong"
            size="md"
            theme="secondary"
          >
            Ver portafolio
          </Button>
        </div>
      </div>
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

  .availability-indicator {
    animation: availability-pulse 1.8s ease-out infinite;
  }

  @keyframes availability-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgb(16 185 129 / 55%);
    }
    55% {
      box-shadow: 0 0 0 5px rgb(16 185 129 / 0%);
    }
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

  @media (prefers-reduced-motion: reduce) {
    .main-content,
    .availability-indicator {
      animation: none;
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
