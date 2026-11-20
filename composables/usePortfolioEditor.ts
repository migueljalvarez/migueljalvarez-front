import { toAdminApiError } from '~/utils/adminApiError'
import {
  buildCreatePayload,
  buildUpdatePayload,
  emptyPortfolioForm,
  formFromRecord,
  hasPortfolioChanges,
  planGalleryChanges,
  suggestSlug,
  validatePortfolioForm,
  type PortfolioDetailRecord,
  type PortfolioEntryRecord,
  type PortfolioErrors,
  type PortfolioFormValues,
  type PortfolioMediaRecord
} from '~/utils/admin/portfolio'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

/** Mensaje de una sola lectura que sobrevive a una navegación (p. ej. "Proyecto creado"). */
export const usePortfolioFlash = () => useState<string>('admin-portfolio-flash', () => '')

/**
 * Estado y acciones del editor de portafolio: formulario, validación, cambios sin guardar, guardado
 * (ficha + galería, solo lo que cambió) y eliminación. Todo el acceso a datos pasa por `useAdminApi`.
 * Sin ficha inicial (`initial = null`) crea una nueva; con ficha, la edita.
 */
export const usePortfolioEditor = (initial: PortfolioDetailRecord | null) => {
  const api = useAdminApi()
  const { status, announce } = useAdminStatus()
  const flash = usePortfolioFlash()

  // Última versión conocida en la API (se va actualizando a medida que cada operación sale bien).
  const record = ref<PortfolioDetailRecord | null>(initial ? clone(initial) : null)
  const savedForm = computed<PortfolioFormValues>(() =>
    record.value ? formFromRecord(record.value) : emptyPortfolioForm()
  )
  const values = ref<PortfolioFormValues>(clone(savedForm.value))

  const submitted = ref(false)
  const touched = reactive(new Set<string>())
  const serverErrors = ref<PortfolioErrors>({})
  const saveError = ref('')
  const isSaving = ref(false)
  const leaving = ref(false)

  const isNew = computed(() => !record.value)
  const isDirty = computed(
    () => !leaving.value && hasPortfolioChanges(savedForm.value, values.value)
  )
  const validation = computed(() => validatePortfolioForm(values.value))

  // Un error se ve al salir del campo o, tras intentar guardar, en todos. Los de la API van aparte.
  const errors = computed<PortfolioErrors>(() => {
    const visible: PortfolioErrors = {}
    for (const [key, message] of Object.entries(validation.value.errors)) {
      if (submitted.value || touched.has(key.split('.')[0] as string)) visible[key] = message
    }
    return { ...visible, ...serverErrors.value }
  })
  const touch = (field: string) => touched.add(field)

  // La dirección pública se sugiere desde el título mientras no se haya escrito a mano (solo al crear).
  const slugManual = ref(!!initial)
  watch(
    () => values.value.title,
    title => {
      if (!slugManual.value) values.value.slug = suggestSlug(title)
    }
  )
  const onSlugInput = (value: string) => {
    values.value.slug = value
    slugManual.value = value.trim() !== ''
    delete serverErrors.value.slug
  }

  const discard = () => {
    values.value = clone(savedForm.value)
    submitted.value = false
    touched.clear()
    serverErrors.value = {}
    saveError.value = ''
    slugManual.value = !!record.value
  }

  /** Resultado: `invalid` (hay errores en pantalla), `failed` (la API no pudo), `saved` o `created`. */
  const save = async (): Promise<'invalid' | 'failed' | 'saved' | 'created'> => {
    submitted.value = true
    saveError.value = ''
    serverErrors.value = {}
    const result = validation.value
    if (!result.valid) {
      saveError.value = 'Revisa los campos marcados en rojo antes de guardar.'
      return 'invalid'
    }

    isSaving.value = true
    let appliedSomething = false
    try {
      if (!record.value) {
        const created = await api.post<PortfolioEntryRecord>(
          'portfolio',
          buildCreatePayload(result.values)
        )
        record.value = { ...created, media: [] }
        values.value = clone(savedForm.value)
        flash.value = 'Proyecto creado como borrador. Ahora puedes añadir la galería y publicarlo.'
        return 'created'
      }

      const current = record.value
      const payload = buildUpdatePayload(savedForm.value, result.values)
      if (Object.keys(payload).length) {
        record.value = await api.patch<PortfolioDetailRecord>(`portfolio/${current.id}`, payload)
        appliedSomething = true
      }

      const base = `portfolio/${current.id}/media`
      const plan = planGalleryChanges(record.value.media, result.values.gallery)
      for (const mediaId of plan.remove) {
        await api.del(`${base}/${mediaId}`)
        record.value.media = record.value.media.filter(item => item.id !== mediaId)
        appliedSomething = true
      }
      for (const update of plan.update) {
        const updated = await api.patch<PortfolioMediaRecord>(
          `${base}/${update.id}`,
          update.changes
        )
        record.value.media = record.value.media.map(item =>
          item.id === update.id ? updated : item
        )
        appliedSomething = true
      }
      for (const create of plan.create) {
        const added = await api.post<PortfolioMediaRecord>(base, create.body)
        record.value.media = [...record.value.media, added]
        const draft = values.value.gallery[create.index]
        if (draft) draft.id = added.id
        appliedSomething = true
      }

      values.value = clone(savedForm.value)
      submitted.value = false
      touched.clear()
      announce('Cambios guardados.')
      return 'saved'
    } catch (error) {
      const apiError = toAdminApiError(error)
      if (apiError.status === 409 && /slug/i.test(apiError.message)) {
        serverErrors.value = { slug: 'Ya hay un proyecto con esta dirección. Elige otra.' }
        saveError.value = 'Revisa los campos marcados en rojo antes de guardar.'
      } else {
        saveError.value = appliedSomething
          ? `${apiError.message} Lo que ya se había guardado se conserva; lo demás sigue en pantalla.`
          : apiError.message
      }
      return 'failed'
    } finally {
      isSaving.value = false
    }
  }

  // --- Eliminar (borra también la galería: la API lo hace en cascada)
  const isRemoving = ref(false)
  const removeError = ref('')
  const remove = async (): Promise<boolean> => {
    const current = record.value
    if (!current) return false
    isRemoving.value = true
    removeError.value = ''
    try {
      await api.del(`portfolio/${current.id}`)
      leaving.value = true
      flash.value = `Proyecto «${current.title}» eliminado.`
      return true
    } catch (error) {
      removeError.value = toAdminApiError(error).message
      return false
    } finally {
      isRemoving.value = false
    }
  }

  return {
    validation,
    record,
    savedForm,
    values,
    errors,
    isNew,
    isDirty,
    isSaving,
    saveError,
    status,
    isRemoving,
    removeError,
    touch,
    onSlugInput,
    discard,
    save,
    remove,
    announce,
    flash,
    allowLeave: () => {
      leaving.value = true
    }
  }
}
