<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminDialog from '~/components/admin/AdminDialog.vue'
  import AdminDialogActions from '~/components/admin/AdminDialogActions.vue'
  import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import AdminSkeleton from '~/components/admin/AdminSkeleton.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    OFFER_DURATION_MAX,
    OFFER_INCLUDES_LIMIT,
    OFFER_INCLUDE_MAX,
    OFFER_NOTE_MAX,
    OFFER_ORDER_MAX,
    OFFER_SLUG_MAX,
    OFFER_SUMMARY_MAX,
    OFFER_TITLE_MAX,
    nextOfferOrder,
    offerFormDefaults,
    offerFormSchema,
    slugifyOfferTitle,
    type ServiceOfferRecord
  } from '~/utils/admin/serviceOffers'
  import { formatUsd } from '~/utils/pricing'

  definePageMeta({ layout: 'admin' })
  useSeoMeta({ title: 'Ofertas | Panel', robots: 'noindex, nofollow' })

  const api = useAdminApi()
  const { status, announce } = useAdminStatus()

  // --- Carga (el error viaja dentro de los datos para que SSR y cliente muestren lo mismo).
  type Loaded = { items: ServiceOfferRecord[] | null; error: string }
  const { data, refresh } = await useLazyAsyncData<Loaded>('admin-service-offers', async () => {
    try {
      return { items: await api.get<ServiceOfferRecord[]>('service-offers'), error: '' }
    } catch (error) {
      return { items: null, error: toAdminApiError(error).message }
    }
  })
  const offers = computed(() => data.value?.items ?? [])
  const loadError = computed(() => data.value?.error ?? '')
  const isLoading = computed(() => !data.value)
  const isReady = computed(() => !!data.value?.items)

  // --- Cambios rápidos desde la lista (publicar y lanzamiento), sin abrir el formulario
  const busyId = ref('')
  const quickError = ref('')
  const quickPatch = async (
    offer: ServiceOfferRecord,
    body: Record<string, unknown>,
    message: string
  ) => {
    busyId.value = offer.id
    quickError.value = ''
    try {
      await api.patch(`service-offers/${offer.id}`, body)
      await refresh()
      announce(message)
    } catch (error) {
      quickError.value = toAdminApiError(error).message
    } finally {
      busyId.value = ''
    }
  }
  const togglePublished = (offer: ServiceOfferRecord) =>
    quickPatch(
      offer,
      { isPublished: !offer.isPublished },
      offer.isPublished
        ? `«${offer.title}» ya no se muestra en Cómo cobro.`
        : `«${offer.title}» ya se muestra en Cómo cobro.`
    )
  const toggleLaunch = (offer: ServiceOfferRecord) =>
    quickPatch(
      offer,
      { launchEnabled: !offer.launchEnabled },
      offer.launchEnabled
        ? `Precio de lanzamiento de «${offer.title}» apagado.`
        : `Precio de lanzamiento de «${offer.title}» encendido.`
    )

  // --- Crear y editar
  const formOpen = ref(false)
  const editing = ref<ServiceOfferRecord | null>(null)
  const isSaving = ref(false)
  const formError = ref('')
  const form = useAdminForm(offerFormSchema, () =>
    offerFormDefaults(editing.value, nextOfferOrder(offers.value))
  )

  // La dirección se sugiere desde el nombre solo al crear y mientras nadie la haya tocado a mano.
  const slugTouched = ref(false)
  watch(
    () => form.values.title,
    title => {
      if (!editing.value && !slugTouched.value) form.values.slug = slugifyOfferTitle(title)
    }
  )

  const openForm = (offer: ServiceOfferRecord | null) => {
    editing.value = offer
    slugTouched.value = !!offer
    form.reset()
    formError.value = ''
    formOpen.value = true
  }
  const closeForm = () => {
    if (isSaving.value) return
    formOpen.value = false
  }

  const submitForm = async () => {
    formError.value = ''
    const parsed = form.validate()
    if (!parsed) {
      await nextTick()
      document.querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')?.focus()
      return
    }
    isSaving.value = true
    try {
      if (editing.value) await api.patch(`service-offers/${editing.value.id}`, parsed)
      else await api.post('service-offers', parsed)
      const wasEditing = !!editing.value
      await refresh()
      formOpen.value = false
      announce(wasEditing ? 'Oferta actualizada.' : 'Oferta creada.')
    } catch (error) {
      formError.value = toAdminApiError(error).message
    } finally {
      isSaving.value = false
    }
  }

  // --- Eliminar (con confirmación que nombra la oferta)
  const toDelete = ref<ServiceOfferRecord | null>(null)
  const isDeleting = ref(false)
  const deleteError = ref('')

  const askDelete = (offer: ServiceOfferRecord) => {
    toDelete.value = offer
    deleteError.value = ''
  }
  const closeDelete = () => {
    if (isDeleting.value) return
    toDelete.value = null
  }
  const confirmDelete = async () => {
    const offer = toDelete.value
    if (!offer) return
    isDeleting.value = true
    deleteError.value = ''
    try {
      await api.del(`service-offers/${offer.id}`)
      await refresh()
      toDelete.value = null
      announce(`Oferta «${offer.title}» eliminada.`)
    } catch (error) {
      deleteError.value = toAdminApiError(error).message
    } finally {
      isDeleting.value = false
    }
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Contenido del sitio"
      title="Ofertas"
      description="Tus servicios con precio «desde» en dólares. Las publicadas se muestran en la página Cómo cobro del sitio (/como-cobro); el precio de lanzamiento solo se ve mientras esté encendido."
    >
      <template #actions>
        <AdminButton v-if="offers.length" variant="primary" @click="openForm(null)">
          <Icon name="mdi:plus" size="20" aria-hidden="true" />
          Nueva oferta
        </AdminButton>
      </template>
    </AdminPageHeader>

    <AdminNotice tone="success" :message="status" />
    <AdminNotice tone="error" :message="quickError" />

    <AdminSkeleton
      v-if="isLoading"
      :rows="3"
      height-class="h-52.5 md:h-54.5"
      label="Cargando ofertas…"
    />

    <AdminNotice v-else-if="!isReady" tone="error" :message="loadError">
      <AdminButton @click="refresh()">Reintentar</AdminButton>
    </AdminNotice>

    <AdminEmptyState
      v-else-if="!offers.length"
      icon="mdi:tag-text-outline"
      title="Aún no hay ofertas"
      description="Crea tus servicios con su precio «desde». Hasta que publiques una, Cómo cobro muestra los servicios sin precio."
    >
      <AdminButton variant="primary" @click="openForm(null)">
        <Icon name="mdi:plus" size="20" aria-hidden="true" />
        Crear la primera oferta
      </AdminButton>
    </AdminEmptyState>

    <ul v-else class="space-y-3" aria-label="Ofertas">
      <li
        v-for="offer in offers"
        :key="offer.id"
        class="rounded-2xl border border-brand-border bg-brand-surface-card p-5 md:p-6"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-lg font-semibold text-brand-ink">{{ offer.title }}</h2>
            <p class="mt-1 text-xs tabular-nums text-brand-muted">
              /{{ offer.slug }} · Orden {{ offer.sortOrder }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <AdminBadge
              :tone="offer.isPublished ? 'success' : 'neutral'"
              :icon="offer.isPublished ? 'mdi:earth' : 'mdi:lock-outline'"
            >
              {{ offer.isPublished ? 'Publicada' : 'Sin publicar' }}
            </AdminBadge>
            <AdminBadge
              v-if="offer.launchPriceFromUsd !== null"
              :tone="offer.launchEnabled ? 'success' : 'neutral'"
              icon="mdi:tag-outline"
            >
              {{ offer.launchEnabled ? 'Lanzamiento encendido' : 'Lanzamiento apagado' }}
            </AdminBadge>
          </div>
        </div>

        <p class="mt-3 text-sm text-brand-ink tabular-nums">
          Desde {{ formatUsd(offer.priceFromUsd) }}
          <template v-if="offer.launchPriceFromUsd !== null">
            · lanzamiento {{ formatUsd(offer.launchPriceFromUsd) }}
          </template>
        </p>
        <p class="mt-2 line-clamp-2 text-sm leading-6 text-brand-muted">{{ offer.summary }}</p>

        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <AdminButton
            :disabled="busyId === offer.id"
            :aria-label="`${offer.isPublished ? 'Ocultar' : 'Publicar'} ${offer.title}`"
            @click="togglePublished(offer)"
          >
            {{ offer.isPublished ? 'Ocultar' : 'Publicar' }}
          </AdminButton>
          <AdminButton
            v-if="offer.launchPriceFromUsd !== null"
            :disabled="busyId === offer.id"
            :aria-label="`${offer.launchEnabled ? 'Apagar' : 'Encender'} el lanzamiento de ${offer.title}`"
            @click="toggleLaunch(offer)"
          >
            {{ offer.launchEnabled ? 'Apagar lanzamiento' : 'Encender lanzamiento' }}
          </AdminButton>
          <AdminButton :aria-label="`Editar ${offer.title}`" @click="openForm(offer)">
            Editar
          </AdminButton>
          <AdminButton
            variant="danger"
            :aria-label="`Eliminar ${offer.title}`"
            @click="askDelete(offer)"
          >
            Eliminar
          </AdminButton>
        </div>
      </li>
    </ul>

    <!-- Crear y editar -->
    <AdminDialog
      :open="formOpen"
      :title="editing ? 'Editar oferta' : 'Nueva oferta'"
      description="Los campos con * son obligatorios. Los precios son en dólares, sin puntos ni símbolos."
      @close="closeForm"
    >
      <form novalidate @submit.prevent="submitForm">
        <div class="space-y-4">
          <AdminInput
            id="offer-title"
            v-model="form.values.title"
            label="Nombre"
            required
            counter
            :maxlength="OFFER_TITLE_MAX"
            autocomplete="off"
            :error="form.errors.value.title"
          />
          <AdminInput
            id="offer-slug"
            v-model="form.values.slug"
            label="Dirección"
            required
            :maxlength="OFFER_SLUG_MAX"
            autocomplete="off"
            hint="Identificador interno en minúsculas y con guiones, p. ej. code-review. Se sugiere desde el nombre."
            :error="form.errors.value.slug"
            @update:model-value="slugTouched = true"
          />
          <AdminInput
            id="offer-summary"
            v-model="form.values.summary"
            label="Qué es"
            type="textarea"
            :rows="3"
            required
            counter
            :maxlength="OFFER_SUMMARY_MAX"
            :error="form.errors.value.summary"
          />
          <AdminInput
            id="offer-includes"
            v-model="form.values.includes"
            label="Qué incluye"
            type="textarea"
            :rows="5"
            :hint="`Una línea por elemento, hasta ${OFFER_INCLUDES_LIMIT} líneas de ${OFFER_INCLUDE_MAX} caracteres.`"
            :error="form.errors.value.includes"
          />
          <AdminInput
            id="offer-duration"
            v-model="form.values.duration"
            label="Tiempo de entrega"
            :maxlength="OFFER_DURATION_MAX"
            autocomplete="off"
            hint="Opcional, p. ej. «Entrega en 5 días hábiles»."
            :error="form.errors.value.duration"
          />
          <AdminInput
            id="offer-price"
            v-model="form.values.priceFromUsd"
            label="Precio desde (USD)"
            inputmode="numeric"
            autocomplete="off"
            required
            :maxlength="7"
            :error="form.errors.value.priceFromUsd"
          />
          <AdminInput
            id="offer-launch-price"
            v-model="form.values.launchPriceFromUsd"
            label="Precio de lanzamiento (USD)"
            inputmode="numeric"
            autocomplete="off"
            :maxlength="7"
            hint="Opcional. Debe ser menor que el precio normal."
            :error="form.errors.value.launchPriceFromUsd"
          />
          <AdminInput
            id="offer-launch-note"
            v-model="form.values.launchNote"
            label="Nota del lanzamiento"
            :maxlength="OFFER_NOTE_MAX"
            autocomplete="off"
            hint="Opcional, p. ej. «Primeros 3 clientes»."
            :error="form.errors.value.launchNote"
          />
          <AdminInput
            id="offer-launch-enabled"
            v-model="form.values.launchEnabled"
            type="checkbox"
            label="Mostrar el precio de lanzamiento"
            hint="Apágalo cuando termine la promoción: el sitio vuelve a mostrar solo el precio normal."
          />
          <AdminInput
            id="offer-order"
            v-model="form.values.sortOrder"
            label="Orden"
            inputmode="numeric"
            autocomplete="off"
            required
            :maxlength="4"
            :hint="`Número de 0 a ${OFFER_ORDER_MAX}. Se muestran de menor a mayor.`"
            :error="form.errors.value.sortOrder"
          />
          <AdminInput
            id="offer-published"
            v-model="form.values.isPublished"
            type="checkbox"
            label="Publicada"
            hint="Se muestra en la página Cómo cobro del sitio (/como-cobro). Si no, solo la ves tú aquí."
          />
        </div>
        <AdminNotice tone="error" :message="formError" gap="top" />
        <AdminDialogActions class="mt-4">
          <AdminButton :disabled="isSaving" @click="closeForm">Cancelar</AdminButton>
          <AdminButton
            type="submit"
            variant="primary"
            :loading="isSaving"
            loading-label="Guardando…"
          >
            {{ editing ? 'Guardar cambios' : 'Crear oferta' }}
          </AdminButton>
        </AdminDialogActions>
      </form>
    </AdminDialog>

    <!-- Eliminar -->
    <AdminConfirmDialog
      :open="!!toDelete"
      title="Eliminar oferta"
      confirm-label="Eliminar oferta"
      loading-label="Eliminando…"
      :busy="isDeleting"
      :error="deleteError"
      @confirm="confirmDelete"
      @close="closeDelete"
    >
      <p v-if="toDelete">
        Vas a eliminar
        <strong class="font-semibold text-brand-ink">«{{ toDelete.title }}»</strong>
        . Esta acción no se puede deshacer
        <template v-if="toDelete.isPublished">y dejará de mostrarse en Cómo cobro</template>
        .
      </p>
    </AdminConfirmDialog>
  </div>
</template>
