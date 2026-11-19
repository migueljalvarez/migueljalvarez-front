<script setup lang="ts">
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
  import { listAllAdminPages } from '~/utils/admin/pagination'
  import {
    emptyExperienceForm,
    EXPERIENCE_KIND_LABEL,
    EXPERIENCE_KINDS,
    experienceFormFromRecord,
    experienceSchema,
    moveExperience,
    type ExperienceRecord
  } from '~/utils/admin/experience'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Experiencia | Panel', robots: 'noindex, nofollow' })

  const api = useAdminExperience()
  const { status, announce } = useAdminStatus()
  type Loaded = { items: ExperienceRecord[] | null; total: number; error: string }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-experience', async () => {
    try {
      const items = await listAllAdminPages<ExperienceRecord>(query => api.list(query))
      return { items, total: items.length, error: '' }
    } catch (error) {
      return { items: null, total: 0, error: toAdminApiError(error).message }
    }
  })

  const experiences = computed(() => data.value?.items ?? [])
  const loading = computed(() => !data.value)
  const loadError = computed(() => data.value?.error ?? '')
  const isReady = computed(() => data.value?.items !== null && data.value?.items !== undefined)
  const kindOptions = EXPERIENCE_KINDS.map(value => ({
    value,
    label: EXPERIENCE_KIND_LABEL[value]
  }))
  const period = (item: ExperienceRecord) => {
    const fmt = (iso: string) =>
      new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
    return `${fmt(item.startDate)} – ${item.isCurrent ? 'actual' : item.endDate ? fmt(item.endDate) : ''}`
  }

  const dialogOpen = ref(false)
  const editing = ref<ExperienceRecord | null>(null)
  const saving = ref(false)
  const formError = ref('')
  const form = useAdminForm(experienceSchema, emptyExperienceForm)
  const removal = reactive({
    open: false,
    item: null as ExperienceRecord | null,
    busy: false,
    error: ''
  })
  const ordering = ref(false)
  const orderError = ref('')

  watch(
    () => form.values.isCurrent,
    isCurrent => {
      if (isCurrent) form.values.endDate = ''
    }
  )

  const openForm = (item: ExperienceRecord | null = null) => {
    editing.value = item
    form.reset()
    if (item) Object.assign(form.values, experienceFormFromRecord(item))
    formError.value = ''
    dialogOpen.value = true
  }

  const save = async () => {
    const payload = form.validate()
    if (!payload) return
    saving.value = true
    formError.value = ''
    const apiPayload = {
      ...payload,
      endDate: payload.isCurrent ? undefined : payload.endDate
    }
    try {
      if (editing.value) await api.update(editing.value.id, apiPayload)
      else await api.create(apiPayload)
      dialogOpen.value = false
      await refresh()
      announce(editing.value ? 'Experiencia actualizada' : 'Experiencia agregada')
    } catch (error) {
      formError.value = toAdminApiError(error).message
    } finally {
      saving.value = false
    }
  }

  const remove = async () => {
    if (!removal.item) return
    removal.busy = true
    removal.error = ''
    try {
      await api.remove(removal.item.id)
      removal.open = false
      announce('Experiencia eliminada')
      await refresh()
    } catch (error) {
      removal.error = toAdminApiError(error).message
    } finally {
      removal.busy = false
    }
  }

  const reorder = async (index: number, direction: -1 | 1) => {
    if (!data.value?.items || ordering.value) return
    const next = moveExperience(data.value.items, index, direction)
    if (!next) return
    ordering.value = true
    orderError.value = ''
    try {
      const updates = next.filter(
        (item, itemIndex) => item.sortOrder !== data.value?.items?.[itemIndex]?.sortOrder
      )
      await Promise.all(updates.map(item => api.reorder(item.id, item.sortOrder)))
      await refresh()
      announce('Orden actualizado')
    } catch (error) {
      orderError.value = toAdminApiError(error).message
      await refresh()
    } finally {
      ordering.value = false
    }
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Experiencia"
      description="Tu trayectoria como fuente privada de verdad. Nunca se muestra en el sitio y puede servir para preparar un CV sin inventar datos."
    >
      <template #actions>
        <AdminButton variant="primary" @click="openForm()">
          <Icon name="mdi:plus" size="20" aria-hidden="true" />
          Nueva experiencia
        </AdminButton>
      </template>
    </AdminPageHeader>

    <AdminNotice :message="status" />
    <p v-if="ordering" role="status" class="mb-4 text-sm text-brand-muted">
      Actualizando el orden…
    </p>
    <AdminSkeleton v-if="loading" :rows="3" height-class="h-28" label="Cargando la experiencia…" />
    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>
    <template v-else>
      <AdminNotice tone="error" :message="orderError" />
      <p v-if="data && data.total > experiences.length" class="mb-3 text-sm text-brand-muted">
        Se muestran {{ experiences.length }} de {{ data.total }} experiencias.
      </p>
      <AdminEmptyState
        v-if="!experiences.length"
        icon="mdi:briefcase-outline"
        title="Aún no hay experiencias"
        description="Registra roles reales con logros verificables y evidencia. Solo los datos registrados aquí podrán usarse en un CV."
      >
        <AdminButton variant="primary" @click="openForm()">
          Agregar la primera experiencia
        </AdminButton>
      </AdminEmptyState>
      <ol v-else class="space-y-4" aria-label="Experiencia profesional">
        <li
          v-for="(item, index) in experiences"
          :key="item.id"
          class="rounded-2xl border border-brand-border bg-brand-surface-card p-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <h2 class="text-lg font-semibold text-brand-ink">{{ item.role }}</h2>
              <p class="text-sm text-brand-muted">{{ item.company }} · {{ period(item) }}</p>
              <p class="mt-1 text-xs text-brand-muted">
                {{ EXPERIENCE_KIND_LABEL[item.kind] }}
                <span v-if="item.location">· {{ item.location }}</span>
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <AdminButton
                :disabled="ordering || index === 0"
                aria-label="Mover arriba"
                @click="reorder(index, -1)"
              >
                <Icon name="mdi:arrow-up" size="18" aria-hidden="true" />
              </AdminButton>
              <AdminButton
                :disabled="ordering || index === experiences.length - 1"
                aria-label="Mover abajo"
                @click="reorder(index, 1)"
              >
                <Icon name="mdi:arrow-down" size="18" aria-hidden="true" />
              </AdminButton>
              <AdminButton @click="openForm(item)">Editar</AdminButton>
              <AdminButton
                variant="danger"
                @click="Object.assign(removal, { open: true, item, error: '' })"
              >
                Eliminar
              </AdminButton>
            </div>
          </div>
          <ul class="mt-3 list-inside list-disc space-y-1 text-sm leading-6 text-brand-muted">
            <li
              v-for="(achievement, achievementIndex) in item.achievements"
              :key="`${item.id}-${achievementIndex}`"
            >
              {{ achievement }}
            </li>
          </ul>
          <p v-if="item.technologies.length" class="mt-3 text-sm text-brand-muted">
            <span class="font-medium text-brand-ink">Tecnologías:</span>
            {{ item.technologies.join(', ') }}
          </p>
          <p v-if="item.evidence" class="mt-2 text-sm text-brand-muted">
            <span class="font-medium text-brand-ink">Evidencia:</span>
            {{ item.evidence }}
          </p>
        </li>
      </ol>
    </template>

    <AdminDialog
      :open="dialogOpen"
      :title="editing ? 'Editar experiencia' : 'Nueva experiencia'"
      description="Registra solo datos reales y verificables."
      @close="dialogOpen = false"
    >
      <form class="space-y-4" novalidate @submit.prevent="save">
        <AdminNotice tone="error" :message="formError" />
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminInput
            id="experience-company"
            v-model="form.values.company"
            label="Empresa o cliente"
            required
            maxlength="120"
            :error="form.errors.value.company"
          />
          <AdminInput
            id="experience-role"
            v-model="form.values.role"
            label="Rol"
            required
            maxlength="120"
            :error="form.errors.value.role"
          />
          <AdminInput
            id="experience-kind"
            v-model="form.values.kind"
            type="select"
            label="Tipo"
            :options="kindOptions"
            :error="form.errors.value.kind"
          />
          <AdminInput
            id="experience-location"
            v-model="form.values.location"
            label="Ubicación"
            maxlength="120"
            :error="form.errors.value.location"
          />
          <AdminInput
            id="experience-start"
            v-model="form.values.startDate"
            label="Inicio"
            type="date"
            required
            :error="form.errors.value.startDate"
          />
          <AdminInput
            id="experience-end"
            v-model="form.values.endDate"
            label="Fin"
            type="date"
            :required="!form.values.isCurrent"
            :disabled="form.values.isCurrent"
            hint="Obligatoria salvo que sea tu trabajo actual."
            :error="form.errors.value.endDate"
          />
        </div>
        <AdminInput
          id="experience-current"
          v-model="form.values.isCurrent"
          label="Trabajo actual"
          type="checkbox"
          hint="Al marcarlo, se elimina la fecha de fin al guardar."
        />
        <AdminInput
          id="experience-achievements"
          v-model="form.values.achievements"
          label="Logros (uno por línea)"
          type="textarea"
          :rows="5"
          required
          maxlength="3000"
          hint="Hasta 30 logros, 500 caracteres por logro y 3000 en total."
          :error="form.errors.value.achievements"
        />
        <AdminInput
          id="experience-technologies"
          v-model="form.values.technologies"
          label="Tecnologías"
          maxlength="2500"
          hint="Separadas por comas; los repetidos se quitan al guardar."
          :error="form.errors.value.technologies"
        />
        <AdminInput
          id="experience-evidence"
          v-model="form.values.evidence"
          label="Evidencia o fuente"
          maxlength="500"
          hint="Referencia privada para verificar esta experiencia."
          :error="form.errors.value.evidence"
        />
        <AdminInput
          id="experience-order"
          v-model="form.values.sortOrder"
          label="Orden manual"
          type="number"
          step="1"
          hint="Menor número aparece primero. También puedes usar las flechas de cada ficha."
          :error="form.errors.value.sortOrder"
        />
        <AdminDialogActions>
          <AdminButton :disabled="saving" @click="dialogOpen = false">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary" :loading="saving" loading-label="Guardando…">
            {{ editing ? 'Guardar cambios' : 'Guardar experiencia' }}
          </AdminButton>
        </AdminDialogActions>
      </form>
    </AdminDialog>

    <AdminConfirmDialog
      :open="removal.open"
      title="Eliminar experiencia"
      confirm-label="Eliminar experiencia"
      :busy="removal.busy"
      :error="removal.error"
      @close="removal.open = false"
      @confirm="remove"
    >
      Se eliminará la experiencia de «{{ removal.item?.company }}» como {{ removal.item?.role }}.
    </AdminConfirmDialog>
  </div>
</template>
