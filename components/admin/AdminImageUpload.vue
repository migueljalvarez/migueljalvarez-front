<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import {
    MEDIA_ACCEPT,
    MEDIA_MAX_MB,
    formatBytes,
    type MediaFolder,
    type MediaResult
  } from '~/utils/admin/media'

  // Subida de una imagen al almacenamiento (R2) desde el panel: botón accesible y zona para arrastrar y
  // soltar. Solo sube y avisa (`uploaded`); quien lo usa guarda la URL devuelta donde corresponda. Estados:
  // cargando (barra + aviso anunciado), error (con motivo y cómo seguir) y éxito (medidas y peso).
  const props = withDefaults(
    defineProps<{
      id: string
      folder: MediaFolder
      /** Texto del botón: "Elegir imagen" o "Reemplazar imagen". */
      label?: string
      disabled?: boolean
    }>(),
    { label: 'Elegir imagen' }
  )
  const emit = defineEmits<{ uploaded: [media: MediaResult] }>()

  const { upload } = useAdminMedia()
  const input = ref<HTMLInputElement | null>(null)
  const uploading = ref(false)
  const dragging = ref(false)
  const error = ref('')
  const done = ref('')
  let depth = 0

  const send = async (file: File | undefined) => {
    if (!file || uploading.value || props.disabled) return
    uploading.value = true
    error.value = ''
    done.value = ''
    const outcome = await upload(file, props.folder)
    uploading.value = false
    if (outcome.ok) {
      done.value = `Imagen subida: ${outcome.media.width} × ${outcome.media.height} px, ${formatBytes(outcome.media.bytes)}.`
      emit('uploaded', outcome.media)
    } else {
      error.value = outcome.message
    }
  }

  const onPick = (event: Event) => {
    const element = event.target as HTMLInputElement
    const file = element.files?.[0]
    // Se limpia para poder volver a elegir el mismo archivo.
    element.value = ''
    void send(file)
  }
  const onDrop = (event: DragEvent) => {
    depth = 0
    dragging.value = false
    void send(event.dataTransfer?.files?.[0])
  }
  const onEnter = () => {
    depth += 1
    dragging.value = true
  }
  const onLeave = () => {
    depth = Math.max(0, depth - 1)
    if (depth === 0) dragging.value = false
  }
</script>

<template>
  <div
    class="rounded-xl border border-dashed p-4 transition-colors"
    :class="
      dragging
        ? 'border-brand-blue bg-brand-surface-card'
        : 'border-brand-border bg-brand-surface-soft'
    "
    @dragenter.prevent="onEnter"
    @dragover.prevent
    @dragleave.prevent="onLeave"
    @drop.prevent="onDrop"
  >
    <div class="flex flex-wrap items-center gap-x-4 gap-y-3">
      <AdminButton
        :id="id"
        :disabled="disabled"
        :loading="uploading"
        loading-label="Subiendo…"
        @click="input?.click()"
      >
        <Icon name="mdi:upload-outline" size="20" aria-hidden="true" />
        {{ label }}
      </AdminButton>
      <p class="min-w-0 flex-1 text-sm leading-6 text-brand-muted">
        {{ dragging ? 'Suelta la imagen aquí' : 'o arrástrala hasta aquí.' }}
        <span class="block text-xs">
          JPEG, PNG o WebP, hasta {{ MEDIA_MAX_MB }} MB. Se guarda como WebP.
        </span>
      </p>
    </div>
    <input
      ref="input"
      type="file"
      class="hidden"
      tabindex="-1"
      :accept="MEDIA_ACCEPT"
      aria-hidden="true"
      @change="onPick"
    />
    <div
      v-if="uploading"
      role="progressbar"
      aria-label="Subiendo imagen"
      class="mt-3 h-1 overflow-hidden rounded-full bg-brand-border"
    >
      <div class="h-full w-full bg-brand-blue motion-safe:animate-pulse" />
    </div>
    <AdminNotice tone="error" :message="error" gap="top" />
    <p class="text-xs text-brand-muted" :class="done || uploading ? 'mt-2' : ''" role="status">
      {{ uploading ? 'Subiendo imagen…' : done }}
    </p>
  </div>
</template>
