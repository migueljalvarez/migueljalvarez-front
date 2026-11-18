<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import PortfolioEditor from '~/components/admin/portfolio/PortfolioEditor.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import type { PortfolioDetailRecord } from '~/utils/admin/portfolio'

  definePageMeta({ layout: 'admin', crumb: 'Editar proyecto' })
  useSeoMeta({ title: 'Editar proyecto | Portafolio | Panel', robots: 'noindex, nofollow' })

  const api = useAdminApi()
  const route = useRoute()
  const id = computed(() => String(route.params.id))

  // El error viaja dentro de los datos para que el servidor y el navegador muestren lo mismo.
  type Loaded = { entry: PortfolioDetailRecord | null; error: string; notFound: boolean }
  const { data, refresh } = await useLazyAsyncData<Loaded>(
    () => `admin-portfolio-${id.value}`,
    async () => {
      try {
        return {
          entry: await api.get<PortfolioDetailRecord>(`portfolio/${id.value}`),
          error: '',
          notFound: false
        }
      } catch (error) {
        const apiError = toAdminApiError(error)
        return { entry: null, error: apiError.message, notFound: apiError.status === 404 }
      }
    },
    { watch: [id] }
  )
  const isLoading = computed(() => !data.value)
</script>

<template>
  <div>
    <AdminSkeleton v-if="isLoading" :rows="3" height-class="h-64" label="Cargando el proyecto…" />

    <PortfolioEditor
      v-else-if="data?.entry"
      :key="`${data.entry.id}-${data.entry.updatedAt}`"
      :entry="data.entry"
    />

    <div v-else>
      <AdminPageHeader
        eyebrow="Portafolio"
        :title="data?.notFound ? 'No encontramos este proyecto' : 'No se pudo cargar el proyecto'"
      />
      <AdminNotice tone="error" :message="data?.error">
        <AdminButton v-if="!data?.notFound" @click="refresh()">Reintentar</AdminButton>
        <AdminButton to="/admin/portfolio">Volver a la lista</AdminButton>
      </AdminNotice>
    </div>
  </div>
</template>
