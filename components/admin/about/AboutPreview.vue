<script setup lang="ts">
  import { About } from '~/components/templates'
  import { formToAboutContent, type AboutFormValues } from '~/utils/admin/about'

  // La sección real de la home (About) con lo que hay en el formulario. Es una vista previa: `inert`
  // evita que se pueda enfocar o abrir. La sección responde al ancho de su contenedor, así que aquí se
  // ve como se vería en una pantalla de este ancho.
  const props = defineProps<{ values: AboutFormValues }>()
  const content = computed(() => formToAboutContent(props.values))
</script>

<template>
  <div>
    <p
      v-if="!content.images.length"
      class="mb-3 flex items-center gap-2 text-sm font-medium text-brand-warning-text"
      role="status"
    >
      <Icon name="mdi:alert-outline" size="20" class="shrink-0" aria-hidden="true" />
      Sin una imagen válida (ruta correcta y texto alternativo) la sección no se puede publicar.
    </p>
    <div class="overflow-hidden rounded-2xl border border-brand-border" inert>
      <About :content="content" />
    </div>
  </div>
</template>
