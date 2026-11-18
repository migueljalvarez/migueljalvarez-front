<script setup lang="ts">
  // Vista previa de una imagen del propio sitio (ruta absoluta). Dice con texto si no hay ruta o si el
  // archivo no se encuentra, para detectar a tiempo una ruta mal escrita o un archivo sin copiar.
  const props = withDefaults(defineProps<{ src: string; ratioClass?: string; label: string }>(), {
    ratioClass: 'aspect-video'
  })

  const IMAGE_RE = /^\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*\.(webp|jpe?g|png)$/
  const state = ref<'loading' | 'ok' | 'missing'>('loading')
  const isValid = computed(() => IMAGE_RE.test(props.src.trim()))
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
        alt=""
        aria-hidden="true"
        width="640"
        class="absolute inset-0 size-full object-cover"
        :class="state === 'ok' ? '' : 'invisible'"
        @load="state = 'ok'"
        @error="state = 'missing'"
      />
      <div
        v-if="!isValid || state === 'missing'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-1 p-3 text-center text-xs text-brand-muted"
      >
        <Icon
          :name="isValid ? 'mdi:image-broken-variant' : 'mdi:image-outline'"
          size="22"
          aria-hidden="true"
        />
        <span>{{ isValid ? 'No se encuentra la imagen' : 'Sin imagen' }}</span>
      </div>
    </div>
    <figcaption class="mt-1 text-xs text-brand-muted" role="status">
      <template v-if="!path">{{ label }}: aún no hay ruta.</template>
      <template v-else-if="!isValid">{{ label }}: la ruta no es válida todavía.</template>
      <template v-else-if="state === 'missing'">
        {{ label }}: no se encuentra el archivo en el sitio. Revisa la ruta y que esté en public{{
          path
        }}.
      </template>
      <template v-else-if="state === 'ok'">{{ label }}: se ve bien desde el sitio.</template>
      <template v-else>{{ label }}: comprobando…</template>
    </figcaption>
  </figure>
</template>
