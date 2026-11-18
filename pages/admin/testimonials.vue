<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSampleBanner from '~/components/admin/AdminSampleBanner.vue'
  import type { TestimonialRequest, TestimonialRequestStatus } from '~/types/admin'
  import { testimonialRequestSchema } from '~/utils/admin/schemas'

  definePageMeta({ layout: 'admin' })

  const store = useAdminData()
  const { data, canWrite } = store
  const { status, announce } = useAdminStatus()

  const tones: Record<TestimonialRequestStatus, string> = {
    enviada: 'border-brand-blue/40 bg-brand-blue/10 text-brand-accent-text',
    abierta: 'border-brand-warning-border bg-brand-warning-bg text-brand-warning-text',
    respondida: 'border-violet-300 bg-violet-50 text-violet-800',
    aprobada: 'border-brand-success-border bg-brand-success-bg text-brand-success-text',
    rechazada: 'border-brand-error-border bg-brand-error-bg text-brand-error-text',
    expirada: 'border-brand-border bg-brand-surface-soft text-brand-muted'
  }
  const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
  const formatDate = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })

  const pending = computed(() =>
    data.value.testimonials.filter(item => item.status === 'respondida')
  )

  // Solicitud
  const requestOpen = ref(false)
  const form = useAdminForm(testimonialRequestSchema, () => ({
    clientName: '',
    email: '',
    projectName: '',
    message: ''
  }))
  const openRequest = () => {
    form.reset()
    requestOpen.value = true
  }
  const submitRequest = () => {
    const parsed = form.validate()
    if (!parsed) return
    store.addTestimonialRequest(parsed)
    requestOpen.value = false
    announce('Solicitud registrada (el envío del correo se activa al conectar la API)')
  }

  // Revisión
  const reviewId = ref<string | null>(null)
  const review = computed<TestimonialRequest | null>(
    () => data.value.testimonials.find(item => item.id === reviewId.value) ?? null
  )
  const decide = (decision: 'aprobada' | 'rechazada') => {
    if (!review.value) return
    store.setTestimonialStatus(review.value.id, decision)
    announce(decision === 'aprobada' ? 'Testimonio aprobado' : 'Testimonio rechazado')
    reviewId.value = null
  }
  const resend = (item: TestimonialRequest) => {
    store.setTestimonialStatus(item.id, 'enviada')
    announce(`Solicitud reenviada a ${item.clientName}`)
  }
  const expire = (item: TestimonialRequest) => {
    store.setTestimonialStatus(item.id, 'expirada')
    announce('Solicitud marcada como expirada')
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Testimonios"
      description="Solicita testimonios a clientes reales y apruébalos antes de que aparezcan en la web."
    >
      <template #actions>
        <AdminButton variant="primary" :disabled="!canWrite" @click="openRequest">
          <Icon name="mdi:send-outline" size="18" aria-hidden="true" />
          Solicitar testimonio
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
    <p
      v-if="pending.length"
      class="mb-4 rounded-lg bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800"
    >
      Tienes {{ pending.length }} testimonio(s) por revisar.
    </p>

    <div
      v-if="data.testimonials.length"
      class="overflow-x-auto rounded-2xl border border-brand-border bg-brand-surface-card"
    >
      <table class="w-full min-w-[40rem] text-left text-sm">
        <caption class="sr-only">Solicitudes de testimonio</caption>
        <thead
          class="border-b border-brand-border bg-brand-surface-soft text-xs uppercase tracking-[0.08em] text-brand-muted"
        >
          <tr>
            <th scope="col" class="px-4 py-3 font-semibold">Cliente</th>
            <th scope="col" class="px-4 py-3 font-semibold">Proyecto</th>
            <th scope="col" class="px-4 py-3 font-semibold">Estado</th>
            <th scope="col" class="px-4 py-3 font-semibold">Enviada</th>
            <th scope="col" class="px-4 py-3"><span class="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-border">
          <tr v-for="item in data.testimonials" :key="item.id">
            <td class="px-4 py-3">
              <p class="font-medium text-brand-ink">{{ item.clientName }}</p>
              <p class="text-xs text-brand-muted">{{ item.email }}</p>
            </td>
            <td class="px-4 py-3 text-brand-muted">{{ item.projectName || '—' }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
                :class="tones[item.status]"
              >
                {{ label(item.status) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-brand-muted">
              {{ formatDate(item.createdAt) }}
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex flex-wrap justify-end gap-1">
                <AdminButton
                  v-if="item.status === 'respondida'"
                  variant="ghost"
                  @click="reviewId = item.id"
                >
                  Revisar
                </AdminButton>
                <AdminButton
                  v-if="['enviada', 'abierta', 'expirada'].includes(item.status)"
                  variant="ghost"
                  :disabled="!canWrite"
                  @click="resend(item)"
                >
                  Reenviar
                </AdminButton>
                <AdminButton
                  v-if="['enviada', 'abierta'].includes(item.status)"
                  variant="danger"
                  :disabled="!canWrite"
                  @click="expire(item)"
                >
                  Expirar
                </AdminButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-else
      class="rounded-2xl border border-dashed border-brand-border-soft bg-brand-surface-card p-8 text-center"
    >
      <Icon
        name="mdi:message-star-outline"
        size="32"
        class="mx-auto text-brand-helper"
        aria-hidden="true"
      />
      <p class="mt-3 font-semibold text-brand-ink">Aún no hay solicitudes</p>
      <p class="mx-auto mt-1 max-w-md text-sm leading-6 text-brand-muted">
        Cuando tengas un cliente real, solicita su testimonio: recibirá un enlace único para
        escribirlo y tú decides si se publica.
      </p>
    </div>

    <AdminDialog
      :open="requestOpen"
      title="Solicitar testimonio"
      description="El cliente recibirá un correo con un enlace único y con vencimiento para dejar su testimonio."
      @close="requestOpen = false"
    >
      <form class="space-y-4" novalidate @submit.prevent="submitRequest">
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminInput
            id="req-name"
            v-model="form.values.clientName"
            label="Nombre del cliente"
            required
            :error="form.errors.value.clientName"
          />
          <AdminInput
            id="req-email"
            v-model="form.values.email"
            label="Correo"
            type="email"
            required
            :error="form.errors.value.email"
          />
        </div>
        <AdminInput
          id="req-project"
          v-model="form.values.projectName"
          label="Proyecto (opcional)"
          :error="form.errors.value.projectName"
        />
        <AdminInput
          id="req-message"
          v-model="form.values.message"
          label="Mensaje personal (opcional)"
          type="textarea"
          hint="Se añade al correo de solicitud."
          :error="form.errors.value.message"
        />
        <p class="rounded-xl bg-brand-surface-soft p-3 text-xs leading-5 text-brand-muted">
          Nada se publica hasta que lo apruebes. El cliente debe aceptar el uso público de su texto,
          foto y logo.
        </p>
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="requestOpen = false">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Registrar solicitud</AdminButton>
        </div>
      </form>
    </AdminDialog>

    <AdminDialog
      :open="!!review"
      :title="review ? `Testimonio de ${review.clientName}` : 'Testimonio'"
      description="Revisa el texto antes de decidir. El original nunca se modifica."
      @close="reviewId = null"
    >
      <div v-if="review" class="space-y-4">
        <blockquote
          class="rounded-xl border-l-4 border-brand-blue bg-brand-surface-soft p-4 text-base leading-7 text-brand-ink"
        >
          {{ review.answer }}
        </blockquote>
        <div class="flex flex-wrap justify-end gap-3">
          <AdminButton variant="danger" @click="decide('rechazada')">Rechazar</AdminButton>
          <AdminButton variant="primary" @click="decide('aprobada')">
            Aprobar y publicar
          </AdminButton>
        </div>
      </div>
    </AdminDialog>
  </div>
</template>
