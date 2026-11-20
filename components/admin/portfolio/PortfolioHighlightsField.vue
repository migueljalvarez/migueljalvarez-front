<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminIconButton from '~/components/admin/AdminIconButton.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import {
    PORTFOLIO_LIMITS,
    moveItem,
    type PortfolioErrors,
    type PortfolioHighlight
  } from '~/utils/admin/portfolio'

  // Cifras destacadas de la ficha: cada fila es una cifra y lo que mide. Se reordenan y se quitan con
  // botones de 44 px (también con teclado) y el foco no se pierde al moverlas.
  // Se reutiliza en "Sobre mí" (cifras) cambiando los límites, el prefijo de los errores y los ejemplos.
  const props = withDefaults(
    defineProps<{
      id: string
      modelValue: PortfolioHighlight[]
      errors: PortfolioErrors
      max?: number
      valueMax?: number
      labelMax?: number
      /** Prefijo de las claves de error (`highlights.0.value`). */
      errorPrefix?: string
      valuePlaceholder?: string
      labelPlaceholder?: string
      listLabel?: string
      /** Filas compactas: cifra y «qué mide» en la misma línea, con encabezado único y acciones pequeñas. */
      compact?: boolean
    }>(),
    {
      max: PORTFOLIO_LIMITS.highlights,
      valueMax: PORTFOLIO_LIMITS.highlightValue,
      labelMax: PORTFOLIO_LIMITS.highlightLabel,
      errorPrefix: 'highlights',
      valuePlaceholder: '30 %',
      labelPlaceholder: 'menos tiempo en cerrar el mes',
      listLabel: 'Cifras destacadas',
      compact: false
    }
  )
  const emit = defineEmits<{ 'update:modelValue': [value: PortfolioHighlight[]] }>()

  const root = ref<HTMLElement | null>(null)
  const liveMessage = ref('')
  const atLimit = computed(() => props.modelValue.length >= props.max)

  const set = (index: number, field: keyof PortfolioHighlight, value: string) =>
    emit(
      'update:modelValue',
      props.modelValue.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )

  const add = async () => {
    if (atLimit.value) return
    emit('update:modelValue', [...props.modelValue, { value: '', label: '' }])
    liveMessage.value = `Cifra ${props.modelValue.length + 1} añadida.`
    await nextTick()
    root.value
      ?.querySelector<HTMLElement>(`[data-row="${props.modelValue.length - 1}"] input`)
      ?.focus()
  }

  const remove = async (index: number) => {
    emit(
      'update:modelValue',
      props.modelValue.filter((_, i) => i !== index)
    )
    liveMessage.value = `Cifra ${index + 1} quitada.`
    await nextTick()
    const next = Math.min(index, props.modelValue.length - 1)
    ;(next >= 0
      ? root.value?.querySelector<HTMLElement>(`[data-row="${next}"] [data-remove]`)
      : document.getElementById(`${props.id}-add`)
    )?.focus()
  }

  const move = async (index: number, direction: -1 | 1) => {
    emit('update:modelValue', moveItem(props.modelValue, index, index + direction))
    liveMessage.value = `Cifra movida a la posición ${index + direction + 1} de ${props.modelValue.length}.`
    await nextTick()
    root.value
      ?.querySelector<HTMLElement>(
        `[data-row="${index + direction}"] [data-move="${direction === -1 ? 'up' : 'down'}"]`
      )
      ?.focus()
  }

  const listError = computed(() => props.errors[props.errorPrefix])
</script>

<template>
  <div ref="root">
    <div
      v-if="compact && modelValue.length"
      class="mb-1 hidden grid-cols-[6.5rem_minmax(0,1fr)_7rem] gap-2 px-3 text-xs font-medium text-brand-muted md:grid"
      aria-hidden="true"
    >
      <span>Cifra</span>
      <span>Qué mide</span>
      <span />
    </div>
    <ul
      v-if="modelValue.length"
      :class="compact ? 'space-y-2' : 'space-y-3'"
      :aria-label="listLabel"
    >
      <li
        v-for="(item, index) in modelValue"
        :key="index"
        :data-row="index"
        class="rounded-xl border border-brand-border"
        :class="compact ? 'px-3 py-2' : 'p-4'"
      >
        <div v-if="!compact" class="mb-4 flex items-center justify-between gap-3">
          <h3 class="text-sm font-semibold text-brand-ink">Cifra {{ index + 1 }}</h3>
          <div class="flex items-center gap-2">
            <AdminIconButton
              data-move="up"
              icon="mdi:arrow-up"
              :label="`Subir la cifra ${index + 1}`"
              :disabled="index === 0"
              @click="move(index, -1)"
            />
            <AdminIconButton
              data-move="down"
              icon="mdi:arrow-down"
              :label="`Bajar la cifra ${index + 1}`"
              :disabled="index === modelValue.length - 1"
              @click="move(index, 1)"
            />
            <AdminIconButton
              data-remove
              tone="danger"
              icon="mdi:trash-can-outline"
              :label="`Quitar la cifra ${index + 1}`"
              @click="remove(index)"
            />
          </div>
        </div>
        <div
          :class="
            compact
              ? 'grid items-start gap-2 md:grid-cols-[6.5rem_minmax(0,1fr)_7rem]'
              : 'grid gap-4 md:grid-cols-[10rem_minmax(0,1fr)]'
          "
        >
          <AdminInput
            :id="`${id}-${index}-value`"
            :model-value="item.value"
            label="Cifra"
            :label-hidden="compact ? 'desktop' : false"
            :placeholder="valuePlaceholder"
            required
            :maxlength="valueMax"
            autocomplete="off"
            :error="errors[`${errorPrefix}.${index}.value`]"
            @update:model-value="set(index, 'value', String($event))"
          />
          <AdminInput
            :id="`${id}-${index}-label`"
            :model-value="item.label"
            label="Qué mide"
            :label-hidden="compact ? 'desktop' : false"
            :placeholder="labelPlaceholder"
            required
            :maxlength="labelMax"
            autocomplete="off"
            :error="errors[`${errorPrefix}.${index}.label`]"
            @update:model-value="set(index, 'label', String($event))"
          />
          <div
            v-if="compact"
            class="flex items-center justify-end gap-0.5 md:justify-start md:pt-1"
          >
            <AdminIconButton
              data-move="up"
              size="sm"
              icon="mdi:arrow-up"
              :label="`Subir la cifra ${index + 1}`"
              :disabled="index === 0"
              @click="move(index, -1)"
            />
            <AdminIconButton
              data-move="down"
              size="sm"
              icon="mdi:arrow-down"
              :label="`Bajar la cifra ${index + 1}`"
              :disabled="index === modelValue.length - 1"
              @click="move(index, 1)"
            />
            <AdminIconButton
              data-remove
              size="sm"
              tone="danger"
              icon="mdi:trash-can-outline"
              :label="`Quitar la cifra ${index + 1}`"
              @click="remove(index)"
            />
          </div>
        </div>
      </li>
    </ul>

    <p v-if="listError" role="alert" class="mt-2 text-xs font-medium text-brand-error-text">
      {{ listError }}
    </p>

    <div
      class="flex flex-wrap items-center gap-x-4 gap-y-2"
      :class="modelValue.length ? 'mt-3' : ''"
    >
      <AdminButton :id="`${id}-add`" :disabled="atLimit" @click="add">
        <Icon name="mdi:plus" size="20" aria-hidden="true" />
        Añadir cifra
      </AdminButton>
      <p class="text-sm tabular-nums text-brand-muted">
        {{
          atLimit ? `Llegaste al máximo de ${max} cifras` : `${modelValue.length} de ${max} cifras`
        }}
      </p>
    </div>
    <p class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</p>
  </div>
</template>
