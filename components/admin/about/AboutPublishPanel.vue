<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
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
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <AdminBadge
        :tone="record.isPublished ? 'success' : 'neutral'"
        :icon="record.isPublished ? 'mdi:eye-outline' : 'mdi:eye-off-outline'"
      >
        {{ record.isPublished ? 'Publicado' : 'Borrador' }}
      </AdminBadge>
      <a
        href="/#about"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex min-h-11 items-center gap-1 rounded-lg px-1 text-sm font-medium text-logo-blue underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        Ver sitio
        <Icon name="mdi:open-in-new" size="16" aria-hidden="true" />
        <span class="sr-only">(se abre en otra pestaña)</span>
      </a>
    </div>
    <p class="-mt-1 text-xs text-brand-muted">
      Última actualización: {{ formatAboutDate(record.updatedAt) }}
    </p>

    <!-- Con todo cumplido basta una línea; si falta algo, se listan los requisitos. -->
    <p v-if="canPublish" class="flex items-center gap-2 text-sm text-brand-success-text">
      <Icon name="mdi:check-circle-outline" size="20" class="shrink-0" aria-hidden="true" />
      Requisitos para publicar cumplidos
    </p>
    <ul v-else class="space-y-1" aria-label="Requisitos para publicar">
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

    <AdminButton
      id="about-published"
      :variant="published ? 'secondary' : 'primary'"
      class="w-full"
      :disabled="!canPublish && !published"
      :aria-describedby="'about-published-hint'"
      @click="published = !published"
    >
      <Icon
        :name="published ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
        size="20"
        aria-hidden="true"
      />
      {{ published ? 'Despublicar' : 'Publicar' }}
    </AdminButton>
    <p id="about-published-hint" class="-mt-2 text-xs leading-5 text-brand-muted">{{ hint }}</p>
    <p v-if="error" role="alert" class="text-xs font-medium text-brand-error-text">
      {{ error }}
    </p>

    <p
      v-if="pending"
      class="flex items-start gap-2 text-sm font-medium text-brand-warning-text"
      role="status"
    >
      <Icon name="mdi:circle-edit-outline" size="20" class="mt-0.5 shrink-0" aria-hidden="true" />
      Al guardar quedará como «{{ published ? 'Publicado' : 'Borrador' }}».
    </p>
  </div>
</template>
