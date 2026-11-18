<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import type { ClientRecord } from '~/utils/admin/projects'

  // Tarjeta de un cliente con su número de proyectos.
  defineProps<{ client: ClientRecord }>()
  const emit = defineEmits<{ edit: []; remove: [] }>()
</script>

<template>
  <article class="rounded-xl border border-brand-border bg-brand-surface-card p-4">
    <h3 class="text-base font-semibold text-brand-ink">{{ client.name }}</h3>
    <p v-if="client.company" class="text-sm text-brand-muted">{{ client.company }}</p>
    <p v-if="client.email" class="break-all text-xs text-brand-muted">{{ client.email }}</p>
    <p class="mt-1 text-xs text-brand-muted">
      {{ client.projectsCount === 1 ? '1 proyecto' : `${client.projectsCount} proyectos` }}
    </p>
    <div class="mt-3 flex flex-wrap justify-between gap-2">
      <AdminButton variant="danger" :aria-label="`Eliminar ${client.name}`" @click="emit('remove')">
        Eliminar
      </AdminButton>
      <AdminButton :aria-label="`Editar ${client.name}`" @click="emit('edit')">Editar</AdminButton>
    </div>
  </article>
</template>
