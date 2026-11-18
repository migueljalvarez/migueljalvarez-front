import assert from 'node:assert/strict'
import test from 'node:test'
import { isLeadStored, saveLead } from '../server/utils/leadIntake.ts'

const payload = {
  name: 'Ana Prueba',
  email: 'ana@prueba.test',
  subject: 'consulta',
  message: 'Necesito una web',
  consent: true,
  consentPolicyVersion: '2026-11-16'
}

/** Cliente falso: responde con los estados indicados, uno por intento, y registra las llamadas. */
const fakeClient = (statuses, configured = true) => {
  const calls = []
  return {
    calls,
    configured,
    post: async (path, body, headers) => {
      calls.push({ path, body, headers })
      const status = statuses[Math.min(calls.length - 1, statuses.length - 1)]
      return { ok: status >= 200 && status < 300, status, data: null }
    }
  }
}
const noSleep = () => {
  const waits = []
  return { waits, sleep: async ms => void waits.push(ms) }
}

test('201: guarda el lead una sola vez, con la ruta, el cuerpo y la clave de ingreso', async () => {
  const client = fakeClient([201])
  const { sleep } = noSleep()
  assert.equal(await saveLead(client, payload, { intakeKey: 'clave-secreta', sleep }), 'saved')
  assert.equal(client.calls.length, 1)
  assert.equal(client.calls[0].path, '/api/intake/leads')
  assert.deepEqual(client.calls[0].body, payload)
  assert.equal(client.calls[0].headers['x-intake-key'], 'clave-secreta')
})

test('200: un reintento ya registrado cuenta como guardado (no duplica)', async () => {
  const outcome = await saveLead(fakeClient([200]), payload, {
    intakeKey: 'k',
    sleep: noSleep().sleep
  })
  assert.equal(outcome, 'duplicate')
  assert.equal(isLeadStored(outcome), true)
})

test('reintenta ante fallos transitorios (red, 5xx, 429) y termina guardando', async () => {
  for (const transient of [0, 500, 502, 503, 429]) {
    const client = fakeClient([transient, transient, 201])
    const { sleep } = noSleep()
    assert.equal(
      await saveLead(client, payload, { intakeKey: 'k', sleep }),
      'saved',
      `estado ${transient}`
    )
    assert.equal(client.calls.length, 3)
  }
})

test('espera cada vez más entre intentos (backoff exponencial) y no espera tras el último', async () => {
  const client = fakeClient([500])
  const { waits, sleep } = noSleep()
  assert.equal(
    await saveLead(client, payload, { intakeKey: 'k', attempts: 3, delayMs: 300, sleep }),
    'failed'
  )
  assert.equal(client.calls.length, 3)
  assert.deepEqual(waits, [300, 600])
})

test('un 4xx no se reintenta: la API rechazó los datos o la clave', async () => {
  for (const status of [400, 401, 403, 422]) {
    const client = fakeClient([status])
    const outcome = await saveLead(client, payload, { intakeKey: 'k', sleep: noSleep().sleep })
    assert.equal(outcome, 'rejected', `estado ${status}`)
    assert.equal(client.calls.length, 1)
    assert.equal(isLeadStored(outcome), false)
  }
})

test('sin API configurada o sin clave no intenta nada', async () => {
  const unconfigured = fakeClient([201], false)
  assert.equal(await saveLead(unconfigured, payload, { intakeKey: 'k' }), 'not-configured')
  const noKey = fakeClient([201])
  assert.equal(await saveLead(noKey, payload, { intakeKey: '' }), 'not-configured')
  assert.equal(unconfigured.calls.length + noKey.calls.length, 0)
})

test('el número de intentos es configurable', async () => {
  const client = fakeClient([503])
  await saveLead(client, payload, {
    intakeKey: 'k',
    attempts: 5,
    delayMs: 1,
    sleep: noSleep().sleep
  })
  assert.equal(client.calls.length, 5)
})
