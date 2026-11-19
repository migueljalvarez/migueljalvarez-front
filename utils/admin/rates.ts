import { z } from 'zod'
import { zodErrors } from './schemas.ts'

export const RATE_LIMITS = { service: 120, rateUsd: 99_999_999.99 } as const

export type RateRecord = {
  id: string
  service: string
  rateUsd: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export const rateSchema = z.object({
  service: z
    .string()
    .trim()
    .min(1, 'Obligatorio')
    .max(RATE_LIMITS.service, 'Máximo 120 caracteres'),
  rateUsd: z.coerce
    .number({ message: 'Ingresa un número' })
    .positive('La tarifa debe ser mayor que 0')
    .max(RATE_LIMITS.rateUsd, 'Valor demasiado alto')
    .refine(value => Math.abs(Math.round(value * 100) / 100 - value) < 1e-9, 'Máximo 2 decimales'),
  isPublic: z.boolean()
})

export type RatePayload = z.infer<typeof rateSchema>
export type RateFormValues = { service: string; rateUsd: string; isPublic: boolean }

export const emptyRateForm = (): RateFormValues => ({ service: '', rateUsd: '', isPublic: false })

export const rateFormFromRecord = (rate: RateRecord): RateFormValues => ({
  service: rate.service,
  rateUsd: String(rate.rateUsd),
  isPublic: rate.isPublic
})

export const validateRateForm = (values: RateFormValues) => {
  const result = rateSchema.safeParse(values)
  return result.success
    ? { ok: true as const, data: result.data }
    : { ok: false as const, errors: zodErrors(result.error) }
}
