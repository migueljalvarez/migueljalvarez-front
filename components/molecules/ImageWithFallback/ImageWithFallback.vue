<script lang="ts" setup>
  import { ImagePlaceholder } from '~/components/atoms'
  import { isRemoteImageUrl } from '~/utils/imageSource'
  import type { ImageWithFallbackProps } from '../molecule'

  // Imagen con respaldo: si no hay `src` (vacío o solo espacios) o la carga falla, muestra el placeholder de
  // marca en su lugar. Llena a su contenedor: quien lo usa fija
  // posición (`relative` o `absolute`), proporción y redondeo con `class`.
  // Con `alt` vacío la imagen es decorativa y el placeholder también; con `alt`, el placeholder se anuncia
  // como imagen de ejemplo para no hacer pasar un respaldo por la foto real.
  const props = withDefaults(defineProps<ImageWithFallbackProps>(), { loading: 'lazy' })

  const path = computed(() => props.src?.trim() ?? '')
  // Las subidas desde el panel (URL https del almacenamiento) ya vienen normalizadas a WebP: se muestran tal
  // cual (`provider="none"`), sin pasar por el optimizador, que solo procesa archivos del propio sitio.
  const remote = computed(() => isRemoteImageUrl(path.value))
  const failed = ref(false)
  const showPlaceholder = computed(() => !path.value || failed.value)
  const placeholderLabel = computed(() =>
    props.alt ? `${props.alt} (imagen de ejemplo)` : undefined
  )

  // Cambia la ruta (p. ej. la vista previa del panel): se vuelve a intentar.
  watch(path, () => (failed.value = false))

  // Si la imagen falló antes de hidratar, el evento ya pasó: se comprueba al montar.
  const image = ref<{ $el: HTMLImageElement } | null>(null)
  onMounted(() => {
    const element = image.value?.$el
    if (element?.complete && element.naturalWidth === 0) failed.value = true
  })
</script>

<template>
  <div class="overflow-hidden">
    <ImagePlaceholder v-if="showPlaceholder" class="absolute inset-0" :label="placeholderLabel" />
    <NuxtImg
      v-else
      ref="image"
      :key="path"
      :src="path"
      :provider="remote ? 'none' : undefined"
      :alt="alt"
      :width="width"
      :height="height"
      :sizes="sizes"
      format="webp"
      :quality="quality"
      :loading="loading"
      :fetchpriority="fetchpriority"
      :class="imageClass ?? 'object-cover'"
      class="absolute inset-0 size-full"
      @error="failed = true"
    />
  </div>
</template>
