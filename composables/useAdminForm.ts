import type { ZodType } from 'zod'
import { zodErrors } from '~/utils/admin/schemas'

/**
 * Formulario con validación Zod. `values` es reactivo; `validate()` devuelve los datos ya parseados
 * (con números y fechas normalizados) o `null` si hay errores, que quedan en `errors` por campo.
 */
export const useAdminForm = <T extends Record<string, unknown>, Out>(
  schema: ZodType<Out>,
  initial: () => T
) => {
  const values = reactive<T>(initial()) as T
  const errors = ref<Record<string, string>>({})

  const validate = (): Out | null => {
    const result = schema.safeParse(values)
    if (!result.success) {
      errors.value = zodErrors(result.error)
      return null
    }
    errors.value = {}
    return result.data
  }

  const reset = () => {
    Object.assign(values, initial())
    errors.value = {}
  }

  return { values, errors, validate, reset }
}
