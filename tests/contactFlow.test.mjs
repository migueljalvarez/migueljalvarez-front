import assert from 'node:assert/strict'
import test from 'node:test'
import { processContact } from '../server/utils/contactFlow.ts'

const calls = () => {
  const order = []
  return {
    order,
    sendEmailOk: async () => void order.push('email'),
    sendEmailFail: async () => {
      order.push('email')
      throw new Error('Resend caído')
    },
    saveLead: outcome => async () => {
      order.push('lead')
      return outcome
    }
  }
}

test('envía primero el correo y después guarda el lead', async () => {
  const c = calls()
  const result = await processContact({ sendEmail: c.sendEmailOk, saveLead: c.saveLead('saved') })
  assert.deepEqual(c.order, ['email', 'lead'])
  assert.deepEqual(result, { emailSent: true, lead: 'saved' })
})

test('correo enviado y API caída: sigue siendo éxito (el mensaje llegó por correo)', async () => {
  for (const outcome of ['failed', 'rejected', 'not-configured']) {
    const c = calls()
    const result = await processContact({ sendEmail: c.sendEmailOk, saveLead: c.saveLead(outcome) })
    assert.deepEqual(result, { emailSent: true, lead: outcome })
  }
})

test('correo caído pero lead guardado: también es éxito (el mensaje quedó en el panel)', async () => {
  for (const outcome of ['saved', 'duplicate']) {
    const c = calls()
    const result = await processContact({
      sendEmail: c.sendEmailFail,
      saveLead: c.saveLead(outcome)
    })
    assert.deepEqual(result, { emailSent: false, lead: outcome })
  }
})

test('si fallan los dos canales se devuelve el error (no se puede perder el contacto en silencio)', async () => {
  for (const outcome of ['failed', 'rejected', 'not-configured']) {
    const c = calls()
    await assert.rejects(
      processContact({ sendEmail: c.sendEmailFail, saveLead: c.saveLead(outcome) }),
      /Resend caído/
    )
  }
})

test('intenta guardar el lead aunque el correo falle', async () => {
  const c = calls()
  await processContact({ sendEmail: c.sendEmailFail, saveLead: c.saveLead('saved') })
  assert.deepEqual(c.order, ['email', 'lead'])
})

test('un error que no es Error se convierte en uno', async () => {
  await assert.rejects(
    processContact({
      sendEmail: async () => {
        throw 'texto'
      },
      saveLead: async () => 'failed'
    }),
    /No se pudo capturar el mensaje/
  )
})
