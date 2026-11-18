<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSampleBanner from '~/components/admin/AdminSampleBanner.vue'
  import {
    assignmentSchema,
    paymentSchema,
    teamMemberSchema,
    timeEntrySchema
  } from '~/utils/admin/schemas'

  definePageMeta({ layout: 'admin' })

  const store = useAdminData()
  const { data, canWrite } = store
  const { status, announce } = useAdminStatus()

  const today = () => new Date().toISOString().slice(0, 10)
  const usd = (value: number) =>
    value.toLocaleString('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
  const cop = (value: number) =>
    value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
  const formatDate = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })

  const memberOptions = computed(() =>
    data.value.team.map(member => ({ value: member.id, label: member.name }))
  )
  const projectOptions = computed(() =>
    data.value.projects.map(project => ({ value: project.id, label: project.name }))
  )

  const balances = computed(() =>
    data.value.team.map(member => ({ member, ...store.memberBalance(member.id) }))
  )
  const totalDue = computed(() => balances.value.reduce((sum, item) => sum + item.due, 0))

  type DialogKey = 'member' | 'assignment' | 'hours' | 'payment' | null
  const open = ref<DialogKey>(null)

  const memberForm = useAdminForm(teamMemberSchema, () => ({
    name: '',
    email: '',
    role: '',
    responsibilities: '',
    rateUsd: ''
  }))
  const assignmentForm = useAdminForm(assignmentSchema, () => ({
    memberId: '',
    projectId: '',
    agreedHours: ''
  }))
  const hoursForm = useAdminForm(timeEntrySchema, () => ({
    memberId: '',
    projectId: '',
    hours: '',
    date: today(),
    note: ''
  }))
  const paymentForm = useAdminForm(paymentSchema, () => ({
    memberId: '',
    amountUsd: '',
    trm: '',
    date: today(),
    note: ''
  }))

  const forms = {
    member: memberForm,
    assignment: assignmentForm,
    hours: hoursForm,
    payment: paymentForm
  }
  const openDialog = (key: Exclude<DialogKey, null>) => {
    forms[key].reset()
    open.value = key
  }

  const submitMember = () => {
    const parsed = memberForm.validate()
    if (!parsed) return
    store.addMember(parsed)
    open.value = null
    announce('Colaborador agregado')
  }
  const submitAssignment = () => {
    const parsed = assignmentForm.validate()
    if (!parsed) return
    store.addAssignment(parsed)
    open.value = null
    announce('Asignación registrada')
  }
  const submitHours = () => {
    const parsed = hoursForm.validate()
    if (!parsed) return
    store.addTimeEntry(parsed)
    open.value = null
    announce('Horas registradas')
  }
  const submitPayment = () => {
    const parsed = paymentForm.validate()
    if (!parsed) return
    store.addPayment(parsed)
    open.value = null
    announce('Pago registrado')
  }

  // Equivalente en COP del pago que se está escribiendo (TRM manual por ahora).
  const copPreview = computed(() => {
    const amount = Number(paymentForm.values.amountUsd)
    const trm = Number(paymentForm.values.trm)
    return amount > 0 && trm > 0 ? cop(amount * trm) : ''
  })

  const assignmentRows = computed(() =>
    data.value.assignments.map(item => ({
      id: item.id,
      member: store.memberName(item.memberId),
      project: store.projectName(item.projectId),
      agreed: item.agreedHours,
      used: data.value.timeEntries
        .filter(entry => entry.memberId === item.memberId && entry.projectId === item.projectId)
        .reduce((sum, entry) => sum + entry.hours, 0)
    }))
  )
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Panel privado"
      title="Equipo y pagos"
      description="Colaboradores, horas pactadas y cuánto debes pagarles. Todo en USD; la TRM del día queda guardada en cada pago."
    >
      <template #actions>
        <AdminButton :disabled="!canWrite" @click="openDialog('member')">
          Nuevo colaborador
        </AdminButton>
        <AdminButton
          :disabled="!canWrite || !data.team.length || !data.projects.length"
          @click="openDialog('assignment')"
        >
          Asignar a proyecto
        </AdminButton>
        <AdminButton
          :disabled="!canWrite || !data.team.length || !data.projects.length"
          @click="openDialog('hours')"
        >
          Registrar horas
        </AdminButton>
        <AdminButton
          variant="primary"
          :disabled="!canWrite || !data.team.length"
          @click="openDialog('payment')"
        >
          Registrar pago
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

    <div class="mb-6 rounded-2xl border border-brand-border bg-brand-surface-card p-5">
      <p class="text-sm text-brand-muted">Total por pagar al equipo</p>
      <p class="text-3xl font-semibold text-brand-ink">{{ usd(totalDue) }}</p>
    </div>

    <section aria-labelledby="team-heading">
      <h2 id="team-heading" class="mb-3 text-lg font-semibold text-brand-ink">Colaboradores</h2>
      <div
        v-if="balances.length"
        class="overflow-x-auto rounded-2xl border border-brand-border bg-brand-surface-card"
      >
        <table class="w-full min-w-[44rem] text-left text-sm">
          <caption class="sr-only">Saldo por colaborador</caption>
          <thead
            class="border-b border-brand-border bg-brand-surface-soft text-xs uppercase tracking-[0.08em] text-brand-muted"
          >
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Colaborador</th>
              <th scope="col" class="px-4 py-3 font-semibold">Tarifa</th>
              <th scope="col" class="px-4 py-3 font-semibold">Horas</th>
              <th scope="col" class="px-4 py-3 font-semibold">Causado</th>
              <th scope="col" class="px-4 py-3 font-semibold">Pagado</th>
              <th scope="col" class="px-4 py-3 font-semibold">Por pagar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-border">
            <tr v-for="row in balances" :key="row.member.id">
              <td class="px-4 py-3">
                <p class="font-medium text-brand-ink">{{ row.member.name }}</p>
                <p class="text-xs text-brand-muted">{{ row.member.role }}</p>
              </td>
              <td class="px-4 py-3 text-brand-muted">{{ usd(row.member.rateUsd) }}/h</td>
              <td class="px-4 py-3 text-brand-muted">{{ row.hours }}</td>
              <td class="px-4 py-3 text-brand-muted">{{ usd(row.earned) }}</td>
              <td class="px-4 py-3 text-brand-muted">{{ usd(row.paid) }}</td>
              <td
                class="px-4 py-3 font-semibold"
                :class="row.due > 0 ? 'text-brand-warning-text' : 'text-brand-success-text'"
              >
                {{ usd(row.due) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-sm text-brand-muted">Aún no hay colaboradores.</p>
    </section>

    <section class="mt-10" aria-labelledby="assign-heading">
      <h2 id="assign-heading" class="mb-3 text-lg font-semibold text-brand-ink">
        Horas pactadas por proyecto
      </h2>
      <ul v-if="assignmentRows.length" class="grid gap-3 sm:grid-cols-2">
        <li
          v-for="row in assignmentRows"
          :key="row.id"
          class="rounded-xl border border-brand-border bg-brand-surface-card p-4 text-sm"
        >
          <p class="font-medium text-brand-ink">{{ row.member }}</p>
          <p class="text-brand-muted">{{ row.project }}</p>
          <p
            class="mt-2 text-xs"
            :class="
              row.used > row.agreed ? 'font-semibold text-brand-error-text' : 'text-brand-muted'
            "
          >
            {{ row.used }} de {{ row.agreed }} h usadas{{
              row.used > row.agreed ? ' — excede lo pactado' : ''
            }}
          </p>
        </li>
      </ul>
      <p v-else class="text-sm text-brand-muted">Sin asignaciones todavía.</p>
    </section>

    <section class="mt-10" aria-labelledby="pay-heading">
      <h2 id="pay-heading" class="mb-3 text-lg font-semibold text-brand-ink">Pagos registrados</h2>
      <ul
        v-if="data.payments.length"
        class="divide-y divide-brand-border rounded-2xl border border-brand-border bg-brand-surface-card"
      >
        <li
          v-for="payment in data.payments"
          :key="payment.id"
          class="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
        >
          <span class="font-medium text-brand-ink">{{ store.memberName(payment.memberId) }}</span>
          <span class="text-brand-muted">
            {{ formatDate(payment.date) }} · TRM {{ payment.trm.toLocaleString('es-CO') }}
          </span>
          <span class="text-right">
            <span class="block font-semibold text-brand-ink">{{ usd(payment.amountUsd) }}</span>
            <span class="block text-xs text-brand-muted">
              {{ cop(payment.amountUsd * payment.trm) }}
            </span>
          </span>
        </li>
      </ul>
      <p v-else class="text-sm text-brand-muted">Sin pagos registrados.</p>
    </section>

    <AdminDialog :open="open === 'member'" title="Nuevo colaborador" @close="open = null">
      <form class="space-y-4" novalidate @submit.prevent="submitMember">
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminInput
            id="tm-name"
            v-model="memberForm.values.name"
            label="Nombre"
            required
            :error="memberForm.errors.value.name"
          />
          <AdminInput
            id="tm-role"
            v-model="memberForm.values.role"
            label="Rol"
            required
            :error="memberForm.errors.value.role"
          />
          <AdminInput
            id="tm-email"
            v-model="memberForm.values.email"
            label="Correo (opcional)"
            type="email"
            :error="memberForm.errors.value.email"
          />
          <AdminInput
            id="tm-rate"
            v-model="memberForm.values.rateUsd"
            label="Tarifa por hora (USD)"
            type="number"
            step="0.5"
            required
            :error="memberForm.errors.value.rateUsd"
          />
        </div>
        <AdminInput
          id="tm-resp"
          v-model="memberForm.values.responsibilities"
          label="Responsabilidades"
          type="textarea"
          :error="memberForm.errors.value.responsibilities"
        />
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="open = null">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Agregar colaborador</AdminButton>
        </div>
      </form>
    </AdminDialog>

    <AdminDialog
      :open="open === 'assignment'"
      title="Asignar a un proyecto"
      description="Define cuántas horas pactaste con esta persona para el proyecto."
      @close="open = null"
    >
      <form class="space-y-4" novalidate @submit.prevent="submitAssignment">
        <AdminInput
          id="as-member"
          v-model="assignmentForm.values.memberId"
          label="Colaborador"
          type="select"
          :options="memberOptions"
          required
          :error="assignmentForm.errors.value.memberId"
        />
        <AdminInput
          id="as-project"
          v-model="assignmentForm.values.projectId"
          label="Proyecto"
          type="select"
          :options="projectOptions"
          required
          :error="assignmentForm.errors.value.projectId"
        />
        <AdminInput
          id="as-hours"
          v-model="assignmentForm.values.agreedHours"
          label="Horas pactadas"
          type="number"
          required
          :error="assignmentForm.errors.value.agreedHours"
        />
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="open = null">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Asignar</AdminButton>
        </div>
      </form>
    </AdminDialog>

    <AdminDialog :open="open === 'hours'" title="Registrar horas" @close="open = null">
      <form class="space-y-4" novalidate @submit.prevent="submitHours">
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminInput
            id="ho-member"
            v-model="hoursForm.values.memberId"
            label="Colaborador"
            type="select"
            :options="memberOptions"
            required
            :error="hoursForm.errors.value.memberId"
          />
          <AdminInput
            id="ho-project"
            v-model="hoursForm.values.projectId"
            label="Proyecto"
            type="select"
            :options="projectOptions"
            required
            :error="hoursForm.errors.value.projectId"
          />
          <AdminInput
            id="ho-hours"
            v-model="hoursForm.values.hours"
            label="Horas"
            type="number"
            step="0.25"
            required
            :error="hoursForm.errors.value.hours"
          />
          <AdminInput
            id="ho-date"
            v-model="hoursForm.values.date"
            label="Fecha"
            type="date"
            required
            :error="hoursForm.errors.value.date"
          />
        </div>
        <AdminInput
          id="ho-note"
          v-model="hoursForm.values.note"
          label="Detalle (opcional)"
          :error="hoursForm.errors.value.note"
        />
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="open = null">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Registrar horas</AdminButton>
        </div>
      </form>
    </AdminDialog>

    <AdminDialog
      :open="open === 'payment'"
      title="Registrar pago"
      description="El monto se guarda en USD junto con la TRM del día del pago."
      @close="open = null"
    >
      <form class="space-y-4" novalidate @submit.prevent="submitPayment">
        <AdminInput
          id="pa-member"
          v-model="paymentForm.values.memberId"
          label="Colaborador"
          type="select"
          :options="memberOptions"
          required
          :error="paymentForm.errors.value.memberId"
        />
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminInput
            id="pa-amount"
            v-model="paymentForm.values.amountUsd"
            label="Monto (USD)"
            type="number"
            step="0.01"
            required
            :error="paymentForm.errors.value.amountUsd"
          />
          <AdminInput
            id="pa-trm"
            v-model="paymentForm.values.trm"
            label="TRM del día (COP por USD)"
            type="number"
            step="0.01"
            required
            hint="Por ahora se escribe a mano; luego se traerá automáticamente."
            :error="paymentForm.errors.value.trm"
          />
          <AdminInput
            id="pa-date"
            v-model="paymentForm.values.date"
            label="Fecha"
            type="date"
            required
            :error="paymentForm.errors.value.date"
          />
        </div>
        <p
          v-if="copPreview"
          class="rounded-xl bg-brand-surface-soft p-3 text-sm text-brand-muted"
          role="status"
        >
          Equivale a
          <strong class="text-brand-ink">{{ copPreview }}</strong>
        </p>
        <AdminInput
          id="pa-note"
          v-model="paymentForm.values.note"
          label="Nota (opcional)"
          :error="paymentForm.errors.value.note"
        />
        <div class="flex justify-end gap-3 pt-2">
          <AdminButton @click="open = null">Cancelar</AdminButton>
          <AdminButton type="submit" variant="primary">Registrar pago</AdminButton>
        </div>
      </form>
    </AdminDialog>
  </div>
</template>
