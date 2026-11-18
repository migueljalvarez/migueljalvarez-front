<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import SocialLinkRow from '~/components/admin/social/SocialLinkRow.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    SOCIAL_ICON_SUGGESTIONS,
    SOCIAL_LINKS_MAX,
    draftsFromRecords,
    emptySocialDraft,
    hasSocialChanges,
    moveItem,
    socialSnapshot,
    toSocialPayload,
    validateSocialLinks,
    type SocialLinkDraft,
    type SocialLinkRecord
  } from '~/utils/admin/siteContent'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Redes sociales | Panel', robots: 'noindex, nofollow' })

  const api = useAdminApi()
  const { status, announce } = useAdminStatus()

  // --- Carga (el error viaja dentro de los datos para que SSR y cliente muestren lo mismo).
  // Con `await` el servidor espera los datos antes de armar el borrador (los `watch` no corren en SSR);
  // en navegación del cliente no bloquea y se ve el esqueleto.
  type Loaded = { items: SocialLinkRecord[] | null; error: string }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-social-links', async () => {
    try {
      return { items: await api.get<SocialLinkRecord[]>('social-links'), error: '' }
    } catch (error) {
      return { items: null, error: toAdminApiError(error).message }
    }
  })
  const loadError = computed(() => data.value?.error ?? '')
  const isLoading = computed(() => !data.value)
  const isReady = computed(() => !!data.value?.items)

  // --- Borrador editable
  let seq = 0
  const nextKey = () => `link-${++seq}`
  const drafts = ref<SocialLinkDraft[]>([])
  const savedSnapshot = ref('[]')
  const touched = reactive(new Set<string>())
  const submitted = ref(false)
  const saveError = ref('')
  const isSaving = ref(false)
  const liveMessage = ref('')

  const applyRecords = (records: SocialLinkRecord[]) => {
    drafts.value = draftsFromRecords(records, nextKey)
    savedSnapshot.value = socialSnapshot(drafts.value)
    touched.clear()
    submitted.value = false
    saveError.value = ''
  }
  watch(
    () => data.value?.items,
    items => {
      if (items) applyRecords(items)
    },
    { immediate: true }
  )

  const isDirty = computed(() => hasSocialChanges(savedSnapshot.value, drafts.value))
  const validation = computed(() => validateSocialLinks(drafts.value))
  const atLimit = computed(() => drafts.value.length >= SOCIAL_LINKS_MAX)

  // Un error se muestra al salir del campo o, tras intentar guardar, en todos.
  const errorsFor = (key: string) => {
    const all = validation.value.errors[key] ?? {}
    if (submitted.value) return all
    return Object.fromEntries(
      Object.entries(all).filter(([field]) => touched.has(`${key}:${field}`))
    )
  }

  const listEl = ref<HTMLElement | null>(null)
  const nameOf = (draft: SocialLinkDraft) => draft.name.trim() || 'La red'

  const addLink = async () => {
    if (atLimit.value) return
    const draft = emptySocialDraft(nextKey())
    drafts.value.push(draft)
    liveMessage.value = `Red nueva añadida en la posición ${drafts.value.length}.`
    await nextTick()
    listEl.value?.querySelector<HTMLElement>(`[data-key="${draft.key}"] input`)?.focus()
  }

  const removeLink = async (index: number) => {
    const [removed] = drafts.value.splice(index, 1)
    liveMessage.value = `${nameOf(removed as SocialLinkDraft)} quitada de la lista. Guarda para aplicar el cambio.`
    await nextTick()
    // El foco pasa a la siguiente fila (o a la anterior); si ya no queda ninguna, a "Añadir red".
    const target = drafts.value[Math.min(index, drafts.value.length - 1)]
    const next = target
      ? listEl.value?.querySelector<HTMLElement>(`[data-key="${target.key}"] [data-remove]`)
      : document.getElementById('social-add')
    next?.focus()
  }

  const moveLink = async (index: number, direction: -1 | 1) => {
    const draft = drafts.value[index]
    if (!draft) return
    drafts.value = moveItem(drafts.value, index, index + direction)
    const position = drafts.value.findIndex(item => item.key === draft.key) + 1
    liveMessage.value = `${nameOf(draft)} ahora está en la posición ${position} de ${drafts.value.length}.`
    await nextTick()
    // Mover el nodo en el DOM quita el foco: se devuelve al botón que se acaba de usar.
    const row = listEl.value?.querySelector<HTMLElement>(`[data-key="${draft.key}"]`)
    const wanted = direction === -1 ? 'up' : 'down'
    const button = row?.querySelector<HTMLButtonElement>(`[data-move="${wanted}"]`)
    const other = row?.querySelector<HTMLButtonElement>(
      `[data-move="${wanted === 'up' ? 'down' : 'up'}"]`
    )
    ;(button && !button.disabled ? button : other)?.focus()
  }

  const onTouch = (key: string, field: string) => touched.add(`${key}:${field}`)

  const save = async () => {
    submitted.value = true
    saveError.value = ''
    if (!validation.value.valid) {
      saveError.value =
        validation.value.listError || 'Revisa los campos marcados en rojo antes de guardar.'
      await nextTick()
      listEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    isSaving.value = true
    try {
      const saved = await api.put<SocialLinkRecord[]>('social-links', toSocialPayload(drafts.value))
      applyRecords(saved)
      announce('Redes guardadas.')
    } catch (error) {
      saveError.value = toAdminApiError(error).message
    } finally {
      isSaving.value = false
    }
  }

  // --- Confirmaciones: descartar cambios y salir de la pantalla con cambios sin guardar
  const confirmKind = ref<'discard' | 'leave' | null>(null)
  let resolveLeave: ((_allow: boolean) => void) | null = null

  onBeforeRouteLeave(() => {
    if (!isDirty.value) return true
    return new Promise<boolean>(resolve => {
      resolveLeave = resolve
      confirmKind.value = 'leave'
    })
  })

  const onConfirm = () => {
    const kind = confirmKind.value
    confirmKind.value = null
    if (kind === 'discard' && data.value?.items) {
      applyRecords(data.value.items)
      announce('Cambios descartados.')
    }
    if (kind === 'leave') resolveLeave?.(true)
    resolveLeave = null
  }
  const onCancel = () => {
    if (!confirmKind.value) return
    if (confirmKind.value === 'leave') resolveLeave?.(false)
    resolveLeave = null
    confirmKind.value = null
  }

  const warnBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!isDirty.value) return
    event.preventDefault()
    event.returnValue = ''
  }
  onMounted(() => window.addEventListener('beforeunload', warnBeforeUnload))
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnBeforeUnload))
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Contenido del sitio"
      title="Redes sociales"
      description="Los enlaces que el sitio muestra en el encabezado y en la sección de contacto. De arriba hacia abajo es el orden en que aparecen."
    />

    <AdminNotice tone="success" :message="status" />
    <p class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</p>

    <datalist id="social-icon-options">
      <option v-for="icon in SOCIAL_ICON_SUGGESTIONS" :key="icon.value" :value="icon.value">
        {{ icon.label }}
      </option>
    </datalist>

    <AdminSkeleton
      v-if="isLoading"
      :rows="3"
      height-class="h-135 md:h-102 xl:h-98"
      label="Cargando redes…"
    />

    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>

    <template v-else>
      <AdminEmptyState
        v-if="!drafts.length"
        icon="mdi:share-variant-outline"
        title="Aún no hay redes en el sitio"
        :description="
          isDirty
            ? 'Quitaste todas las redes. Guarda para que el sitio deje de mostrarlas o descarta los cambios.'
            : 'Añade tu primera red para que quien visite el sitio sepa dónde encontrarte.'
        "
      >
        <AdminButton id="social-add" variant="primary" @click="addLink">
          <Icon name="mdi:plus" size="20" aria-hidden="true" />
          Añadir la primera red
        </AdminButton>
      </AdminEmptyState>

      <ul v-else ref="listEl" class="space-y-3" aria-label="Redes sociales">
        <SocialLinkRow
          v-for="(draft, index) in drafts"
          :key="draft.key"
          :model-value="draft"
          :index="index"
          :total="drafts.length"
          :errors="errorsFor(draft.key)"
          icon-list-id="social-icon-options"
          @update:model-value="drafts[index] = $event"
          @move-up="moveLink(index, -1)"
          @move-down="moveLink(index, 1)"
          @remove="removeLink(index)"
          @touch="onTouch(draft.key, $event)"
        />
      </ul>

      <!-- Barra de guardado: fija abajo mientras la lista es larga -->
      <div
        v-if="drafts.length || isDirty"
        class="mt-6 -mx-5 md:sticky md:bottom-0 md:z-10 border-t border-brand-border bg-brand-surface px-5 py-3 md:-mx-8 md:px-8"
      >
        <AdminNotice tone="error" :message="saveError" />
        <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <AdminButton v-if="drafts.length" id="social-add" :disabled="atLimit" @click="addLink">
              <Icon name="mdi:plus" size="20" aria-hidden="true" />
              Añadir red
            </AdminButton>
            <p class="text-sm tabular-nums text-brand-muted">
              {{
                atLimit
                  ? `Llegaste al máximo de ${SOCIAL_LINKS_MAX} redes`
                  : `${drafts.length} de ${SOCIAL_LINKS_MAX} redes`
              }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <AdminBadge v-if="isDirty" tone="warning" icon="mdi:circle-edit-outline">
              Cambios sin guardar
            </AdminBadge>
            <AdminBadge v-else tone="neutral" icon="mdi:check">Todo guardado</AdminBadge>
            <AdminButton :disabled="!isDirty || isSaving" @click="confirmKind = 'discard'">
              Descartar cambios
            </AdminButton>
            <AdminButton
              variant="primary"
              :disabled="!isDirty"
              :loading="isSaving"
              loading-label="Guardando…"
              @click="save"
            >
              Guardar cambios
            </AdminButton>
          </div>
        </div>
      </div>
    </template>

    <AdminConfirmDialog
      :open="confirmKind !== null"
      :title="confirmKind === 'leave' ? '¿Salir sin guardar?' : '¿Descartar los cambios?'"
      :confirm-label="confirmKind === 'leave' ? 'Salir sin guardar' : 'Descartar cambios'"
      :cancel-label="confirmKind === 'leave' ? 'Seguir editando' : 'Cancelar'"
      @confirm="onConfirm"
      @close="onCancel"
    >
      <p v-if="confirmKind === 'leave'">
        Hiciste cambios en las redes sociales que todavía no guardaste. Si sales ahora, se pierden.
      </p>
      <p v-else>
        La lista vuelve a como estaba la última vez que guardaste. Los cambios que hiciste se
        pierden.
      </p>
    </AdminConfirmDialog>
  </div>
</template>
