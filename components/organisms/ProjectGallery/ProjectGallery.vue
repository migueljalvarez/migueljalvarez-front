<script lang="ts" setup>
  import { computed } from 'vue'
  import { Heading } from '~/components/atoms'
  import { ImageWithFallback } from '~/components/molecules'
  import { galleryColumns } from '~/utils/portfolioList'
  import type { ProjectGalleryProps } from '../organism'

  // Galería 16:9 en 3 columnas (2 si hay una o dos imágenes). Sin imágenes, la sección no se renderiza.
  const props = defineProps<ProjectGalleryProps>()

  const gridClass = computed(() =>
    galleryColumns(props.images.length) === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
  )
</script>

<template>
  <section v-if="images.length" aria-labelledby="project-gallery-heading">
    <Heading id="project-gallery-heading" level="h2" class="mb-6">Así se ve</Heading>
    <ul class="grid grid-cols-1 gap-5" :class="gridClass">
      <li v-for="(image, index) in images" :key="`${image.src}-${index}`" class="min-w-0">
        <figure>
          <ImageWithFallback
            :src="image.src"
            :alt="image.alt"
            :width="1600"
            :height="900"
            sizes="100vw md:33vw"
            class="relative aspect-video w-full rounded-2xl border border-brand-border"
          />
          <figcaption v-if="image.caption" class="mt-2 text-sm leading-6 text-brand-muted">
            {{ image.caption }}
          </figcaption>
        </figure>
      </li>
    </ul>
  </section>
</template>
