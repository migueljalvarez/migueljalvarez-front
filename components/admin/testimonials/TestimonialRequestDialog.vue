<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import TestimonialLinkPanel from '~/components/admin/testimonials/TestimonialLinkPanel.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import type { ClientRecord } from '~/utils/admin/projects'
  import {
    TESTIMONIAL_LIMITS,
    emptyRequestForm,
    prefillFromClient,
    validateRequestForm,
    type RequestFormValues,
    type TestimonialRecord,
    type TestimonialSendResponse
  } from '~/utils/admin/testimonials'

  // Nueva solicitud: el cliente recibe un correo con un enlace único y con vencimiento. Si el correo no
  // puede salir (sin Resend configurado o con error), el enlace se muestra aquí una sola vez para copiarlo.
  const props = defineProps<{ open: boolean }>()
  const emit = defineEmits<{ close: []; created: [record: TestimonialRecord] }>()

  const testimonials = useAdminTestimonials()
  const projects = useAdminProjects()
  const uid = useId()

  const values = reactive<RequestFormValues>(emptyRequestForm())
  const errors = ref<Record<string, string>>({})
  const saveError = ref('')
  const isSaving = ref(false)
  const result = ref<TestimonialSendResponse | null>(null)

  // Clientes existentes (opcional): al elegir uno se precargan nombre y correo.
  const clients = ref<ClientRecord[]>([])
  const clientOptions = computed(() => [
    { value: '', label: 'Sin cliente registrado' },
    ...clients.value.map(client => ({ value: client.id, label: client.name }))
  ])
  const loadClients = async () => {
    try {
      clients.value = (await projects.listClients()).items
    } catch {
      // Es una ayuda opcional: sin la lista se puede escribir el nombre a mano.
      clients.value = []
    }
  }
  const onClientChange = (clientId: string) => {
    values.clientId = clientId
    const client = clients.value.find(item => item.id === clientId)
    if (client) Object.assign(values, prefillFromClient(client))
  }

  watch(
    () => props.open,
    open => {
      // Al cerrar se descarta el enlace: no queda en el DOM ni en memoria.
      if (!open) {
        result.value = null
        return
      }
      Object.assign(values, emptyRequestForm())
      errors.value = {}
      saveError.value = ''
      result.value = null
      void loadClients()
    },
    { immediate: true }
  )

  const focusFirstError = async () => {
    await nextTick()
    document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
  }

  const submit = async () => {
    saveError.value = ''
    const check = validateRequestForm(values)
    if (!check.ok) {
      errors.value = check.errors
      await focusFirstError()
      return
    }
    errors.value = {}
    isSaving.value = true
    try {
      const response = await testimonials.create(check.data)
      result.value = response
      emit('created', response.request)
    } catch (error) {
      saveError.value = toAdminApiError(error).message
    } finally {
      isSaving.value = false
    }
  }
</script>

<template>
  <AdminDialog
    :open="open"
    :title="result ? 'Solicitud creada' : 'Solicitar testimonio'"
    :description="
      result
        ? undefined
        : 'El cliente recibirá un correo con un enlace único y con vencimiento para dejar su testimonio.'
    "
    @close="emit('close')"
  >
    <div v-if="result" class="space-y-4">
      <TestimonialLinkPanel :result="result" />
      <AdminDialogActions>
        <AdminButton variant="primary" data-autofocus @click="emit('close')">Listo</AdminButton>
      </AdminDialogActions>
    </div>

    <form v-else class="space-y-4" novalidate @submit.prevent="submit">
      <AdminInput
        v-if="clients.length"
        :id="`${uid}-client`"
        :model-value="values.clientId"
        label="Cliente registrado (opcional)"
        type="select"
        :options="clientOptions"
        hint="Si eliges uno, la solicitud queda ligada a ese cliente."
        @update:model-value="onClientChange(String($event))"
      />
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminInput
          :id="`${uid}-name`"
          v-model="values.clientName"
          label="Nombre del cliente"
          required
          :maxlength="TESTIMONIAL_LIMITS.clientName"
          autocomplete="off"
          :error="errors.clientName"
        />
        <AdminInput
          :id="`${uid}-email`"
          v-model="values.email"
          label="Correo"
          type="email"
          required
          autocomplete="off"
          :error="errors.email"
        />
      </div>
      <div class="grid gap-4 sm:grid-cols-[1fr_9rem]">
        <AdminInput
          :id="`${uid}-project`"
          v-model="values.projectName"
          label="Proyecto (opcional)"
          :maxlength="TESTIMONIAL_LIMITS.projectName"
          :error="errors.projectName"
        />
        <AdminInput
          :id="`${uid}-days`"
          v-model="values.expiresInDays"
          label="Vigencia (días)"
          type="number"
          inputmode="numeric"
          required
          :error="errors.expiresInDays"
        />
      </div>
      <AdminInput
        :id="`${uid}-message`"
        v-model="values.message"
        label="Mensaje personal (opcional)"
        type="textarea"
        :rows="4"
        :maxlength="TESTIMONIAL_LIMITS.message"
        counter
        hint="Se muestra en el correo y sobre el formulario."
        :error="errors.message"
      />
      <p class="rounded-xl bg-brand-surface-soft p-3 text-xs leading-5 text-brand-muted">
        Nada se publica hasta que lo apruebes. El cliente debe autorizar de forma expresa la
        publicación de su texto, nombre, cargo y empresa.
      </p>
      <AdminNotice tone="error" :message="saveError" gap="top" />
      <AdminDialogActions>
        <AdminButton :disabled="isSaving" @click="emit('close')">Cancelar</AdminButton>
        <AdminButton type="submit" variant="primary" :loading="isSaving" loading-label="Enviando…">
          Crear y enviar correo
        </AdminButton>
      </AdminDialogActions>
    </form>
  </AdminDialog>
</template>
