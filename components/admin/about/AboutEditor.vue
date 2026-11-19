<script setup lang="ts">
  import AboutImagesField from '~/components/admin/about/AboutImagesField.vue'
  import AboutPreview from '~/components/admin/about/AboutPreview.vue'
  import AboutPublishPanel from '~/components/admin/about/AboutPublishPanel.vue'
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminChipList from '~/components/admin/AdminChipList.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import PortfolioFormSection from '~/components/admin/portfolio/PortfolioFormSection.vue'
  import PortfolioHighlightsField from '~/components/admin/portfolio/PortfolioHighlightsField.vue'
  import {
    ABOUT_LIMITS,
    aboutPublishRequirements,
    formFromAboutRecord,
    hasAboutChanges,
    validateAboutForm,
    type AboutAdminRecord,
    type AboutFormValues
  } from '~/utils/admin/about'

  // Editor de "Sobre mí": formulario por secciones, validación, cambios sin guardar, guardado
  // (contenido e imágenes, en el orden que pide la API) y vista previa de la sección real.
  const props = defineProps<{ record: AboutAdminRecord }>()

  const clone = (value: unknown) => JSON.parse(JSON.stringify(value))

  const { save: saveAbout } = useAdminAbout()
  const { status, announce } = useAdminStatus()

  const record = ref<AboutAdminRecord>(clone(props.record))
  const savedForm = computed<AboutFormValues>(() => formFromAboutRecord(record.value))
  const values = ref<AboutFormValues>(clone(savedForm.value))

  const submitted = ref(false)
  const touched = reactive(new Set<string>())
  const saveError = ref('')
  const isSaving = ref(false)

  const isDirty = computed(() => hasAboutChanges(savedForm.value, values.value))
  const validation = computed(() => validateAboutForm(values.value))
  const requirements = computed(() => aboutPublishRequirements(values.value))

  // Un error se ve al salir del campo o, tras intentar guardar, en todos.
  const errors = computed(() => {
    if (submitted.value) return validation.value.errors
    return Object.fromEntries(
      Object.entries(validation.value.errors).filter(([key]) =>
        touched.has(key.split('.')[0] as string)
      )
    )
  })

  const formEl = ref<HTMLFormElement | null>(null)

  const TOUCH_BY_ID: [string, string][] = [
    ['about-eyebrow', 'eyebrow'],
    ['about-heading', 'heading'],
    ['about-intro', 'intro'],
    ['about-role', 'role'],
    ['about-tagline', 'tagline'],
    ['about-quote', 'quote'],
    ['about-how', 'howIWork'],
    ['about-beyond', 'beyondWork'],
    ['about-interests', 'interests'],
    ['about-name', 'name'],
    ['about-location', 'location'],
    ['about-mode', 'workMode'],
    ['about-availability', 'availability'],
    ['about-stats', 'stats'],
    ['about-tools', 'tools'],
    ['about-cta-label', 'ctaLabel'],
    ['about-cta-href', 'ctaHref'],
    ['about-images', 'images']
  ]
  const onFocusOut = (event: FocusEvent) => {
    const id = (event.target as HTMLElement).id ?? ''
    const match = TOUCH_BY_ID.find(([prefix]) => id.startsWith(prefix))
    if (match) touched.add(match[1])
  }

  const focusFirstError = async () => {
    await nextTick()
    formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }

  const discard = () => {
    values.value = clone(savedForm.value)
    submitted.value = false
    touched.clear()
    saveError.value = ''
  }

  const onSave = async () => {
    submitted.value = true
    saveError.value = ''
    const result = validation.value
    if (!result.valid) {
      saveError.value = 'Revisa los campos marcados en rojo antes de guardar.'
      await focusFirstError()
      return
    }
    isSaving.value = true
    const outcome = await saveAbout(savedForm.value, result.values)
    isSaving.value = false
    if (outcome.ok) {
      record.value = outcome.record
      values.value = clone(savedForm.value)
      submitted.value = false
      touched.clear()
      announce('Cambios guardados.')
      return
    }
    if (outcome.record) {
      // Una parte ya se guardó: el formulario vuelve a lo que quedó en la API para no repetir pasos.
      record.value = outcome.record
      values.value = clone(savedForm.value)
      saveError.value = `${outcome.message} Una parte de los cambios sí se guardó; revisa lo que quedó y vuelve a intentarlo.`
    } else {
      saveError.value = outcome.message
    }
  }

  // --- Confirmaciones: descartar y salir con cambios sin guardar
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
    if (kind === 'discard') {
      discard()
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
  <form
    ref="formEl"
    novalidate
    class="about-editor"
    @submit.prevent="onSave"
    @focusout="onFocusOut"
  >
    <div class="max-w-4xl space-y-6">
      <PortfolioFormSection
        id="about-intro-section"
        title="Presentación"
        description="Lo primero que lee quien llega a la sección: quién eres y qué te mueve."
      >
        <div class="space-y-4">
          <div class="grid gap-4 md:grid-cols-[14rem_minmax(0,1fr)]">
            <AdminInput
              id="about-eyebrow"
              v-model="values.eyebrow"
              label="Sobre-título"
              counter
              :maxlength="ABOUT_LIMITS.eyebrow"
              autocomplete="off"
              :error="errors.eyebrow"
            />
            <AdminInput
              id="about-heading"
              v-model="values.heading"
              label="Título"
              required
              counter
              :maxlength="ABOUT_LIMITS.heading"
              autocomplete="off"
              :error="errors.heading"
            />
          </div>
          <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <AdminInput
              id="about-role"
              v-model="values.role"
              label="Cargo (opcional)"
              counter
              :maxlength="ABOUT_LIMITS.role"
              autocomplete="off"
              placeholder="Ingeniero de sistemas"
              hint="Va sobre la frase destacada."
              :error="errors.role"
            />
            <AdminInput
              id="about-tagline"
              v-model="values.tagline"
              label="Frase destacada (opcional)"
              counter
              :maxlength="ABOUT_LIMITS.tagline"
              autocomplete="off"
              hint="Una línea que resume lo que haces; la presentación queda debajo."
              :error="errors.tagline"
            />
          </div>
          <AdminInput
            id="about-intro"
            v-model="values.intro"
            type="textarea"
            :rows="4"
            label="Presentación"
            required
            counter
            :maxlength="ABOUT_LIMITS.intro"
            hint="Quién eres y a qué te dedicas, en primera persona y sin jerga."
            :error="errors.intro"
          />
          <AdminInput
            id="about-quote"
            v-model="values.quote"
            type="textarea"
            :rows="3"
            label="Cita (opcional)"
            counter
            :maxlength="ABOUT_LIMITS.quote"
            hint="Una frase que resuma tu forma de ver el trabajo. Se muestra con un borde de acento."
            :error="errors.quote"
          />
        </div>
      </PortfolioFormSection>

      <PortfolioFormSection
        id="about-stories"
        title="Cómo trabajo y fuera del trabajo"
        description="Dos tarjetas cortas. Si dejas una vacía, no se muestra."
      >
        <div class="space-y-4">
          <AdminInput
            id="about-how"
            v-model="values.howIWork"
            type="textarea"
            :rows="5"
            label="Cómo trabajo"
            counter
            :maxlength="ABOUT_LIMITS.howIWork"
            :error="errors.howIWork"
          />
          <AdminInput
            id="about-beyond"
            v-model="values.beyondWork"
            type="textarea"
            :rows="5"
            label="Fuera del trabajo"
            counter
            :maxlength="ABOUT_LIMITS.beyondWork"
            :error="errors.beyondWork"
          />
          <AdminChipList
            id="about-interests"
            v-model="values.interests"
            label="Intereses (opcional)"
            :max="ABOUT_LIMITS.interests"
            :max-length="ABOUT_LIMITS.interest"
            placeholder="Café, ciclismo…"
            hint="Hasta 6 etiquetas junto a «Fuera del trabajo»."
            :error="errors.interests"
          />
        </div>
      </PortfolioFormSection>

      <PortfolioFormSection
        id="about-data"
        title="Datos"
        description="El nombre, la ubicación y el modo de trabajo van bajo las imágenes; la disponibilidad, junto al botón."
      >
        <div class="grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2">
            <AdminInput
              id="about-name"
              v-model="values.name"
              label="Nombre bajo la foto (opcional)"
              counter
              :maxlength="ABOUT_LIMITS.name"
              autocomplete="off"
              :error="errors.name"
            />
          </div>
          <AdminInput
            id="about-location"
            v-model="values.location"
            label="Ubicación"
            counter
            :maxlength="ABOUT_LIMITS.location"
            autocomplete="off"
            placeholder="Medellín, Colombia"
            :error="errors.location"
          />
          <AdminInput
            id="about-mode"
            v-model="values.workMode"
            label="Modo de trabajo"
            counter
            :maxlength="ABOUT_LIMITS.workMode"
            autocomplete="off"
            placeholder="Trabajo en remoto"
            :error="errors.workMode"
          />
          <div class="md:col-span-2">
            <AdminInput
              id="about-availability"
              v-model="values.availability"
              label="Disponibilidad"
              counter
              :maxlength="ABOUT_LIMITS.availability"
              autocomplete="off"
              :error="errors.availability"
            />
          </div>
        </div>
      </PortfolioFormSection>

      <PortfolioFormSection
        id="about-stats-section"
        title="Cifras"
        description="Hasta 4 cifras que puedas comprobar. Si no tienes ninguna, déjalo vacío: es mejor no mostrar nada que inventarla."
      >
        <PortfolioHighlightsField
          id="about-stats"
          v-model="values.stats"
          :errors="errors"
          :max="ABOUT_LIMITS.stats"
          :value-max="ABOUT_LIMITS.statValue"
          :label-max="ABOUT_LIMITS.statLabel"
          error-prefix="stats"
          value-placeholder="10+"
          label-placeholder="años haciendo software"
          list-label="Cifras"
        />
      </PortfolioFormSection>

      <PortfolioFormSection
        id="about-tools-section"
        title="Herramientas"
        description="Etiquetas cortas de lo que usas a diario. Hasta 12; si no hay, el bloque no se muestra."
      >
        <AdminChipList
          id="about-tools"
          v-model="values.tools"
          label="Herramientas"
          :max="ABOUT_LIMITS.tools"
          :max-length="ABOUT_LIMITS.tool"
          placeholder="Nuxt, PostgreSQL…"
          :error="errors.tools"
        />
      </PortfolioFormSection>

      <PortfolioFormSection
        id="about-cta"
        title="Botón"
        description="Opcional. Con enlace a WhatsApp (https://wa.me/…) muestra su icono; con una ruta del sitio (/#contacto) navega dentro de la página."
      >
        <div class="grid gap-4 md:grid-cols-2">
          <AdminInput
            id="about-cta-label"
            v-model="values.ctaLabel"
            label="Texto del botón"
            counter
            :maxlength="ABOUT_LIMITS.ctaLabel"
            autocomplete="off"
            :error="errors.ctaLabel"
          />
          <AdminInput
            id="about-cta-href"
            v-model="values.ctaHref"
            label="Enlace"
            inputmode="url"
            counter
            :maxlength="ABOUT_LIMITS.ctaHref"
            autocomplete="off"
            placeholder="/#contacto"
            hint="Una ruta del sitio o una dirección que empiece por https://"
            :error="errors.ctaHref"
          />
        </div>
      </PortfolioFormSection>

      <PortfolioFormSection
        id="about-images-section"
        title="Imágenes"
        description="De 1 a 4 imágenes forman el carrusel (la primera se ve al cargar). Proporción 4:3, webp de hasta 150 KB; guía en docs/about-guide.md."
      >
        <AboutImagesField id="about-images" v-model="values.images" :errors="errors" />
      </PortfolioFormSection>

      <PortfolioFormSection
        id="about-publish"
        title="Publicación"
        description="Mientras no esté publicado, la home muestra el contenido de respaldo del código."
      >
        <AboutPublishPanel
          v-model:published="values.isPublished"
          :record="record"
          :requirements="requirements"
          :error="errors.isPublished"
        />
      </PortfolioFormSection>
    </div>

    <PortfolioFormSection
      id="about-preview"
      class="mt-6"
      title="Vista previa"
      description="Así se verá la sección en la home con lo que hay ahora en el formulario (aunque no esté guardado ni publicado)."
    >
      <AboutPreview :values="values" />
    </PortfolioFormSection>

    <!-- Barra de acciones: fija abajo desde md porque el formulario es largo -->
    <div
      class="-mx-5 mt-6 border-t border-brand-border bg-brand-surface px-5 py-3 md:sticky md:bottom-0 md:z-10 md:-mx-8 md:px-8"
    >
      <AdminNotice tone="error" :message="saveError" />
      <AdminNotice tone="success" :message="status" />
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <AdminBadge v-if="isDirty" tone="warning" icon="mdi:circle-edit-outline">
          Cambios sin guardar
        </AdminBadge>
        <AdminBadge v-else tone="neutral" icon="mdi:check">Todo guardado</AdminBadge>
        <div class="flex flex-wrap items-center gap-2">
          <AdminButton :disabled="!isDirty || isSaving" @click="confirmKind = 'discard'">
            Descartar cambios
          </AdminButton>
          <AdminButton
            type="submit"
            variant="primary"
            :disabled="!isDirty"
            :loading="isSaving"
            loading-label="Guardando…"
          >
            Guardar cambios
          </AdminButton>
        </div>
      </div>
    </div>

    <AdminConfirmDialog
      :open="confirmKind !== null"
      :title="confirmKind === 'leave' ? '¿Salir sin guardar?' : '¿Descartar los cambios?'"
      :confirm-label="confirmKind === 'leave' ? 'Salir sin guardar' : 'Descartar cambios'"
      :cancel-label="confirmKind === 'leave' ? 'Seguir editando' : 'Cancelar'"
      @confirm="onConfirm"
      @close="onCancel"
    >
      <p v-if="confirmKind === 'leave'">
        Hiciste cambios en «Sobre mí» que todavía no guardaste. Si sales ahora, se pierden.
      </p>
      <p v-else>
        El formulario vuelve a como estaba la última vez que guardaste. Lo que escribiste después se
        pierde.
      </p>
    </AdminConfirmDialog>
  </form>
</template>

<style>
  /* La barra de acciones es fija desde md: al enfocar un campo el navegador lo deja por encima de ella. */
  html:has(.about-editor) {
    scroll-padding-bottom: 6rem;
  }
</style>
