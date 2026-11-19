<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminChipList from '~/components/admin/AdminChipList.vue'
  import AdminConfirmDialog from '~/components/admin/AdminConfirmDialog.vue'
  import AdminImageUpload from '~/components/admin/AdminImageUpload.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
  import PortfolioCardPreview from '~/components/admin/portfolio/PortfolioCardPreview.vue'
  import PortfolioFormSection from '~/components/admin/portfolio/PortfolioFormSection.vue'
  import PortfolioGalleryField from '~/components/admin/portfolio/PortfolioGalleryField.vue'
  import PortfolioHighlightsField from '~/components/admin/portfolio/PortfolioHighlightsField.vue'
  import PortfolioImagePreview from '~/components/admin/portfolio/PortfolioImagePreview.vue'
  import PortfolioPublishPanel from '~/components/admin/portfolio/PortfolioPublishPanel.vue'
  import {
    PORTFOLIO_KIND_OPTIONS,
    PORTFOLIO_LIMITS,
    formatPortfolioDate,
    publishRequirements
  } from '~/utils/admin/portfolio'
  import type { PortfolioDetailRecord } from '~/utils/admin/portfolio'
  import type { MediaResult } from '~/utils/admin/media'

  // Editor de un proyecto del portafolio (crear y editar). La lógica vive en `usePortfolioEditor`; aquí
  // solo se ordena la pantalla: secciones, barra de acciones, confirmaciones y foco.
  const props = defineProps<{ entry: PortfolioDetailRecord | null }>()

  const {
    record,
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
    allowLeave
  } = usePortfolioEditor(props.entry)

  const { discardAfterSave, flushDiscards, clearDiscards } = useAdminMedia()
  const formEl = ref<HTMLFormElement | null>(null)
  const folder = computed(() => values.value.slug || 'mi-proyecto')
  const requirements = computed(() => publishRequirements(values.value))
  const slugChanged = computed(
    () => !!record.value && values.value.slug.trim() !== record.value.slug
  )

  onMounted(() => {
    if (flash.value) {
      announce(flash.value)
      flash.value = ''
    }
    window.addEventListener('beforeunload', warnBeforeUnload)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', warnBeforeUnload)
    clearDiscards()
  })

  // Un campo muestra su error al salir de él: el id del control dice de qué campo se trata.
  const TOUCH_BY_ID: [string, string][] = [
    ['portfolio-title', 'title'],
    ['portfolio-slug', 'slug'],
    ['portfolio-kind', 'kind'],
    ['portfolio-description', 'description'],
    ['portfolio-url', 'url'],
    ['portfolio-tags', 'tags'],
    ['portfolio-audience', 'audience'],
    ['portfolio-role', 'role'],
    ['portfolio-year', 'year'],
    ['portfolio-duration', 'duration'],
    ['portfolio-problem', 'problem'],
    ['portfolio-decision', 'decision'],
    ['portfolio-result', 'result'],
    ['portfolio-highlights-field', 'highlights'],
    ['portfolio-scope-list', 'scope'],
    ['portfolio-tech-list', 'technologies'],
    ['portfolio-cover', 'coverPath'],
    ['portfolio-og', 'ogPath'],
    ['portfolio-gallery', 'gallery'],
    ['portfolio-sort', 'sortOrder']
  ]
  const onFocusOut = (event: FocusEvent) => {
    const id = (event.target as HTMLElement).id ?? ''
    const match = TOUCH_BY_ID.find(([prefix]) => id.startsWith(prefix))
    if (match) touch(match[1])
  }

  const focusFirstError = async () => {
    await nextTick()
    formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }

  // Subir portada o imagen para redes: la dirección se rellena sola y el archivo subido que se reemplaza se
  // borra del almacenamiento solo después de guardar.
  const onCoverUploaded = (media: MediaResult) => {
    discardAfterSave(values.value.coverPath)
    values.value.coverPath = media.url
  }
  const onOgUploaded = (media: MediaResult) => {
    discardAfterSave(values.value.ogPath)
    values.value.ogPath = media.url
  }

  const onSave = async () => {
    const result = await save()
    if (result === 'created' || result === 'saved') {
      void flushDiscards([
        values.value.coverPath,
        values.value.ogPath,
        ...values.value.gallery.map(item => item.path)
      ])
    }
    if (result === 'created' && record.value) {
      await navigateTo(`/admin/portfolio/${record.value.id}`)
    } else if (result === 'invalid' || (result === 'failed' && errors.value.slug)) {
      await focusFirstError()
    }
  }

  // --- Confirmaciones: descartar, salir con cambios sin guardar y eliminar
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
      clearDiscards()
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

  const askDelete = ref(false)
  const confirmDelete = async () => {
    if (await remove()) {
      askDelete.value = false
      allowLeave()
      await navigateTo('/admin/portfolio')
    }
  }
  const closeDelete = () => {
    if (!isRemoving.value) askDelete.value = false
  }
</script>

<template>
  <div>
    <AdminPageHeader
      eyebrow="Portafolio"
      :title="isNew ? 'Nuevo proyecto' : 'Editar proyecto'"
      :description="
        isNew
          ? 'Empieza por lo básico; lo demás lo puedes completar después. Se crea como borrador: nadie lo ve hasta que lo publiques.'
          : `«${record?.title}»: creado el ${formatPortfolioDate(record?.createdAt ?? null)}, actualizado el ${formatPortfolioDate(record?.updatedAt ?? null)}.`
      "
    />

    <form
      ref="formEl"
      novalidate
      class="portfolio-editor max-w-4xl"
      @submit.prevent="onSave"
      @focusout="onFocusOut"
    >
      <div class="space-y-6">
        <PortfolioFormSection
          id="portfolio-basic"
          title="Información básica"
          description="Lo que identifica al proyecto y lo que se lee primero."
        >
          <div class="space-y-4">
            <AdminInput
              id="portfolio-title"
              v-model="values.title"
              label="Título"
              required
              counter
              :maxlength="PORTFOLIO_LIMITS.title"
              autocomplete="off"
              :error="errors.title"
            />
            <div>
              <AdminInput
                id="portfolio-slug"
                :model-value="values.slug"
                label="Dirección del proyecto"
                required
                counter
                :maxlength="PORTFOLIO_LIMITS.slug"
                autocomplete="off"
                :hint="`Será la URL pública: /portafolio/${values.slug || 'mi-proyecto'}. Solo minúsculas, números y guiones (máx. ${PORTFOLIO_LIMITS.slug}). Se sugiere desde el título; puedes cambiarla.`"
                :error="errors.slug"
                @update:model-value="onSlugInput(String($event))"
              />
              <p
                v-if="slugChanged"
                role="status"
                class="mt-2 flex items-start gap-2 rounded-lg border border-brand-warning-border bg-brand-warning-bg px-3 py-2 text-sm font-medium text-brand-warning-text"
              >
                <Icon
                  name="mdi:alert-outline"
                  size="20"
                  class="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Cambiar la dirección cambia la URL pública: los enlaces que ya compartiste a
                /portafolio/{{ record?.slug }} dejarán de funcionar.
              </p>
            </div>
            <AdminInput
              id="portfolio-kind"
              v-model="values.kind"
              type="select"
              label="Tipo"
              required
              :options="[...PORTFOLIO_KIND_OPTIONS]"
              :error="errors.kind"
            />
            <AdminInput
              id="portfolio-description"
              v-model="values.description"
              type="textarea"
              :rows="3"
              label="Descripción"
              required
              counter
              :maxlength="PORTFOLIO_LIMITS.description"
              hint="Una o dos frases: qué es y para quién. Es el texto de la tarjeta y de la cabecera de la ficha."
              :error="errors.description"
            />
            <AdminInput
              id="portfolio-url"
              v-model="values.url"
              label="Enlace al proyecto en vivo (opcional)"
              inputmode="url"
              autocomplete="off"
              placeholder="https://mi-proyecto.co"
              :maxlength="PORTFOLIO_LIMITS.url"
              hint="Solo si el cliente lo permite. Aparece como el botón «Ver proyecto» de la ficha."
              :error="errors.url"
            />
          </div>
        </PortfolioFormSection>

        <PortfolioFormSection
          id="portfolio-card"
          title="Cómo se presenta en la tarjeta"
          description="La tarjeta es lo primero que ve quien visita la home y el portafolio."
        >
          <div class="gap-6 xl:grid xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div class="space-y-4">
              <AdminChipList
                id="portfolio-tags"
                v-model="values.tags"
                label="Etiquetas"
                :max="PORTFOLIO_LIMITS.tags"
                :max-length="PORTFOLIO_LIMITS.tag"
                placeholder="Página web, Tienda en línea…"
                hint="Hasta 4. La primera se muestra sobre la imagen de la tarjeta."
                :error="errors.tags"
              />
              <AdminInput
                id="portfolio-audience"
                v-model="values.audience"
                label="Público objetivo"
                counter
                :maxlength="PORTFOLIO_LIMITS.audience"
                autocomplete="off"
                placeholder="familias que quieren ordenar sus compras"
                hint="Completa la frase «Dirigido a …» al pie de la tarjeta."
                :error="errors.audience"
              />
            </div>
            <div class="mt-6 xl:mt-0">
              <PortfolioCardPreview :values="values" />
            </div>
          </div>
        </PortfolioFormSection>

        <PortfolioFormSection
          id="portfolio-story"
          title="Historia del proyecto"
          description="Cuéntalo desde el problema del cliente, no desde la tecnología: quien visita el sitio decide escribirte por lo que resolviste. Un proyecto completo sin problema, decisión y resultado se ve corto."
        >
          <div class="space-y-4">
            <div class="grid gap-4 md:grid-cols-3">
              <AdminInput
                id="portfolio-role"
                v-model="values.role"
                label="Tu rol"
                counter
                :maxlength="PORTFOLIO_LIMITS.role"
                autocomplete="off"
                placeholder="Diseño y desarrollo"
                :error="errors.role"
              />
              <AdminInput
                id="portfolio-year"
                v-model="values.year"
                label="Año"
                counter
                :maxlength="PORTFOLIO_LIMITS.year"
                autocomplete="off"
                placeholder="2026"
                :error="errors.year"
              />
              <AdminInput
                id="portfolio-duration"
                v-model="values.duration"
                label="Duración"
                counter
                :maxlength="PORTFOLIO_LIMITS.duration"
                autocomplete="off"
                placeholder="6 semanas"
                :error="errors.duration"
              />
            </div>
            <AdminInput
              id="portfolio-problem"
              v-model="values.problem"
              type="textarea"
              :rows="5"
              label="El problema"
              counter
              :maxlength="PORTFOLIO_LIMITS.story"
              hint="¿Qué le dolía al cliente o qué no funcionaba antes de empezar?"
              :error="errors.problem"
            />
            <AdminInput
              id="portfolio-decision"
              v-model="values.decision"
              type="textarea"
              :rows="5"
              label="Lo que decidiste y por qué"
              counter
              :maxlength="PORTFOLIO_LIMITS.story"
              hint="Qué elegiste hacer y por qué, en palabras del negocio."
              :error="errors.decision"
            />
            <AdminInput
              id="portfolio-result"
              v-model="values.result"
              type="textarea"
              :rows="5"
              label="El resultado"
              counter
              :maxlength="PORTFOLIO_LIMITS.story"
              hint="Qué cambió para el cliente. Solo lo que puedas comprobar."
              :error="errors.result"
            />
          </div>
        </PortfolioFormSection>

        <PortfolioFormSection
          id="portfolio-highlights"
          title="Cifras destacadas"
          description="Solo cifras que puedas comprobar y, si es un cliente, con su permiso. Si no tienes ninguna, déjalo vacío: es mejor no mostrar nada que inventarla."
        >
          <PortfolioHighlightsField
            id="portfolio-highlights-field"
            v-model="values.highlights"
            :errors="errors"
          />
        </PortfolioFormSection>

        <PortfolioFormSection
          id="portfolio-scope"
          title="Alcance y tecnologías"
          description="El alcance es lo que entregaste, en palabras del cliente. Las tecnologías van al final de la ficha: a quien contrata le importan menos."
        >
          <div class="space-y-4">
            <AdminChipList
              id="portfolio-scope-list"
              v-model="values.scope"
              label="Qué incluyó"
              :max="PORTFOLIO_LIMITS.listItems"
              :max-length="PORTFOLIO_LIMITS.listItem"
              placeholder="Catálogo en línea, pedidos por WhatsApp…"
              :error="errors.scope"
            />
            <AdminChipList
              id="portfolio-tech-list"
              v-model="values.technologies"
              label="Tecnologías"
              :max="PORTFOLIO_LIMITS.listItems"
              :max-length="PORTFOLIO_LIMITS.listItem"
              placeholder="Nuxt, PostgreSQL…"
              :error="errors.technologies"
            />
          </div>
        </PortfolioFormSection>

        <PortfolioFormSection
          id="portfolio-images"
          title="Imágenes"
          description="La portada es obligatoria para publicar; la galería muestra cómo se ve el proyecto."
        >
          <div class="space-y-6">
            <div class="rounded-xl bg-brand-surface-soft p-4 text-sm leading-6 text-brand-muted">
              <p class="font-semibold text-brand-ink">Cómo añadir una imagen</p>
              <p class="mt-1">
                Súbela desde aquí (JPEG, PNG o WebP de hasta 5 MB; se guarda como WebP) y la
                dirección se rellena sola. También puedes pegar una URL https o la ruta de un
                archivo que ya esté en
                <code class="rounded bg-brand-surface-card px-1 py-0.5 text-xs text-brand-ink">
                  public/projects/{{ folder }}/
                </code>
                , como
                <code class="rounded bg-brand-surface-card px-1 py-0.5 text-xs text-brand-ink">
                  /projects/{{ folder }}/cover.webp
                </code>
                . La vista previa te dice si se encuentra.
              </p>
              <ul class="mt-2 space-y-1 text-xs tabular-nums">
                <li>
                  <strong class="font-semibold text-brand-ink">Portada:</strong>
                  1280 × 720 px, WebP, hasta 100 KB.
                </li>
                <li>
                  <strong class="font-semibold text-brand-ink">Galería:</strong>
                  1600 × 900 px, WebP, hasta 150 KB cada una (ideal 3 a 6).
                </li>
                <li>
                  <strong class="font-semibold text-brand-ink">Para redes:</strong>
                  1200 × 630 px, JPG, hasta 100 KB.
                </li>
              </ul>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-3">
                <AdminInput
                  id="portfolio-cover"
                  v-model="values.coverPath"
                  label="Portada"
                  autocomplete="off"
                  :placeholder="`https://… o /projects/${folder}/cover.webp`"
                  hint="La imagen de la tarjeta y de la cabecera de la ficha."
                  :error="errors.coverPath"
                />
                <AdminImageUpload
                  id="portfolio-cover-upload"
                  folder="projects"
                  :label="values.coverPath ? 'Reemplazar portada' : 'Elegir portada'"
                  @uploaded="onCoverUploaded"
                />
                <PortfolioImagePreview :src="values.coverPath" label="Portada" />
              </div>
              <div class="space-y-3">
                <AdminInput
                  id="portfolio-og"
                  v-model="values.ogPath"
                  label="Imagen para redes (opcional)"
                  autocomplete="off"
                  :placeholder="`https://… o /projects/${folder}/og.jpg`"
                  hint="La que se ve al compartir el enlace. Si falta, se usa la del sitio."
                  :error="errors.ogPath"
                />
                <AdminImageUpload
                  id="portfolio-og-upload"
                  folder="projects"
                  :label="values.ogPath ? 'Reemplazar imagen' : 'Elegir imagen'"
                  @uploaded="onOgUploaded"
                />
                <PortfolioImagePreview
                  :src="values.ogPath"
                  ratio-class="aspect-1200/630"
                  label="Imagen para redes"
                />
              </div>
            </div>

            <fieldset>
              <legend class="mb-3 text-lg font-semibold text-brand-ink">Galería de la ficha</legend>
              <PortfolioGalleryField
                v-if="!isNew"
                id="portfolio-gallery"
                v-model="values.gallery"
                :errors="errors"
                :slug="values.slug"
              />
              <p v-else class="text-sm leading-6 text-brand-muted">
                Guarda el proyecto para añadir la galería: se crea como borrador y te lleva al
                editor, donde podrás sumar hasta {{ PORTFOLIO_LIMITS.gallery }} imágenes.
              </p>
            </fieldset>
          </div>
        </PortfolioFormSection>

        <PortfolioFormSection
          id="portfolio-publication"
          title="Publicación"
          description="Decide qué ve el público. Mientras no esté publicado, solo lo ves tú."
        >
          <PortfolioPublishPanel
            v-model:published="values.isPublished"
            v-model:status="values.status"
            v-model:featured="values.featured"
            v-model:sort-order="values.sortOrder"
            :record="record"
            :requirements="requirements"
            :errors="errors"
          />
        </PortfolioFormSection>
      </div>

      <!-- Barra de acciones: fija abajo desde md porque el formulario es largo -->
      <div
        class="-mx-5 mt-6 border-t border-brand-border bg-brand-surface px-5 py-3 md:sticky md:bottom-0 md:z-10 md:-mx-8 md:px-8"
      >
        <AdminNotice tone="error" :message="saveError" />
        <AdminNotice tone="success" :message="status" />
        <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <AdminButton variant="ghost" to="/admin/portfolio">
              <Icon name="mdi:arrow-left" size="20" aria-hidden="true" />
              Volver a la lista
            </AdminButton>
            <AdminBadge v-if="isDirty" tone="warning" icon="mdi:circle-edit-outline">
              Cambios sin guardar
            </AdminBadge>
            <AdminBadge v-else tone="neutral" icon="mdi:check">
              {{ isNew ? 'Sin cambios' : 'Todo guardado' }}
            </AdminBadge>
          </div>
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
              {{ isNew ? 'Crear proyecto' : 'Guardar cambios' }}
            </AdminButton>
          </div>
        </div>
      </div>
    </form>

    <PortfolioFormSection
      v-if="record"
      id="portfolio-danger"
      class="mt-6 max-w-4xl"
      title="Zona de peligro"
      tone="danger"
    >
      <p class="max-w-2xl text-sm leading-6 text-brand-muted">
        Eliminar el proyecto lo quita del portafolio y borra también su galería. No se puede
        deshacer. Si solo quieres que deje de verse, desactiva «Publicar en el sitio» y guarda.
      </p>
      <div class="mt-4">
        <AdminButton variant="danger" @click="askDelete = true">
          <Icon name="mdi:trash-can-outline" size="20" aria-hidden="true" />
          Eliminar proyecto
        </AdminButton>
      </div>
    </PortfolioFormSection>

    <AdminConfirmDialog
      :open="confirmKind !== null"
      :title="confirmKind === 'leave' ? '¿Salir sin guardar?' : '¿Descartar los cambios?'"
      :confirm-label="confirmKind === 'leave' ? 'Salir sin guardar' : 'Descartar cambios'"
      :cancel-label="confirmKind === 'leave' ? 'Seguir editando' : 'Cancelar'"
      @confirm="onConfirm"
      @close="onCancel"
    >
      <p v-if="confirmKind === 'leave'">
        Hiciste cambios en este proyecto que todavía no guardaste. Si sales ahora, se pierden.
      </p>
      <p v-else>
        El formulario vuelve a como estaba la última vez que guardaste. Lo que escribiste después se
        pierde.
      </p>
    </AdminConfirmDialog>

    <AdminConfirmDialog
      :open="askDelete"
      title="Eliminar proyecto"
      confirm-label="Eliminar proyecto"
      loading-label="Eliminando…"
      :busy="isRemoving"
      :error="removeError"
      @confirm="confirmDelete"
      @close="closeDelete"
    >
      <p v-if="record">
        Vas a eliminar
        <strong class="font-semibold text-brand-ink">«{{ record.title }}»</strong>
        y también su galería ({{ record.media.length }}
        {{ record.media.length === 1 ? 'imagen' : 'imágenes' }}). Esta acción no se puede deshacer{{
          record.isPublished ? ' y dejará de verse en el sitio' : ''
        }}.
      </p>
    </AdminConfirmDialog>
  </div>
</template>

<style>
  /* La barra de acciones es fija desde md: al enfocar un campo el navegador lo deja por encima de ella. */
  html:has(.portfolio-editor) {
    scroll-padding-bottom: 6rem;
  }
</style>
