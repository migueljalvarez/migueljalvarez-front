<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminRadioGroup from '~/components/admin/AdminRadioGroup.vue'
  import {
    PORTFOLIO_LIMITS,
    formatPortfolioDate,
    portfolioStateBadge,
    publicPortfolioPath,
    type PortfolioDetailRecord,
    type PortfolioErrors,
    type PortfolioStatus,
    type PublishRequirement
  } from '~/utils/admin/portfolio'

  // Publicación: qué ve hoy el público, qué falta para publicar y cómo se mostrará. Lo que se elige aquí
  // se aplica al guardar el proyecto (misma barra de acciones que el resto del formulario).
  const props = defineProps<{
    /** Última versión guardada; `null` mientras el proyecto aún no existe. */
    record: PortfolioDetailRecord | null
    requirements: PublishRequirement[]
    errors: PortfolioErrors
    /**
     * `status`: estado, requisitos, botón de publicar y enlace al sitio (columna lateral del editor).
     * `settings`: cómo se muestra, destacado y orden (sección del formulario).
     */
    part: 'status' | 'settings'
  }>()
  const published = defineModel<boolean>('published', { required: true })
  const status = defineModel<PortfolioStatus>('status', { required: true })
  const featured = defineModel<boolean>('featured', { required: true })
  const sortOrder = defineModel<string>('sortOrder', { required: true })

  const STATUS_OPTIONS = [
    {
      value: 'published',
      label: 'Proyecto completo',
      description:
        'Tarjeta en la home y en /portafolio, con ficha de detalle (problema, decisión, resultado y galería).'
    },
    {
      value: 'in-development',
      label: 'En desarrollo',
      description:
        'Solo la tarjeta con la etiqueta «En desarrollo»: sin ficha de detalle ni enlace.'
    }
  ]

  const MISSING_PHRASE = { cover: 'la portada', description: 'la descripción' }
  const missing = computed(() => props.requirements.filter(item => !item.met))
  const canPublish = computed(() => missing.value.length === 0)
  const savedBadge = computed(() =>
    props.record
      ? portfolioStateBadge(props.record)
      : { label: 'Borrador', tone: 'neutral' as const }
  )
  const targetBadge = computed(() =>
    portfolioStateBadge({ isPublished: published.value, status: status.value })
  )
  const pending = computed(
    () => !!props.record && targetBadge.value.label !== savedBadge.value.label
  )
  const sitePath = computed(() => (props.record ? publicPortfolioPath(props.record) : ''))

  const publishHint = computed(() => {
    if (!props.record)
      return 'Se crea como borrador. Cuando lo guardes podrás publicarlo desde aquí.'
    if (!canPublish.value && !published.value) {
      return `Aún no se puede publicar: falta ${missing.value.map(item => MISSING_PHRASE[item.id]).join(' y ')}.`
    }
    return published.value
      ? 'Visible para todo el mundo en la home y en /portafolio. Desactívalo para ocultarlo.'
      : 'Está oculto: nadie lo ve en el sitio. Actívalo para publicarlo.'
  })
</script>

<template>
  <div v-if="part === 'status'" class="space-y-3">
    <div class="flex flex-wrap items-center gap-2">
      <AdminBadge :tone="savedBadge.tone">{{ savedBadge.label }}</AdminBadge>
      <AdminBadge v-if="record?.featured" tone="neutral" icon="mdi:star-outline">
        Destacado
      </AdminBadge>
    </div>
    <p class="-mt-1 text-xs text-brand-muted">
      <template v-if="record?.publishedAt">
        Publicado por primera vez el {{ formatPortfolioDate(record.publishedAt) }}.
      </template>
      <template v-else>Aún no se ha publicado.</template>
    </p>

    <!-- Con todo cumplido basta una línea; si falta algo, se listan los requisitos. -->
    <p v-if="canPublish" class="flex items-center gap-2 text-sm text-brand-success-text">
      <Icon name="mdi:check-circle-outline" size="20" class="shrink-0" aria-hidden="true" />
      Requisitos para publicar cumplidos
    </p>
    <ul v-else class="space-y-1" aria-label="Requisitos para publicar">
      <li
        v-for="item in requirements"
        :key="item.id"
        class="flex items-center gap-2 text-sm"
        :class="item.met ? 'text-brand-success-text' : 'text-brand-error-text'"
      >
        <Icon
          :name="item.met ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'"
          size="20"
          class="shrink-0"
          aria-hidden="true"
        />
        <span>{{ item.label }}</span>
        <span class="sr-only">{{ item.met ? ': cumplido' : ': falta' }}</span>
      </li>
    </ul>

    <AdminButton
      id="portfolio-published"
      :variant="published ? 'secondary' : 'primary'"
      class="w-full"
      :disabled="!record || (!canPublish && !published)"
      aria-describedby="portfolio-published-hint"
      @click="published = !published"
    >
      <Icon
        :name="published ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
        size="20"
        aria-hidden="true"
      />
      {{ published ? 'Despublicar' : 'Publicar' }}
    </AdminButton>
    <p id="portfolio-published-hint" class="-mt-1 text-xs leading-5 text-brand-muted">
      {{ publishHint }}
    </p>

    <p
      v-if="pending"
      class="flex items-start gap-2 text-sm font-medium text-brand-warning-text"
      role="status"
    >
      <Icon name="mdi:circle-edit-outline" size="20" class="mt-0.5 shrink-0" aria-hidden="true" />
      Al guardar quedará como «{{ targetBadge.label }}».
    </p>

    <div v-if="record" class="border-t border-brand-border pt-3">
      <AdminButton v-if="sitePath" :href="sitePath" class="w-full">
        <Icon name="mdi:open-in-new" size="20" aria-hidden="true" />
        Ver en el sitio
        <span class="sr-only">(se abre en una pestaña nueva)</span>
      </AdminButton>
      <p v-else class="text-sm text-brand-muted">
        {{
          record.isPublished
            ? 'Este proyecto aparece como tarjeta «En desarrollo»; no tiene ficha para abrir.'
            : 'Cuando lo publiques como proyecto completo, aquí tendrás el enlace a su ficha en el sitio.'
        }}
      </p>
    </div>
  </div>

  <div v-else class="space-y-6">
    <AdminRadioGroup
      v-model="status"
      legend="Cómo se muestra cuando está publicado"
      name="portfolio-status"
      :options="STATUS_OPTIONS"
    />

    <div class="grid gap-4 md:grid-cols-2">
      <AdminInput
        id="portfolio-featured"
        v-model="featured"
        type="checkbox"
        label="Destacado"
        hint="Los destacados van primero, y el primero se muestra en grande en la home."
      />
      <AdminInput
        id="portfolio-sort"
        v-model="sortOrder"
        label="Orden"
        inputmode="numeric"
        autocomplete="off"
        required
        :maxlength="4"
        :hint="`Número de 0 a ${PORTFOLIO_LIMITS.sortOrder}. De menor a mayor; con el mismo número va primero el publicado más reciente.`"
        :error="errors.sortOrder"
      />
    </div>
  </div>
</template>
