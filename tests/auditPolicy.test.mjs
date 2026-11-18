import assert from 'node:assert/strict'
import test from 'node:test'
import { advisoryId, evaluate } from '../scripts/audit.mjs'

const advisory = (id, severity = 'high', name = 'paquete') => ({
  name,
  severity,
  title: `Aviso ${id}`,
  url: `https://github.com/advisories/${id}`,
  source: 1
})

// Informe mínimo con la forma de `npm audit --json`: una cadena de dependencias que arrastra un aviso.
const report = (...advisories) => ({
  vulnerabilities: {
    raiz: { via: advisories },
    intermedio: { via: ['raiz'] }
  }
})

const rule = (id, expires) => ({ id, package: 'paquete', reason: 'motivo', expires })
const now = new Date('2026-11-17')

test('extrae el identificador GHSA de la URL', () => {
  assert.equal(
    advisoryId('https://github.com/advisories/GHSA-fc5q-39xc-vjpf'),
    'GHSA-fc5q-39xc-vjpf'
  )
  assert.equal(advisoryId(undefined), undefined)
})

test('un aviso alto sin excepción bloquea', () => {
  const result = evaluate(report(advisory('GHSA-aaaa-bbbb-cccc')), [], now)
  assert.equal(result.blocking.length, 1)
})

test('los avisos moderados o bajos no bloquean', () => {
  const result = evaluate(report(advisory('GHSA-aaaa-bbbb-cccc', 'moderate')), [], now)
  assert.deepEqual(result.blocking, [])
})

test('un aviso con excepción vigente se acepta y no bloquea', () => {
  const result = evaluate(
    report(advisory('GHSA-aaaa-bbbb-cccc')),
    [rule('GHSA-aaaa-bbbb-cccc', '2026-12-15')],
    now
  )
  assert.equal(result.accepted.length, 1)
  assert.deepEqual(result.blocking, [])
  assert.deepEqual(result.expired, [])
})

test('una excepción vencida vuelve a bloquear', () => {
  const result = evaluate(
    report(advisory('GHSA-aaaa-bbbb-cccc')),
    [rule('GHSA-aaaa-bbbb-cccc', '2026-11-01')],
    now
  )
  assert.equal(result.expired.length, 1)
  assert.deepEqual(result.accepted, [])
})

test('una excepción de un aviso no cubre otro aviso distinto', () => {
  const result = evaluate(
    report(advisory('GHSA-aaaa-bbbb-cccc'), advisory('GHSA-zzzz-yyyy-xxxx')),
    [rule('GHSA-aaaa-bbbb-cccc', '2026-12-15')],
    now
  )
  assert.equal(result.accepted.length, 1)
  assert.deepEqual(
    result.blocking.map(item => item.id),
    ['GHSA-zzzz-yyyy-xxxx']
  )
})

test('cuenta cada aviso una sola vez aunque lo arrastren varias dependencias', () => {
  const duplicated = {
    vulnerabilities: {
      a: { via: [advisory('GHSA-aaaa-bbbb-cccc')] },
      b: { via: [advisory('GHSA-aaaa-bbbb-cccc')] }
    }
  }
  assert.equal(evaluate(duplicated, [], now).blocking.length, 1)
})

test('señala las excepciones que ya no hacen falta', () => {
  const result = evaluate(report(), [rule('GHSA-aaaa-bbbb-cccc', '2026-12-15')], now)
  assert.equal(result.unused.length, 1)
})
