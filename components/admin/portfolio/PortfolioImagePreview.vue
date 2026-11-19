<script setup lang="ts">
  import { ImagePlaceholder } from '~/components/atoms'
  import { isRemoteImageUrl } from '~/utils/imageSource'
  // Vista previa de una imagen: ruta del propio sitio (absoluta) o URL https de una subida. Dice con texto si
  // no hay imagen o si no se encuentra, para detectar a tiempo una ruta mal escrita o un archivo sin copiar.
  const props = withDefaults(defineProps<{ src: string; ratioClass?: string; label: string }>(), {
    ratioClass: 'aspect-video'
  })

  const IMAGE_RE = /^\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*\.(webp|jpe?g|png)$/
  const state = ref<'loading' | 'ok' | 'missing'>('loading')
  const remote = computed(() => isRemoteImageUrl(props.src.trim()))
  const isValid = computed(() => IMAGE_RE.test(props.src.trim()) || remote.value)
  const path = computed(() => props.src.trim())

  // Con la ruta escrita a medias no se pide nada: se espera a que tenga forma de ruta de imagen.
  watch(path, () => (state.value = 'loading'), { immediate: true })

  // Si la imagen terminó de cargar antes de la hidratación, los eventos ya pasaron: se comprueba aquí.
  const image = ref<{ $el: HTMLImageElement } | null>(null)
  onMounted(() => {
    const element = image.value?.$el
    if (element?.complete) state.value = element.naturalWidth > 0 ? 'ok' : 'missing'
  })
</script>

<template>
  <figure class="m-0">
    <div
      class="relative w-full overflow-hidden rounded-xl border border-brand-border bg-brand-surface-soft"
      :class="ratioClass"
    >
      <NuxtImg
        v-if="isValid"
        :key="path"
        ref="image"
        :src="path"
        :provider="remote ? 'none' : undefined"
        alt=""
        aria-hidden="true"
        width="640"
        class="absolute inset-0 size-full object-cover"
        :class="state === 'ok' ? '' : 'invisible'"
        @load="state = 'ok'"
        @error="state = 'missing'"
      />
      <!-- Así se verá en el sitio mientras no haya imagen; el motivo lo explica el pie. -->
      <ImagePlaceholder v-if="!isValid || state === 'missing'" class="absolute inset-0" />
    </div>
    <figcaption class="mt-1 text-xs text-brand-muted" role="status">
      <template v-if="!path">{{ label }}: aún no hay imagen.</template>
      <template v-else-if="!isValid">{{ label }}: la ruta no es válida todavía.</template>
      <template v-else-if="state === 'missing' && remote">
        {{ label }}: no se pudo cargar la imagen desde su dirección. Revisa que siga disponible.
      </template>
      <template v-else-if="state === 'missing'">
        {{ label }}: no se encuentra el archivo en el sitio. Revisa la ruta y que esté en public{{
          path
        }}.
      </template>
      <template v-else-if="state === 'ok'">
        {{ label }}: {{ remote ? 'se ve bien.' : 'se ve bien desde el sitio.' }}
      </template>
      <template v-else>{{ label }}: comprobando…</template>
    </figcaption>
  </figure>
</template>
