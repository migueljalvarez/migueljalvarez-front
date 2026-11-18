import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildActionPayload,
  buildStagePayload,
  countLeads,
  emptyLeadForm,
  filterLeads,
  formatLeadDate,
  formatLeadDay,
  leadFormFromRecord,
  leadStatusBadge,
  validateLeadForm,
  validateNote
} from '../utils/admin/leads.ts'
import {
  clientNameOf,
  deadlineInfo,
  emptyClientForm,
  emptyProjectForm,
  filterProjects,
  hoursProgress,
  projectFormFromRecord,
  projectStatusBadge,
  validateClientForm,
  validateProjectForm
} from '../utils/admin/projects.ts'

const lead = (over = {}) => ({
  id: 'l1',
  name: 'Ana Pérez',
  email: 'ana@correo.co',
  phone: '300 000 0000',
  subject: 'desarrollo',
  origin: 'formulario',
  status: 'nuevo',
  message: 'Necesito una web',
  lostReason: '',
  nextAction: '',
  nextActionDate: '',
  consentAt: null,
  consentPolicyVersion: null,
  clientId: null,
  createdAt: '2026-11-16T15:00:00.000Z',
  updatedAt: '2026-11-16T15:00:00.000Z',
  ...over
})

const project = (over = {}) => ({
  id: 'p1',
  clientId: 'c1',
  name: 'Tienda',
  status: 'en-curso',
  rateUsd: 30,
  budgetHours: 80,
  startDate: '2026-10-15',
  deadline: '2026-12-10',
  publishable: false,
  usedHours: 20,
  usedPercent: 25,
  createdAt: '',
  updatedAt: '',
  ...over
})

// --- Leads ------------------------------------------------------------------------------------

test('el formulario de lead exige nombre, correo válido, asunto y origen', () => {
  const empty = validateLeadForm(emptyLeadForm())
  assert.equal(empty.ok, false)
  assert.ok(empty.errors.name && empty.errors.email && empty.errors.subject)

  const bad = validateLeadForm({
    ...emptyLeadForm(),
    name: 'Ana',
    email: 'no-es-correo',
    subject: 'otro'
  })
  assert.equal(bad.ok, false)
  assert.match(bad.errors.email, /correo/i)

  const ok = validateLeadForm({
    ...emptyLeadForm(),
    name: '  Ana  ',
    email: 'ana@correo.co',
    subject: 'consulta'
  })
  assert.equal(ok.ok, true)
  assert.equal(ok.data.name, 'Ana')
})

test('el lead respeta los límites y el formato de fecha de la API', () => {
  const base = { ...emptyLeadForm(), name: 'Ana', email: 'ana@correo.co', subject: 'otro' }
  assert.equal(validateLeadForm({ ...base, name: 'x'.repeat(101) }).ok, false)
  assert.equal(validateLeadForm({ ...base, phone: '1'.repeat(31) }).ok, false)
  assert.equal(validateLeadForm({ ...base, nextActionDate: '18/11/2026' }).ok, false)
  assert.equal(validateLeadForm({ ...base, nextActionDate: '2026-11-18' }).ok, true)
})

test('leadFormFromRecord copia los datos editables', () => {
  assert.equal(leadFormFromRecord(lead()).email, 'ana@correo.co')
})

test('cambiar a perdido exige motivo y las demás etapas lo limpian', () => {
  assert.equal(buildStagePayload('perdido', '   ').ok, false)
  assert.deepEqual(buildStagePayload('perdido', ' Sin presupuesto ').data, {
    status: 'perdido',
    lostReason: 'Sin presupuesto'
  })
  assert.deepEqual(buildStagePayload('contactado', 'viejo motivo').data, {
    status: 'contactado',
    lostReason: ''
  })
  assert.equal(buildStagePayload('perdido', 'x'.repeat(501)).ok, false)
})

test('la próxima acción valida largo y fecha, y permite vaciarla', () => {
  assert.deepEqual(buildActionPayload('  Llamar ', '2026-11-20').data, {
    nextAction: 'Llamar',
    nextActionDate: '2026-11-20'
  })
  assert.deepEqual(buildActionPayload('', '').data, { nextAction: '', nextActionDate: '' })
  assert.equal(buildActionPayload('x'.repeat(201), '').ok, false)
  assert.equal(buildActionPayload('Llamar', 'mañana').ok, false)
})

test('las notas no pueden ir vacías ni pasar de 2000 caracteres', () => {
  assert.equal(validateNote('   ').ok, false)
  assert.equal(validateNote('x'.repeat(2001)).ok, false)
  assert.equal(validateNote('  Hola ').text, 'Hola')
})

test('filterLeads filtra por etapa y busca sin distinguir tildes ni mayúsculas', () => {
  const leads = [
    lead({ id: '1', name: 'José Ñandú', status: 'nuevo' }),
    lead({ id: '2', name: 'Laura', email: 'laura@demo.co', status: 'ganado', subject: 'soporte' }),
    lead({ id: '3', name: 'Pedro', status: 'ganado' })
  ]
  assert.equal(filterLeads(leads, 'all', '').length, 3)
  assert.deepEqual(
    filterLeads(leads, 'ganado', '').map(item => item.id),
    ['2', '3']
  )
  assert.deepEqual(
    filterLeads(leads, 'all', 'jose nandu').map(item => item.id),
    ['1']
  )
  assert.deepEqual(
    filterLeads(leads, 'all', 'SOPORTE').map(item => item.id),
    ['2']
  )
  assert.deepEqual(filterLeads(leads, 'nuevo', 'laura'), [])
  assert.equal(countLeads(leads, 'ganado'), 2)
  assert.equal(countLeads(leads, 'all'), 3)
})

test('cada etapa tiene etiqueta de texto y un tono', () => {
  assert.deepEqual(leadStatusBadge('ganado'), { label: 'Ganado', tone: 'success' })
  assert.equal(leadStatusBadge('perdido').label, 'Perdido')
  assert.equal(leadStatusBadge('reunion').label, 'Reunión')
})

test('las fechas de leads se formatean en español y toleran vacíos', () => {
  assert.match(formatLeadDay('2026-11-18'), /18/)
  assert.equal(formatLeadDay(''), '—')
  assert.match(formatLeadDate('2026-11-16T03:00:00.000Z'), /15/) // 22:00 del 15 en Colombia
  assert.equal(formatLeadDate('no-fecha'), '—')
})

// --- Clientes y proyectos -----------------------------------------------------------------------

test('el cliente solo exige nombre; el correo es opcional pero válido', () => {
  assert.equal(validateClientForm(emptyClientForm()).ok, false)
  assert.equal(validateClientForm({ ...emptyClientForm(), name: 'Tienda' }).ok, true)
  const bad = validateClientForm({ ...emptyClientForm(), name: 'Tienda', email: 'x@' })
  assert.equal(bad.ok, false)
  assert.ok(bad.errors.email)
  assert.equal(validateClientForm({ ...emptyClientForm(), name: 'x'.repeat(121) }).ok, false)
})

const validProject = (over = {}) => ({
  ...emptyProjectForm('2026-11-18', 'c1'),
  name: 'Tienda',
  rateUsd: '30',
  budgetHours: '80',
  deadline: '2026-12-10',
  ...over
})

test('el proyecto convierte los montos a número y valida el contrato', () => {
  const ok = validateProjectForm(validProject())
  assert.equal(ok.ok, true)
  assert.equal(ok.data.rateUsd, 30)
  assert.equal(ok.data.budgetHours, 80)
  assert.equal(ok.data.publishable, false)

  assert.equal(validateProjectForm(validProject({ clientId: '' })).ok, false)
  assert.equal(validateProjectForm(validProject({ rateUsd: '0' })).ok, false)
  assert.equal(validateProjectForm(validProject({ rateUsd: '' })).ok, false)
  assert.equal(validateProjectForm(validProject({ rateUsd: '10.999' })).ok, false)
  assert.equal(validateProjectForm(validProject({ budgetHours: '1000000' })).ok, false)
  assert.equal(validateProjectForm(validProject({ status: 'otro' })).ok, false)
})

test('el deadline no puede ser anterior al inicio ni una fecha inexistente', () => {
  const early = validateProjectForm(validProject({ deadline: '2026-11-01' }))
  assert.equal(early.ok, false)
  assert.match(early.errors.deadline, /anterior/)
  assert.equal(validateProjectForm(validProject({ deadline: '2026-02-30' })).ok, false)
  assert.equal(validateProjectForm(validProject({ deadline: '2026-11-18' })).ok, true)
})

test('projectFormFromRecord devuelve los montos como texto editable', () => {
  const form = projectFormFromRecord(project({ rateUsd: 25.5 }))
  assert.equal(form.rateUsd, '25.5')
  assert.equal(validateProjectForm(form).ok, true)
})

test('deadlineInfo distingue entregado, vencido, cercano y en plazo', () => {
  const now = new Date('2026-11-18T12:00:00')
  assert.equal(deadlineInfo('2026-01-01', 'entregado', now).tone, 'success')
  assert.deepEqual(deadlineInfo('2026-11-10', 'en-curso', now), {
    text: 'Vencido hace 8 d',
    tone: 'danger'
  })
  assert.equal(deadlineInfo('2026-11-18', 'en-curso', now).text, 'Vence hoy')
  assert.deepEqual(deadlineInfo('2026-11-25', 'en-curso', now), {
    text: 'Faltan 7 d',
    tone: 'warning'
  })
  assert.equal(deadlineInfo('2026-12-30', 'planificado', now).tone, 'muted')
})

test('hoursProgress marca el exceso y limita la barra al 100 %', () => {
  assert.deepEqual(hoursProgress(20, 80), { percent: 25, bar: 25, over: false })
  assert.deepEqual(hoursProgress(100, 80), { percent: 125, bar: 100, over: true })
  assert.deepEqual(hoursProgress(5, 0), { percent: 0, bar: 0, over: false })
})

test('filtros y etiquetas de proyectos', () => {
  const list = [project({ id: 'a' }), project({ id: 'b', status: 'entregado' })]
  assert.equal(filterProjects(list, 'all').length, 2)
  assert.deepEqual(
    filterProjects(list, 'entregado').map(item => item.id),
    ['b']
  )
  assert.equal(projectStatusBadge('en-curso').label, 'En curso')
  assert.equal(clientNameOf([{ id: 'c1', name: 'Tienda' }], 'c1'), 'Tienda')
  assert.equal(clientNameOf([], 'zz'), '—')
})
