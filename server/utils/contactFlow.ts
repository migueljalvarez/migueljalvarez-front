import { isLeadStored, type LeadIntakeOutcome } from './leadIntake.ts'

/**
 * Orquesta el envío del formulario de contacto: primero el correo y después el guardado del lead.
 * Éxito si AL MENOS UNO de los dos canales capturó el mensaje; solo si fallan ambos se devuelve error,
 * así un corte del proveedor de correo o de la API no pierde el contacto.
 */
export type ContactFlowResult = {
  emailSent: boolean
  lead: LeadIntakeOutcome
}

export const processContact = async (steps: {
  sendEmail: () => Promise<void>
  saveLead: () => Promise<LeadIntakeOutcome>
}): Promise<ContactFlowResult> => {
  let emailSent = true
  let emailError: unknown

  try {
    await steps.sendEmail()
  } catch (error) {
    emailSent = false
    emailError = error
  }

  // `saveLead` nunca lanza (devuelve un resultado), por lo que se ejecuta siempre.
  const lead = await steps.saveLead()

  if (!emailSent && !isLeadStored(lead)) {
    throw emailError instanceof Error ? emailError : new Error('No se pudo capturar el mensaje')
  }
  return { emailSent, lead }
}
