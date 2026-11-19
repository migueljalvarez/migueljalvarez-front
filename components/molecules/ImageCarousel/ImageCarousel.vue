<script lang="ts" setup>
  import type { ImageCarouselProps } from '../molecule'
  import ImageWithFallback from '../ImageWithFallback/ImageWithFallback.vue'

  // Carrusel de 1 a 4 imágenes, sin autoplay. Sin imágenes (o si una falla) muestra el placeholder de marca. Cada diapositiva reserva su proporción (4:3), así que nada
  // salta al cargar. Con una sola imagen no hay flechas ni puntos. Accesible: región con descripción de
  // carrusel, botones con nombre, objetivos de 44 px, flechas del teclado, anuncio de posición para lector
  // de pantalla y diapositivas inactivas ocultas (`inert`). El slot `overlay` pinta lo que va sobre la foto.
  const props = defineProps<ImageCarouselProps>()

  const MAX_IMAGES = 4
  // Sin imágenes se reserva una diapositiva con el placeholder (el marco no desaparece ni cambia de alto).
  const shown = computed(() =>
    props.images.length ? props.images.slice(0, MAX_IMAGES) : [{ src: '', alt: '' }]
  )
  const total = computed(() => shown.value.length)
  const current = ref(0)
  const multiple = computed(() => total.value > 1)

  const go = (index: number) => {
    current.value = (index + total.value) % total.value
  }
  const onKeydown = (event: KeyboardEvent) => {
    if (!multiple.value) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(current.value - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(current.value + 1)
    }
  }

  // Si cambian las imágenes (vista previa del panel) y la posición queda fuera de rango, vuelve al inicio.
  watch(total, () => {
    if (current.value >= total.value) current.value = 0
  })

  const control =
    'inline-flex size-11 items-center justify-center rounded-full bg-brand-surface-card/90 text-brand-ink transition-colors duration-200 hover:bg-brand-surface-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue'
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-soft"
    role="region"
    aria-roledescription="carrusel"
    aria-label="Fotos"
    @keydown="onKeydown"
  >
    <div
      class="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <figure
        v-for="(image, index) in shown"
        :key="`${index}-${image.src}`"
        class="relative m-0 aspect-16/10 w-full shrink-0"
        role="group"
        aria-roledescription="diapositiva"
        :aria-label="`${index + 1} de ${total}`"
        :aria-hidden="index === current ? undefined : 'true'"
        :inert="index !== current"
      >
        <ImageWithFallback
          :src="image.src"
          :alt="image.alt"
          :width="960"
          sizes="100vw lg:560px"
          image-class="object-cover object-[50%_30%]"
          class="absolute inset-0"
        />
      </figure>
    </div>

    <div class="pointer-events-none absolute inset-x-0 top-0 p-3 @lg:p-4">
      <slot name="overlay" />
    </div>

    <template v-if="multiple">
      <button
        type="button"
        class="absolute top-1/2 left-2 -translate-y-1/2 @lg:left-3"
        :class="control"
        aria-label="Foto anterior"
        @click="go(current - 1)"
      >
        <Icon name="mdi:chevron-left" size="24" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="absolute top-1/2 right-2 -translate-y-1/2 @lg:right-3"
        :class="control"
        aria-label="Foto siguiente"
        @click="go(current + 1)"
      >
        <Icon name="mdi:chevron-right" size="24" aria-hidden="true" />
      </button>
      <div
        class="absolute bottom-2 left-2 flex rounded-full bg-brand-navy/50 px-1 backdrop-blur-sm @lg:bottom-3 @lg:left-3"
      >
        <button
          v-for="(image, index) in shown"
          :key="`${index}-${image.src}`"
          type="button"
          class="group inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-white"
          :aria-label="`Ir a la foto ${index + 1} de ${total}`"
          :aria-current="index === current ? 'true' : undefined"
          @click="go(index)"
        >
          <span
            class="block size-2 rounded-full transition-colors duration-200"
            :class="
              index === current
                ? 'bg-brand-white'
                : 'bg-brand-white/50 group-hover:bg-brand-white/80'
            "
            aria-hidden="true"
          />
        </button>
      </div>
    </template>
    <p class="sr-only" aria-live="polite">Foto {{ current + 1 }} de {{ total }}</p>
  </div>
</template>
