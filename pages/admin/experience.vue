<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSampleBanner from '~/components/admin/AdminSampleBanner.vue'
  import { experienceSchema } from '~/utils/admin/schemas'

  definePageMeta({ layout: 'admin' })

  const store = useAdminData()
  const { data, canWrite } = store
  const { status, announce } = useAdminStatus()

  const open = ref(false)
  const form = useAdminForm(experienceSchema, () => ({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    achievements: '',
    technologies: '',
    evidence: ''
  }))
  const openForm = () => {
    form.reset()
    open.value = true
  }
  const submit = () => {
    const parsed = form.validate()
    if (!parsed) return
    store.addExperience({ ...parsed, endDate: parsed.current ? '' : parsed.endDate })
    open.value = false
    announce('Experiencia agregada')
  }
  const remove = (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar la experiencia en "${name}"?`)) return
    store.removeExperience(id)
    announce('Experiencia eliminada')
  }
  const period = (start: string, end: string, current: boolean) => {
    const fmt = (iso: string) =>
      new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
    return `${fmt(start)} – ${current ? 'actual' : fmt(end)}`
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Experiencia"
      description="Tu trayectoria como fuente de verdad privada. Nunca se muestra en el sitio público; servirá de base para generar un CV a medida sin inventar datos."
    >
      <template #actions>
        <AdminButton variant="primary" :disabled="!canWrite" @click="openForm">
          <Icon name="mdi:plus" size="18" aria-hidden="true" />
          Nueva experiencia
        </AdminButton>
      </template>
    </AdminPageHeader>
    <AdminSampleBanner />

    <p
      v-if="status"
      role="status"
      class="mb-4 rounded-lg bg-brand-success-bg px-3 py-2 text-sm font-medium text-brand-success-text"
    >
      {{ status }}
    </p>

    <ul v-if="data.experiences.length" class="space-y-4">
      <li
        v-for="item in data.experiences"
        :key="item.id"
        class="rounded-2xl border border-brand-border bg-brand-surface-card p-5"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-brand-ink">{{ item.role }}</h2>
            <p class="text-sm text-brand-muted">
              {{ item.company }} · {{ period(item.startDate, item.endDate, item.current) }}
            </p>
          </div>
          <AdminButton
            variant="danger"
            :disabled="!canWrite"
            @click="remove(item.id, item.company)"
          >
            Eliminar
          </AdminButton>
        </div>
        <p class="mt-3 whitespace-pre-line text-sm leading-6 text-brand-muted">
          {{ item.achievements }}
        </p>
        <p v-if="item.technologies" class="mt-3 text-xs text-brand-muted">
          Tecnologías: {{ item.technologies }}
        </p>
        <p v-if="item.evidence" class="text-xs text-brand-muted">Evidencia: {{ item.evidence }}</p>
      </li>
    </ul>
    <div
      v-else
      class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-8 text-center"
    >
      <Icon
        name="mdi:briefcase-outline"
        size="32"
        class="mx-auto text-brand-helper"
        aria-hidden="true"
      />
      <p class="mt-3 font-semibold text-brand-ink">Aún no hay experiencias</p>
      <p class="mx-auto mt-1 max-w-md text-sm leading-6 text-brand-muted">
        Registra cada rol con logros verificables y su evidencia. Solo lo que registres aquí podrá
        usarse en un CV.
      </p>
    </div>

    <AdminDialog
      :open="open"
      title="Nueva experiencia"
      description="Solo datos reales y verificables."
      @close="open = false"
    >
      <form class="space-y-4" novalidate @submit.prevent="submit">
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminInput
            id="ex-company"
            v-model="form.values.company"
            label="Empresa o cliente"
            required
            :error="form.errors.value.company"
          />
          <AdminInput
            id="ex-role"
            v-model="form.values.role"
            label="Rol"
            required
            :error="form.errors.value.role"
          />
          <AdminInput
            id="ex-start"
            v-model="form.values.startDate"
            label="Inicio"
            type="date"
            required
            :error="form.errors.value.startDate"
          />
          <AdminInput
            id="ex-end"
            v-model="form.values.endDate"
            label="Fin"
            type="date"
            :error="form.errors.value.endDate"
          />
        </div>
        <AdminInput
          id="ex-current"
          v-model="form.values.current"
          label="Trabajo actual"
          type="checkbox"
        />
        <AdminInput
          id="ex-achievements"
          v-model="form.values.achievements"
          label="Logros (uno por línea)"
          type="textarea"
          :rows="5"
          required
          hint="Con métricas solo si son verificables."
          :error="form.errors.value.achievements"
        />
        <AdminInput
          id="ex-tech"
          v-model="form.values.technologies"
          label="Tecnologías"
          hint="Separadas por comas."
          :error="form.errors.value.technologies"
        />
        <AdminInput
          id="ex-evidence"
          v-model="form.values.evidence"
          label="Evidencia o fuente"
          hint="Enlace, carta, repositorio o contacto que lo respalda."
          :error="form.errors.value.evidence"
        />
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="open = false">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Guardar experiencia</AdminButton>
        </div>
      </form>
    </AdminDialog>
  </div>
</template>
