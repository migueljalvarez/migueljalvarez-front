<script setup lang="ts">
  import AdminSectionIndex from '~/components/admin/AdminSectionIndex.vue'
  import type { EditorSectionItem } from '~/utils/admin/editorIndex'

  // Editor con barra lateral, para los módulos del panel (Sobre mí, y luego Portafolio, Políticas y Testimonios).
  //  · Escritorio (≥1024 px): el formulario a la izquierda y, a la derecha, una columna fija (sticky) con la caja
  //    «Publicar» y el índice de secciones.
  //  · Pantallas menores: la barra lateral pasa debajo del formulario.
  // Slots: por defecto = secciones del formulario; `publish` = contenido de la caja «Publicar» (estado,
  // botón, enlaces); `sidebar-extra` = cualquier otra caja bajo el índice. La barra de guardado la pone quien lo usa.
  defineProps<{
    /** Secciones del índice, en el orden de la página. */
    sections: EditorSectionItem[]
    publishTitle?: string
  }>()
</script>

<template>
  <div class="lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-6">
    <div class="min-w-0 space-y-6">
      <slot />
    </div>

    <aside
      aria-label="Publicación y secciones"
      class="mt-6 space-y-3 lg:sticky lg:top-6 lg:mt-0 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto"
    >
      <section
        v-if="$slots.publish"
        aria-labelledby="editor-publish-title"
        class="rounded-2xl border border-brand-border bg-brand-surface-card p-4"
      >
        <h2 id="editor-publish-title" class="mb-2 text-base font-semibold text-brand-ink">
          {{ publishTitle ?? 'Publicar' }}
        </h2>
        <slot name="publish" />
      </section>

      <section
        aria-labelledby="editor-index-title"
        class="rounded-2xl border border-brand-border bg-brand-surface-card p-4"
      >
        <h2 id="editor-index-title" class="mb-2 text-base font-semibold text-brand-ink">
          Secciones
        </h2>
        <AdminSectionIndex :items="sections" />
      </section>

      <slot name="sidebar-extra" />
    </aside>
  </div>
</template>
