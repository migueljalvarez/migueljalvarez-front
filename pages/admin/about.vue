<script setup lang="ts">
  import AboutEditor from '~/components/admin/about/AboutEditor.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import type { AboutAdminRecord } from '~/utils/admin/about'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Sobre mí | Panel', robots: 'noindex, nofollow' })

  const { load } = useAdminAbout()

  // El error viaja dentro de los datos para que el servidor y el navegador muestren lo mismo.
  type Loaded = { record: AboutAdminRecord | null; error: string }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-about', async () => {
    try {
      return { record: await load(), error: '' }
    } catch (error) {
      return { record: null, error: toAdminApiError(error).message }
    }
  })
  const isLoading = computed(() => !data.value)
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Contenido del sitio"
      title="Sobre mí"
      description="La sección de la home donde cuentas quién eres y cómo trabajas. Mientras no esté publicada, el sitio muestra el contenido de respaldo."
    />

    <AdminSkeleton v-if="isLoading" :rows="3" height-class="h-64" label="Cargando «Sobre mí»…" />

    <AboutEditor v-else-if="data?.record" :record="data.record" />

    <AdminNotice v-else tone="error" :message="data?.error">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>
  </div>
</template>
