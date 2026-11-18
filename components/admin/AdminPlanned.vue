<script setup lang="ts">
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import type { AdminNavItem } from '~/constants/admin'

  // Pantalla de un módulo que aún no está construido: explica qué hará.
  defineProps<{ item: AdminNavItem }>()
</script>

<template>
  <div>
    <AdminPageHeader eyebrow="Próximamente" :title="item.label" :description="item.summary" />

    <section
      class="max-w-3xl rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-6"
      aria-labelledby="planned-heading"
    >
      <h2 id="planned-heading" class="text-lg font-semibold text-brand-ink">Qué incluirá</h2>
      <ul class="mt-4 space-y-3 text-base leading-7 text-brand-muted">
        <li v-for="line in item.planned" :key="line" class="flex gap-3">
          <Icon
            name="mdi:check-circle-outline"
            size="20"
            class="mt-1 shrink-0 text-brand-blue"
            aria-hidden="true"
          />
          <span>{{ line }}</span>
        </li>
      </ul>
      <p class="mt-5 text-sm text-brand-muted">
        Este módulo se construirá cuando la base de datos esté lista.
      </p>
    </section>
  </div>
</template>
