<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'

  // Confirmación de una acción que no se puede deshacer o que pierde trabajo. El cuerpo (slot) debe
  // nombrar lo que se verá afectado. El foco inicial cae en "Cancelar", nunca en la acción destructiva.
  withDefaults(
    defineProps<{
      open: boolean
      title: string
      confirmLabel: string
      loadingLabel?: string
      cancelLabel?: string
      tone?: 'danger' | 'primary'
      busy?: boolean
      error?: string
    }>(),
    { cancelLabel: 'Cancelar', tone: 'danger', loadingLabel: 'Procesando…' }
  )
  const emit = defineEmits<{ confirm: []; close: [] }>()
</script>

<template>
  <AdminDialog :open="open" :title="title" @close="emit('close')">
    <div>
      <div class="text-sm leading-6 text-brand-muted">
        <slot />
      </div>
      <AdminNotice tone="error" :message="error" gap="top" />
      <AdminDialogActions class="mt-4">
        <AdminButton data-autofocus :disabled="busy" @click="emit('close')">
          {{ cancelLabel }}
        </AdminButton>
        <AdminButton
          :variant="tone === 'danger' ? 'danger-solid' : 'primary'"
          :loading="busy"
          :loading-label="loadingLabel"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </AdminButton>
      </AdminDialogActions>
    </div>
  </AdminDialog>
</template>
