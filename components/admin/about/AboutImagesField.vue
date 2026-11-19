<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminIconButton from '~/components/admin/AdminIconButton.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import PortfolioImagePreview from '~/components/admin/portfolio/PortfolioImagePreview.vue'
  import {
    ABOUT_LIMITS,
    makeDefaultImage,
    moveImage,
    removeImageAt,
    type AboutErrors,
    type AboutImageDraft
  } from '~/utils/admin/about'

  // Imágenes de "Sobre mí": hasta 4 registradas por ruta (el archivo debe estar en public/about/ del
  // sitio: la API no sube archivos). La primera es la predeterminada (la que se ve al cargar el carrusel). Los cambios se aplican al guardar.
  const props = defineProps<{
    id: string
    modelValue: AboutImageDraft[]
    errors: AboutErrors
  }>()
  const emit = defineEmits<{ 'update:modelValue': [value: AboutImageDraft[]] }>()

  const root = ref<HTMLElement | null>(null)
  const liveMessage = ref('')
  const atLimit = computed(() => props.modelValue.length >= ABOUT_LIMITS.images)

  const set = (index: number, field: 'path' | 'alt', value: string) =>
    emit(
      'update:modelValue',
      props.modelValue.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )

  const add = async () => {
    if (atLimit.value) return
    emit('update:modelValue', [
      ...props.modelValue,
      { path: '', alt: '', isDefault: props.modelValue.length === 0 }
    ])
    liveMessage.value = `Imagen ${props.modelValue.length + 1} añadida.`
    await nextTick()
    root.value
      ?.querySelector<HTMLElement>(`[data-row="${props.modelValue.length - 1}"] input`)
      ?.focus()
  }

  const move = async (index: number, direction: -1 | 1) => {
    emit('update:modelValue', moveImage(props.modelValue, index, index + direction))
    liveMessage.value = `Imagen movida a la posición ${index + direction + 1} de ${props.modelValue.length}.`
    await nextTick()
    root.value
      ?.querySelector<HTMLElement>(
        `[data-row="${index + direction}"] [data-move="${direction === -1 ? 'up' : 'down'}"]`
      )
      ?.focus()
  }

  const setDefault = async (index: number) => {
    emit('update:modelValue', makeDefaultImage(props.modelValue, index))
    liveMessage.value = `La imagen ${index + 1} ahora es la predeterminada y pasa a la primera posición.`
    await nextTick()
    root.value?.querySelector<HTMLElement>('[data-row="0"] [data-remove]')?.focus()
  }

  // Quitar pide confirmación: nombra la imagen y avisa de que se elimina al guardar.
  const removing = ref<number | null>(null)
  const removingLabel = computed(() => {
    const item = removing.value === null ? null : props.modelValue[removing.value]
    return item ? item.path.trim() || `la imagen ${(removing.value ?? 0) + 1}` : ''
  })
  const confirmRemove = async () => {
    const index = removing.value
    removing.value = null
    if (index === null) return
    emit('update:modelValue', removeImageAt(props.modelValue, index))
    liveMessage.value = `Imagen ${index + 1} quitada. Guarda para aplicar el cambio.`
    await nextTick()
    const next = Math.min(index, props.modelValue.length - 2)
    ;(next >= 0
      ? root.value?.querySelector<HTMLElement>(`[data-row="${next}"] [data-remove]`)
      : document.getElementById(`${props.id}-add`)
    )?.focus()
  }
</script>

<template>
  <div ref="root">
    <ul v-if="modelValue.length" class="space-y-3" aria-label="Imágenes de Sobre mí">
      <li
        v-for="(item, index) in modelValue"
        :key="index"
        :data-row="index"
        class="rounded-xl border border-brand-border p-4"
      >
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-sm font-semibold text-brand-ink">
              Imagen {{ index + 1 }}
              <span class="font-normal text-brand-muted">de {{ modelValue.length }}</span>
            </h3>
            <AdminBadge v-if="item.isDefault" tone="info" icon="mdi:star-outline">
              Predeterminada
            </AdminBadge>
            <AdminBadge v-if="!item.id" tone="warning" icon="mdi:circle-edit-outline">
              Sin registrar
            </AdminBadge>
          </div>
          <div class="flex items-center gap-2">
            <AdminIconButton
              data-move="up"
              icon="mdi:arrow-up"
              :label="`Subir la imagen ${index + 1}`"
              :disabled="index <= 1"
              @click="move(index, -1)"
            />
            <AdminIconButton
              data-move="down"
              icon="mdi:arrow-down"
              :label="`Bajar la imagen ${index + 1}`"
              :disabled="index === 0 || index === modelValue.length - 1"
              @click="move(index, 1)"
            />
            <AdminIconButton
              data-remove
              tone="danger"
              icon="mdi:trash-can-outline"
              :label="`Quitar la imagen ${index + 1}`"
              @click="removing = index"
            />
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-[12rem_minmax(0,1fr)]">
          <PortfolioImagePreview
            :src="item.path"
            ratio-class="aspect-4/5"
            :label="`Imagen ${index + 1}`"
          />
          <div class="space-y-4">
            <AdminInput
              v-if="!item.id"
              :id="`${id}-${index}-path`"
              :model-value="item.path"
              label="Ruta de la imagen"
              placeholder="/about/miguel.webp"
              required
              counter
              :maxlength="ABOUT_LIMITS.imagePath"
              autocomplete="off"
              hint="El archivo debe estar en la carpeta public/about/ del sitio antes de registrarlo."
              :error="errors[`images.${index}.path`]"
              @update:model-value="set(index, 'path', String($event))"
            />
            <div v-else>
              <p class="mb-1 text-sm font-medium text-brand-ink">Ruta de la imagen</p>
              <p class="break-all text-sm text-brand-ink">{{ item.path }}</p>
              <p class="mt-1 text-xs text-brand-muted">
                La ruta no se puede cambiar: quita la imagen y registra otra.
              </p>
            </div>
            <AdminInput
              :id="`${id}-${index}-alt`"
              :model-value="item.alt"
              label="Texto alternativo"
              placeholder="Miguel trabajando frente a su computador"
              required
              counter
              :maxlength="ABOUT_LIMITS.alt"
              autocomplete="off"
              hint="Describe lo que se ve. Lo leen los lectores de pantalla."
              :error="errors[`images.${index}.alt`]"
              @update:model-value="set(index, 'alt', String($event))"
            />
            <AdminInput
              :id="`${id}-${index}-default`"
              :model-value="item.isDefault"
              type="checkbox"
              label="Imagen predeterminada"
              :disabled="item.isDefault"
              :hint="
                item.isDefault
                  ? 'Es la grande del collage. Para cambiarla, marca otra imagen como predeterminada.'
                  : 'Pasa a ser la primera y la grande del collage.'
              "
              @update:model-value="setDefault(index)"
            />
          </div>
        </div>
      </li>
    </ul>

    <p v-if="errors.images" role="alert" class="mt-2 text-xs font-medium text-brand-error-text">
      {{ errors.images }}
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
            ? `Llegaste al máximo de ${ABOUT_LIMITS.images} imágenes`
            : `${modelValue.length} de ${ABOUT_LIMITS.images} imágenes`
        }}
      </p>
    </div>
    <p v-if="!modelValue.length" class="mt-2 text-sm text-brand-muted">
      Todavía no hay imágenes. Sin al menos una, la sección no se puede publicar y el sitio usa su
      contenido de respaldo.
    </p>
    <p class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</p>

    <AdminConfirmDialog
      :open="removing !== null"
      title="Quitar imagen"
      confirm-label="Quitar imagen"
      @confirm="confirmRemove"
      @close="removing = null"
    >
      <p>
        Vas a quitar
        <strong class="font-semibold text-brand-ink break-all">{{ removingLabel }}</strong>
        de la sección. Se elimina de verdad cuando guardes los cambios; el archivo de la carpeta
        public/about/ no se borra.
      </p>
    </AdminConfirmDialog>
  </div>
</template>
