import assert from 'node:assert/strict'
import test from 'node:test'
import {
  SOCIAL_LINKS_MAX,
  draftsFromRecords,
  emptySocialDraft,
  hasSocialChanges,
  moveItem,
  nextPolicyOrder,
  policyFormSchema,
  socialSnapshot,
  toSocialPayload,
  validateSocialDraft,
  validateSocialLinks
} from '../utils/admin/siteContent.ts'

const draft = (key, over = {}) => ({
  key,
  name: 'GitHub',
  url: 'https://github.com/usuario',
  icon: 'mdi:github',
  visible: true,
  ...over
})

test('una red completa y correcta no tiene errores', () => {
  assert.deepEqual(validateSocialDraft(draft('a')), {})
  assert.deepEqual(validateSocialDraft(draft('a', { url: 'mailto:hola@dominio.co' })), {})
})

test('la URL solo admite https:// o mailto:', () => {
  for (const url of ['http://x.co', 'ftp://x.co', 'javascript:alert(1)', 'x.co', 'https://']) {
    assert.ok(validateSocialDraft(draft('a', { url })).url, url)
  }
})

test('el icono exige el formato prefijo:nombre en minúsculas', () => {
  for (const icon of ['github', 'MDI:github', 'mdi:', ':github', 'mdi:git hub']) {
    assert.ok(validateSocialDraft(draft('a', { icon })).icon, icon)
  }
  assert.equal(validateSocialDraft(draft('a', { icon: 'simple-icons:x' })).icon, undefined)
})

test('nombre obligatorio, con espacios recortados y límite de 60', () => {
  assert.ok(validateSocialDraft(draft('a', { name: '   ' })).name)
  assert.ok(validateSocialDraft(draft('a', { name: 'x'.repeat(61) })).name)
  assert.equal(validateSocialDraft(draft('a', { name: 'x'.repeat(60) })).name, undefined)
})

test('los nombres repetidos se marcan sin distinguir mayúsculas', () => {
  const result = validateSocialLinks([
    draft('a'),
    draft('b', { name: ' github ' }),
    draft('c', { name: 'X' })
  ])
  assert.equal(result.valid, false)
  assert.ok(result.errors.a?.name)
  assert.ok(result.errors.b?.name)
  assert.equal(result.errors.c, undefined)
})

test('más de 20 redes es un error de la lista', () => {
  const many = Array.from({ length: SOCIAL_LINKS_MAX + 1 }, (_, i) =>
    draft(`k${i}`, { name: `Red ${i}` })
  )
  assert.ok(validateSocialLinks(many).listError)
  assert.equal(validateSocialLinks(many.slice(0, SOCIAL_LINKS_MAX)).valid, true)
})

test('una fila nueva está vacía y no es válida hasta completarla', () => {
  const errors = validateSocialDraft(emptySocialDraft('n'))
  assert.ok(errors.name && errors.url && errors.icon)
})

test('moveItem sube, baja y respeta los extremos sin mutar', () => {
  const list = ['a', 'b', 'c']
  assert.deepEqual(moveItem(list, 2, 1), ['a', 'c', 'b'])
  assert.deepEqual(moveItem(list, 0, 1), ['b', 'a', 'c'])
  assert.deepEqual(moveItem(list, 0, -1), ['a', 'b', 'c'])
  assert.deepEqual(moveItem(list, 2, 3), ['a', 'b', 'c'])
  assert.deepEqual(list, ['a', 'b', 'c'])
})

test('la comparación de cambios ignora la clave de fila y detecta orden, texto y visibilidad', () => {
  const records = [
    {
      id: '1',
      name: 'GitHub',
      url: 'https://github.com/u',
      icon: 'mdi:github',
      visible: true,
      sortOrder: 1
    },
    {
      id: '2',
      name: 'X',
      url: 'https://x.com/u',
      icon: 'simple-icons:x',
      visible: false,
      sortOrder: 0
    }
  ]
  let seq = 0
  const drafts = draftsFromRecords(records, () => `k${++seq}`)
  assert.deepEqual(
    drafts.map(item => item.name),
    ['X', 'GitHub'],
    'ordena por sortOrder'
  )
  const saved = socialSnapshot(drafts)

  assert.equal(
    hasSocialChanges(
      saved,
      drafts.map(item => ({ ...item, key: `otra-${item.key}` }))
    ),
    false
  )
  assert.equal(hasSocialChanges(saved, moveItem(drafts, 0, 1)), true)
  assert.equal(
    hasSocialChanges(
      saved,
      drafts.map(item => ({ ...item, visible: !item.visible }))
    ),
    true
  )
  assert.equal(
    hasSocialChanges(
      saved,
      drafts.map(item => ({ ...item, name: `${item.name} ` }))
    ),
    false,
    'los espacios finales no cuentan'
  )
  assert.equal(hasSocialChanges(saved, drafts.slice(1)), true)
})

test('el cuerpo del PUT lleva items en el orden de la lista, recortados y sin la clave', () => {
  const payload = toSocialPayload([
    draft('a', { name: ' GitHub ', visible: false }),
    draft('b', { name: 'X' })
  ])
  assert.deepEqual(payload, {
    items: [
      { name: 'GitHub', url: 'https://github.com/usuario', icon: 'mdi:github', visible: false },
      { name: 'X', url: 'https://github.com/usuario', icon: 'mdi:github', visible: true }
    ]
  })
})

const policy = (over = {}) => ({
  title: 'Pagos',
  body: 'Texto',
  isPublic: true,
  sortOrder: '10',
  ...over
})

test('la política válida convierte el orden a entero', () => {
  const result = policyFormSchema.safeParse(policy())
  assert.equal(result.success, true)
  assert.equal(result.data.sortOrder, 10)
})

test('título hasta 120 y texto hasta 2000 caracteres, ambos obligatorios', () => {
  assert.equal(policyFormSchema.safeParse(policy({ title: '   ' })).success, false)
  assert.equal(policyFormSchema.safeParse(policy({ title: 'x'.repeat(121) })).success, false)
  assert.equal(policyFormSchema.safeParse(policy({ title: 'x'.repeat(120) })).success, true)
  assert.equal(policyFormSchema.safeParse(policy({ body: '' })).success, false)
  assert.equal(policyFormSchema.safeParse(policy({ body: 'x'.repeat(2001) })).success, false)
  assert.equal(policyFormSchema.safeParse(policy({ body: 'x'.repeat(2000) })).success, true)
})

test('el orden es un entero de 0 a 9999', () => {
  for (const value of ['', '-1', '1.5', '10000', 'abc']) {
    assert.equal(policyFormSchema.safeParse(policy({ sortOrder: value })).success, false, value)
  }
  for (const value of ['0', '9999', ' 7 ']) {
    assert.equal(policyFormSchema.safeParse(policy({ sortOrder: value })).success, true, value)
  }
})

test('el orden sugerido para una política nueva va al final y no pasa de 9999', () => {
  assert.equal(nextPolicyOrder([]), 0)
  assert.equal(nextPolicyOrder([{ sortOrder: 0 }, { sortOrder: 30 }]), 40)
  assert.equal(nextPolicyOrder([{ sortOrder: 9995 }]), 9999)
})
