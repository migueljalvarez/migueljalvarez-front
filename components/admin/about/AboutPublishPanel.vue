<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import {
    formatAboutDate,
    type AboutAdminRecord,
    type PublishRequirement
  } from '~/utils/admin/about'

  // Publicación: qué ve hoy el público, qué falta para publicar y cómo se aplicará. Lo que se elige aquí
  // se aplica al guardar (misma barra de acciones que el resto del formulario).
  const props = defineProps<{
    /** Última versión guardada. */
    record: AboutAdminRecord
    requirements: PublishRequirement[]
    error?: string
  }>()
  const published = defineModel<boolean>('published', { required: true })

  const missing = computed(() => props.requirements.filter(item => !item.met))
  const canPublish = computed(() => missing.value.length === 0)
  const pending = computed(() => published.value !== props.record.isPublished)

  const hint = computed(() => {
    if (!canPublish.value && !published.value) {
      return `Aún no se puede publicar: falta ${missing.value.map(item => item.label.toLowerCase()).join(' y ')}.`
    }
    return published.value
      ? 'Visible en la home, antes de Contacto. Desactívalo para volver al contenido de respaldo del código.'
      : 'No se muestra: la home usa el contenido de respaldo del código. Actívalo para publicar esta versión.'
  })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
      <p class="text-sm font-medium text-brand-ink">Estado actual</p>
      <AdminBadge
        :tone="record.isPublished ? 'success' : 'neutral'"
        :icon="record.isPublished ? 'mdi:eye-outline' : 'mdi:eye-off-outline'"
      >
        {{ record.isPublished ? 'Publicado' : 'Borrador' }}
      </AdminBadge>
      <p class="text-xs text-brand-muted">
        Última actualización: {{ formatAboutDate(record.updatedAt) }}.
      </p>
    </div>

    <div>
      <p class="mb-2 text-sm font-medium text-brand-ink">Requisitos para publicar</p>
      <ul class="space-y-1">
        <li
          v-for="item in requirements"
          :key="item.id"
          class="flex items-center gap-2 text-sm"
          :class="item.met ? 'text-brand-success-text' : 'text-brand-error-text'"
        >
          <Icon
            :name="item.met ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'"
            size="20"
            class="shrink-0"
            aria-hidden="true"
          />
          <span>{{ item.label }}</span>
          <span class="sr-only">{{ item.met ? ': cumplido' : ': falta' }}</span>
        </li>
      </ul>
    </div>

    <AdminInput
      id="about-published"
      v-model="published"
      type="checkbox"
      label="Publicar en el sitio"
      :disabled="!canPublish && !published"
      :hint="hint"
      :error="error"
    />
    <p v-if="error" role="alert" class="-mt-4 text-xs font-medium text-brand-error-text">
      {{ error }}
    </p>

    <p
      v-if="pending"
      class="flex items-center gap-2 text-sm font-medium text-brand-warning-text"
      role="status"
    >
      <Icon name="mdi:circle-edit-outline" size="20" class="shrink-0" aria-hidden="true" />
      Al guardar quedará como «{{ published ? 'Publicado' : 'Borrador' }}».
    </p>
  </div>
</template>
