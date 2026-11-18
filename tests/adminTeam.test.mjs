import assert from 'node:assert/strict'
import test from 'node:test'
import {
  assignmentProgress,
  assignmentsOfMember,
  copFromUsd,
  emptyAssignmentForm,
  emptyMemberForm,
  emptyPaymentForm,
  emptyTimeEntryForm,
  emptyTrmForm,
  findAssignment,
  formatHours,
  localToday,
  memberFormFromRecord,
  memberNameOf,
  memberStatusBadge,
  projectNameOf,
  projectedUsage,
  totalDue,
  validateAssignmentForm,
  validateAssignmentHours,
  validateMemberForm,
  validatePaymentForm,
  validateTimeEntryForm,
  validateTrmForm
} from '../utils/admin/team.ts'

const member = (over = {}) => ({
  id: 'm1',
  name: 'Laura Gómez',
  email: 'laura@correo.co',
  role: 'Diseñadora',
  responsibilities: '',
  rateUsd: 18.5,
  active: true,
  hours: 10,
  earnedUsd: 185,
  paidUsd: 100,
  dueUsd: 85,
  createdAt: '',
  updatedAt: '',
  ...over
})

const assignment = (over = {}) => ({
  id: 'a1',
  memberId: 'm1',
  projectId: 'p1',
  agreedHours: 20,
  usedHours: 15,
  exceeded: false,
  createdAt: '',
  ...over
})

// --- Colaboradores ------------------------------------------------------------------------------

test('el colaborador exige nombre, rol y una tarifa mayor que 0', () => {
  const empty = validateMemberForm(emptyMemberForm())
  assert.equal(empty.ok, false)
  assert.ok(empty.errors.name && empty.errors.role && empty.errors.rateUsd)

  const ok = validateMemberForm({
    ...emptyMemberForm(),
    name: '  Laura  ',
    role: 'Diseñadora',
    rateUsd: '18.5'
  })
  assert.equal(ok.ok, true)
  assert.equal(ok.data.name, 'Laura')
  assert.equal(ok.data.rateUsd, 18.5)
  assert.equal(ok.data.active, true)
})

test('el colaborador respeta los topes de la API (tarifa, decimales, correo, largos)', () => {
  const base = { ...emptyMemberForm(), name: 'Laura', role: 'Dev', rateUsd: '20' }
  assert.equal(validateMemberForm({ ...base, rateUsd: '0' }).ok, false)
  assert.equal(validateMemberForm({ ...base, rateUsd: '-3' }).ok, false)
  assert.equal(validateMemberForm({ ...base, rateUsd: '10.999' }).ok, false)
  assert.equal(validateMemberForm({ ...base, rateUsd: '99999999.99' }).ok, true)
  assert.equal(validateMemberForm({ ...base, rateUsd: '100000000' }).ok, false)
  assert.equal(validateMemberForm({ ...base, name: 'x'.repeat(101) }).ok, false)
  assert.equal(validateMemberForm({ ...base, responsibilities: 'x'.repeat(1001) }).ok, false)
  assert.equal(validateMemberForm({ ...base, email: '' }).ok, true)
  const badEmail = validateMemberForm({ ...base, email: 'no-es-correo' })
  assert.equal(badEmail.ok, false)
  assert.match(badEmail.errors.email, /correo/i)
})

test('memberFormFromRecord copia lo editable y el estado activo', () => {
  const form = memberFormFromRecord(member({ active: false }))
  assert.equal(form.rateUsd, '18.5')
  assert.equal(form.active, false)
})

test('la etiqueta de estado del colaborador siempre lleva texto', () => {
  assert.deepEqual(memberStatusBadge({ active: true }), { label: 'Activo', tone: 'success' })
  assert.deepEqual(memberStatusBadge({ active: false }), { label: 'Inactivo', tone: 'neutral' })
})

// --- Asignaciones -------------------------------------------------------------------------------

test('la asignación exige persona, proyecto y horas > 0 (hasta 999999.99)', () => {
  assert.equal(validateAssignmentForm(emptyAssignmentForm()).ok, false)
  const base = { memberId: 'm1', projectId: 'p1', agreedHours: '40' }
  assert.equal(validateAssignmentForm(base).ok, true)
  assert.equal(validateAssignmentForm({ ...base, agreedHours: '0' }).ok, false)
  assert.equal(validateAssignmentForm({ ...base, agreedHours: '999999.99' }).ok, true)
  assert.equal(validateAssignmentForm({ ...base, agreedHours: '1000000' }).ok, false)
  assert.equal(validateAssignmentForm({ ...base, agreedHours: '1.234' }).ok, false)
})

test('editar una asignación solo valida las horas pactadas', () => {
  assert.equal(validateAssignmentHours({ agreedHours: '12.5' }).data.agreedHours, 12.5)
  assert.equal(validateAssignmentHours({ agreedHours: '' }).ok, false)
})

test('assignmentProgress respeta el exceso que calcula la API', () => {
  assert.equal(assignmentProgress(assignment()).over, false)
  const over = assignmentProgress(assignment({ usedHours: 25, exceeded: true }))
  assert.equal(over.over, true)
  assert.equal(over.percent, 125)
  assert.equal(over.bar, 100)
})

test('projectedUsage avisa si las horas nuevas superan lo pactado', () => {
  const current = assignment({ usedHours: 15, agreedHours: 20 })
  assert.deepEqual(projectedUsage(current, 4), { used: 19, agreed: 20, exceeds: false })
  assert.deepEqual(projectedUsage(current, 5), { used: 20, agreed: 20, exceeds: false })
  assert.deepEqual(projectedUsage(current, 5.5), { used: 20.5, agreed: 20, exceeds: true })
  assert.equal(projectedUsage(undefined, 3), null)
  assert.equal(projectedUsage(current, Number.NaN), null)
  assert.equal(projectedUsage(current, 0), null)
})

test('findAssignment y assignmentsOfMember buscan por persona y proyecto', () => {
  const list = [
    assignment(),
    assignment({ id: 'a2', projectId: 'p2' }),
    assignment({ id: 'a3', memberId: 'm2' })
  ]
  assert.equal(findAssignment(list, 'm1', 'p2').id, 'a2')
  assert.equal(findAssignment(list, 'm2', 'p2'), undefined)
  assert.equal(assignmentsOfMember(list, 'm1').length, 2)
})

// --- Horas --------------------------------------------------------------------------------------

test('las horas exigen persona, proyecto, fecha real y entre 0 y 24 h', () => {
  assert.equal(validateTimeEntryForm(emptyTimeEntryForm('2026-11-18')).ok, false)
  const base = {
    memberId: 'm1',
    projectId: 'p1',
    hours: '3.5',
    workDate: '2026-11-18',
    note: ' Maquetación '
  }
  const ok = validateTimeEntryForm(base)
  assert.equal(ok.ok, true)
  assert.equal(ok.data.hours, 3.5)
  assert.equal(ok.data.note, 'Maquetación')
  assert.equal(validateTimeEntryForm({ ...base, hours: '24' }).ok, true)
  assert.equal(validateTimeEntryForm({ ...base, hours: '24.01' }).ok, false)
  assert.equal(validateTimeEntryForm({ ...base, hours: '0' }).ok, false)
  assert.equal(validateTimeEntryForm({ ...base, hours: '1.255' }).ok, false)
  assert.equal(validateTimeEntryForm({ ...base, workDate: '2026-02-30' }).ok, false)
  assert.equal(validateTimeEntryForm({ ...base, workDate: '18/11/2026' }).ok, false)
  assert.equal(validateTimeEntryForm({ ...base, note: 'x'.repeat(301) }).ok, false)
})

// --- Pagos y TRM --------------------------------------------------------------------------------

test('el pago exige persona, monto y fecha; la TRM es opcional pero válida si se escribe', () => {
  assert.equal(validatePaymentForm(emptyPaymentForm('2026-11-18', null)).ok, false)
  const base = { memberId: 'm1', amountUsd: '120.50', paidOn: '2026-11-18', trm: '', note: '' }

  const withoutTrm = validatePaymentForm(base)
  assert.equal(withoutTrm.ok, true)
  assert.equal(withoutTrm.data.amountUsd, 120.5)
  assert.equal(withoutTrm.data.trm, undefined)

  const withTrm = validatePaymentForm({ ...base, trm: '4150.25' })
  assert.equal(withTrm.data.trm, 4150.25)

  assert.equal(validatePaymentForm({ ...base, trm: '0' }).ok, false)
  assert.equal(validatePaymentForm({ ...base, trm: '1000001' }).ok, false)
  assert.equal(validatePaymentForm({ ...base, trm: 'abc' }).ok, false)
  assert.equal(validatePaymentForm({ ...base, amountUsd: '1000000000' }).ok, true)
  assert.equal(validatePaymentForm({ ...base, amountUsd: '1000000000.01' }).ok, false)
  assert.equal(validatePaymentForm({ ...base, amountUsd: '0' }).ok, false)
  assert.equal(validatePaymentForm({ ...base, paidOn: '2026-13-01' }).ok, false)
})

test('el formulario del pago arranca con la TRM vigente (si la hay)', () => {
  const trm = { rateDate: '2026-11-17', copPerUsd: 4100.5, source: 'manual' }
  assert.equal(emptyPaymentForm('2026-11-18', trm).trm, '4100.5')
  assert.equal(emptyPaymentForm('2026-11-18', null).trm, '')
})

test('la TRM exige fecha real y un valor entre 0 y 1.000.000', () => {
  assert.equal(validateTrmForm(emptyTrmForm('2026-11-18', null)).ok, false)
  const ok = validateTrmForm({ rateDate: '2026-11-18', copPerUsd: '4123.45' })
  assert.equal(ok.ok, true)
  assert.deepEqual(ok.data, { rateDate: '2026-11-18', copPerUsd: 4123.45 })
  assert.equal(validateTrmForm({ rateDate: '2026-11-18', copPerUsd: '1000000' }).ok, true)
  assert.equal(validateTrmForm({ rateDate: '2026-11-18', copPerUsd: '1000001' }).ok, false)
  assert.equal(validateTrmForm({ rateDate: 'hoy', copPerUsd: '4000' }).ok, false)
})

test('copFromUsd redondea a pesos como la base', () => {
  assert.equal(copFromUsd(100, 4100.5), 410050)
  assert.equal(copFromUsd(0.01, 4100.5), 41)
  assert.equal(copFromUsd(33.33, 4123.45), 137_435)
})

// --- Presentación -------------------------------------------------------------------------------

test('totalDue suma los saldos sin arrastrar decimales de coma flotante', () => {
  assert.equal(totalDue([]), 0)
  assert.equal(totalDue([member({ dueUsd: 0.1 }), member({ id: 'm2', dueUsd: 0.2 })]), 0.3)
  assert.equal(totalDue([member({ dueUsd: 85 }), member({ id: 'm2', dueUsd: 0 })]), 85)
})

test('los nombres se resuelven por id y caen a una raya si no están', () => {
  assert.equal(memberNameOf([member()], 'm1'), 'Laura Gómez')
  assert.equal(memberNameOf([member()], 'zz'), '—')
  assert.equal(projectNameOf([{ id: 'p1', name: 'Tienda' }], 'p1'), 'Tienda')
  assert.equal(projectNameOf([], 'p1'), '—')
})

test('localToday usa la fecha local, no la de UTC', () => {
  // 23:30 hora local: la fecha local sigue siendo ese día aunque en UTC ya sea el siguiente.
  assert.equal(localToday(new Date(2026, 10, 18, 23, 30)), '2026-11-18')
  assert.equal(localToday(new Date(2026, 0, 5, 0, 5)), '2026-01-05')
})

test('formatHours muestra hasta 2 decimales', () => {
  assert.match(formatHours(12.5), /^12[,.]5$/)
  assert.equal(formatHours(8), '8')
})
