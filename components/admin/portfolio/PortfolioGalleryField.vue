<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminIconButton from '~/components/admin/AdminIconButton.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import PortfolioImagePreview from '~/components/admin/portfolio/PortfolioImagePreview.vue'
  import {
    PORTFOLIO_LIMITS,
    moveItem,
    type PortfolioErrors,
    type PortfolioGalleryDraft
  } from '~/utils/admin/portfolio'

  // Galería: hasta 6 imágenes con vista previa, texto alternativo obligatorio y pie opcional. El orden
  // de la lista es el orden de la ficha. Los cambios se aplican al guardar el proyecto.
  const props = defineProps<{
    id: string
    modelValue: PortfolioGalleryDraft[]
    errors: PortfolioErrors
    slug: string
  }>()
  const emit = defineEmits<{ 'update:modelValue': [value: PortfolioGalleryDraft[]] }>()

  const root = ref<HTMLElement | null>(null)
  const liveMessage = ref('')
  const atLimit = computed(() => props.modelValue.length >= PORTFOLIO_LIMITS.gallery)
  const folder = computed(() => props.slug || 'mi-proyecto')

  const set = (index: number, field: 'path' | 'alt' | 'caption', value: string) =>
    emit(
      'update:modelValue',
      props.modelValue.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )

  const add = async () => {
    if (atLimit.value) return
    emit('update:modelValue', [...props.modelValue, { path: '', alt: '', caption: '' }])
    liveMessage.value = `Imagen ${props.modelValue.length + 1} añadida.`
    await nextTick()
    root.value
      ?.querySelector<HTMLElement>(`[data-row="${props.modelValue.length - 1}"] input`)
      ?.focus()
  }

  const remove = async (index: number) => {
    emit(
      'update:modelValue',
      props.modelValue.filter((_, i) => i !== index)
    )
    liveMessage.value = `Imagen ${index + 1} quitada. Guarda para aplicar el cambio.`
    await nextTick()
    const next = Math.min(index, props.modelValue.length - 1)
    ;(next >= 0
      ? root.value?.querySelector<HTMLElement>(`[data-row="${next}"] [data-remove]`)
      : document.getElementById(`${props.id}-add`)
    )?.focus()
  }

  const move = async (index: number, direction: -1 | 1) => {
    emit('update:modelValue', moveItem(props.modelValue, index, index + direction))
    liveMessage.value = `Imagen movida a la posición ${index + direction + 1} de ${props.modelValue.length}.`
    await nextTick()
    root.value
      ?.querySelector<HTMLElement>(
        `[data-row="${index + direction}"] [data-move="${direction === -1 ? 'up' : 'down'}"]`
      )
      ?.focus()
  }
</script>

<template>
  <div ref="root">
    <ul v-if="modelValue.length" class="space-y-3">
      <li
        v-for="(item, index) in modelValue"
        :key="index"
        :data-row="index"
        class="rounded-xl border border-brand-border p-4"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <h3 class="text-sm font-semibold text-brand-ink">
            Imagen {{ index + 1 }}
            <span class="font-normal text-brand-muted">de {{ modelValue.length }}</span>
          </h3>
          <div class="flex items-center gap-2">
            <AdminIconButton
              data-move="up"
              icon="mdi:arrow-up"
              :label="`Subir la imagen ${index + 1}`"
              :disabled="index === 0"
              @click="move(index, -1)"
            />
            <AdminIconButton
              data-move="down"
              icon="mdi:arrow-down"
              :label="`Bajar la imagen ${index + 1}`"
              :disabled="index === modelValue.length - 1"
              @click="move(index, 1)"
            />
            <AdminIconButton
              data-remove
              tone="danger"
              icon="mdi:trash-can-outline"
              :label="`Quitar la imagen ${index + 1}`"
              @click="remove(index)"
            />
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
          <PortfolioImagePreview :src="item.path" :label="`Imagen ${index + 1}`" />
          <div class="space-y-4">
            <AdminInput
              :id="`${id}-${index}-path`"
              :model-value="item.path"
              label="Ruta de la imagen"
              :placeholder="`/projects/${folder}/0${index + 1}-inicio.webp`"
              required
              autocomplete="off"
              :error="errors[`gallery.${index}.path`]"
              @update:model-value="set(index, 'path', String($event))"
            />
            <AdminInput
              :id="`${id}-${index}-alt`"
              :model-value="item.alt"
              label="Texto alternativo"
              placeholder="Pantalla de inicio con el resumen del mes"
              required
              counter
              :maxlength="PORTFOLIO_LIMITS.alt"
              autocomplete="off"
              hint="Describe lo que se ve. Lo leen los lectores de pantalla."
              :error="errors[`gallery.${index}.alt`]"
              @update:model-value="set(index, 'alt', String($event))"
            />
            <AdminInput
              :id="`${id}-${index}-caption`"
              :model-value="item.caption"
              label="Pie de imagen (opcional)"
              placeholder="El resumen mensual, lo primero que ve el cliente"
              counter
              :maxlength="PORTFOLIO_LIMITS.caption"
              autocomplete="off"
              :error="errors[`gallery.${index}.caption`]"
              @update:model-value="set(index, 'caption', String($event))"
            />
          </div>
        </div>
      </li>
    </ul>

    <p v-if="errors.gallery" role="alert" class="mt-2 text-xs font-medium text-brand-error-text">
      {{ errors.gallery }}
    </p>

    <div
      class="flex flex-wrap items-center gap-x-4 gap-y-2"
      :class="modelValue.length ? 'mt-3' : ''"
    >
      <AdminButton :id="`${id}-add`" :disabled="atLimit" @click="add">
        <Icon name="mdi:plus" size="20" aria-hidden="true" />
        Añadir imagen
      </AdminButton>
      <p class="text-sm tabular-nums text-brand-muted">
        {{
          atLimit
            ? `Llegaste al máximo de ${PORTFOLIO_LIMITS.gallery} imágenes`
            : `${modelValue.length} de ${PORTFOLIO_LIMITS.gallery} imágenes`
        }}
      </p>
    </div>
    <p class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</p>
  </div>
</template>
