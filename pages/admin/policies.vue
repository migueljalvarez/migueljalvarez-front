<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    POLICY_BODY_MAX,
    POLICY_ORDER_MAX,
    POLICY_TITLE_MAX,
    nextPolicyOrder,
    policyFormSchema,
    type PolicyRecord
  } from '~/utils/admin/siteContent'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Políticas | Panel', robots: 'noindex, nofollow' })

  const api = useAdminApi()
  const { status, announce } = useAdminStatus()

  // --- Carga (el error viaja dentro de los datos para que SSR y cliente muestren lo mismo).
  // Con `await` el servidor espera los datos antes de preparar el formulario (orden sugerido); en
  // navegación del cliente no bloquea y se ve el esqueleto.
  type Loaded = { items: PolicyRecord[] | null; error: string }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-policies', async () => {
    try {
      return { items: await api.get<PolicyRecord[]>('policies'), error: '' }
    } catch (error) {
      return { items: null, error: toAdminApiError(error).message }
    }
  })
  const policies = computed(() => data.value?.items ?? [])
  const loadError = computed(() => data.value?.error ?? '')
  const isLoading = computed(() => !data.value)
  const isReady = computed(() => !!data.value?.items)

  // --- Crear y editar
  const formOpen = ref(false)
  const editing = ref<PolicyRecord | null>(null)
  const isSaving = ref(false)
  const formError = ref('')
  const form = useAdminForm(policyFormSchema, () => ({
    title: editing.value?.title ?? '',
    body: editing.value?.body ?? '',
    isPublic: editing.value?.isPublic ?? true,
    sortOrder: String(editing.value?.sortOrder ?? nextPolicyOrder(policies.value))
  }))

  const openForm = (policy: PolicyRecord | null) => {
    editing.value = policy
    form.reset()
    formError.value = ''
    formOpen.value = true
  }
  const closeForm = () => {
    if (isSaving.value) return
    formOpen.value = false
  }

  const submitForm = async () => {
    formError.value = ''
    const parsed = form.validate()
    if (!parsed) {
      await nextTick()
      document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
      return
    }
    isSaving.value = true
    try {
      if (editing.value) await api.patch(`policies/${editing.value.id}`, parsed)
      else await api.post('policies', parsed)
      const wasEditing = !!editing.value
      await refresh()
      formOpen.value = false
      announce(wasEditing ? 'Política actualizada.' : 'Política creada.')
    } catch (error) {
      formError.value = toAdminApiError(error).message
    } finally {
      isSaving.value = false
    }
  }

  // --- Eliminar (con confirmación que nombra la política)
  const toDelete = ref<PolicyRecord | null>(null)
  const isDeleting = ref(false)
  const deleteError = ref('')

  const askDelete = (policy: PolicyRecord) => {
    toDelete.value = policy
    deleteError.value = ''
  }
  const closeDelete = () => {
    if (isDeleting.value) return
    toDelete.value = null
  }
  const confirmDelete = async () => {
    const policy = toDelete.value
    if (!policy) return
    isDeleting.value = true
    deleteError.value = ''
    try {
      await api.del(`policies/${policy.id}`)
      await refresh()
      toDelete.value = null
      announce(`Política «${policy.title}» eliminada.`)
    } catch (error) {
      deleteError.value = toAdminApiError(error).message
    } finally {
      isDeleting.value = false
    }
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Contenido del sitio"
      title="Políticas"
      description="Tus acuerdos de trabajo: cómo cobras, entregas y te comunicas. Las públicas se muestran en la página Cómo trabajo del sitio (/como-trabajo); las privadas solo las ves tú aquí."
    >
      <template #actions>
        <AdminButton v-if="policies.length" variant="primary" @click="openForm(null)">
          <Icon name="mdi:plus" size="20" aria-hidden="true" />
          Nueva política
        </AdminButton>
      </template>
    </AdminPageHeader>

    <AdminNotice tone="success" :message="status" />

    <AdminSkeleton
      v-if="isLoading"
      :rows="3"
      height-class="h-52.5 md:h-54.5"
      label="Cargando políticas…"
    />

    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>

    <AdminEmptyState
      v-else-if="!policies.length"
      icon="mdi:file-document-edit-outline"
      title="Aún no hay políticas"
      description="Escribe tus acuerdos de trabajo (pagos, entregas, cambios de alcance). Las que marques como públicas aparecen en Cómo trabajo."
    >
      <AdminButton variant="primary" @click="openForm(null)">
        <Icon name="mdi:plus" size="20" aria-hidden="true" />
        Crear la primera política
      </AdminButton>
    </AdminEmptyState>

    <ul v-else class="space-y-3" aria-label="Políticas">
      <li
        v-for="policy in policies"
        :key="policy.id"
        class="rounded-2xl border border-brand-border bg-brand-surface-card p-5 md:p-6"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-lg font-semibold text-brand-ink">{{ policy.title }}</h2>
            <p class="mt-1 text-xs tabular-nums text-brand-muted">Orden {{ policy.sortOrder }}</p>
          </div>
          <AdminBadge
            :tone="policy.isPublic ? 'success' : 'neutral'"
            :icon="policy.isPublic ? 'mdi:earth' : 'mdi:lock-outline'"
          >
            {{ policy.isPublic ? 'Pública' : 'Privada' }}
          </AdminBadge>
        </div>
        <p class="mt-3 line-clamp-2 text-sm leading-6 text-brand-muted">{{ policy.body }}</p>
        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <AdminButton :aria-label="`Editar ${policy.title}`" @click="openForm(policy)">
            Editar
          </AdminButton>
          <AdminButton
            variant="danger"
            :aria-label="`Eliminar ${policy.title}`"
            @click="askDelete(policy)"
          >
            Eliminar
          </AdminButton>
        </div>
      </li>
    </ul>

    <!-- Crear y editar -->
    <AdminDialog
      :open="formOpen"
      :title="editing ? 'Editar política' : 'Nueva política'"
      description="Los campos con * son obligatorios."
      @close="closeForm"
    >
      <form novalidate @submit.prevent="submitForm">
        <div class="space-y-4">
          <AdminInput
            id="policy-title"
            v-model="form.values.title"
            label="Título"
            required
            counter
            :maxlength="POLICY_TITLE_MAX"
            autocomplete="off"
            :error="form.errors.value.title"
          />
          <AdminInput
            id="policy-body"
            v-model="form.values.body"
            label="Texto"
            type="textarea"
            :rows="6"
            required
            counter
            :maxlength="POLICY_BODY_MAX"
            :error="form.errors.value.body"
          />
          <AdminInput
            id="policy-order"
            v-model="form.values.sortOrder"
            label="Orden"
            inputmode="numeric"
            autocomplete="off"
            required
            :maxlength="4"
            :hint="`Número de 0 a ${POLICY_ORDER_MAX}. Se muestran de menor a mayor; si repites uno, se ordenan por título.`"
            :error="form.errors.value.sortOrder"
          />
          <AdminInput
            id="policy-public"
            v-model="form.values.isPublic"
            type="checkbox"
            label="Pública"
            hint="Se muestra en la página Cómo trabajo del sitio (/como-trabajo). Si la dejas privada, solo la ves tú aquí."
          />
        </div>
        <AdminNotice tone="error" :message="formError" gap="top" />
        <AdminDialogActions class="mt-4">
          <AdminButton :disabled="isSaving" @click="closeForm">Cancelar</AdminButton>
          <AdminButton
            type="submit"
            variant="primary"
            :loading="isSaving"
            loading-label="Guardando…"
          >
            {{ editing ? 'Guardar cambios' : 'Crear política' }}
          </AdminButton>
        </AdminDialogActions>
      </form>
    </AdminDialog>

    <!-- Eliminar -->
    <AdminConfirmDialog
      :open="!!toDelete"
      title="Eliminar política"
      confirm-label="Eliminar política"
      loading-label="Eliminando…"
      :busy="isDeleting"
      :error="deleteError"
      @confirm="confirmDelete"
      @close="closeDelete"
    >
      <p v-if="toDelete">
        Vas a eliminar
        <strong class="font-semibold text-brand-ink">«{{ toDelete.title }}»</strong>
        . Esta acción no se puede deshacer
        <template v-if="toDelete.isPublic">y dejará de mostrarse en Cómo trabajo</template>
        .
      </p>
    </AdminConfirmDialog>
  </div>
</template>
