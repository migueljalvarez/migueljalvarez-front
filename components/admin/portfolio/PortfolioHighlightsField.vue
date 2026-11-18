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
  const props = defineProps<{
    id: string
    modelValue: PortfolioHighlight[]
    errors: PortfolioErrors
  }>()
  const emit = defineEmits<{ 'update:modelValue': [value: PortfolioHighlight[]] }>()

  const root = ref<HTMLElement | null>(null)
  const liveMessage = ref('')
  const atLimit = computed(() => props.modelValue.length >= PORTFOLIO_LIMITS.highlights)

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

  const listError = computed(() => props.errors.highlights)
</script>

<template>
  <div ref="root">
    <ul v-if="modelValue.length" class="space-y-3" aria-label="Cifras destacadas">
      <li
        v-for="(item, index) in modelValue"
        :key="index"
        :data-row="index"
        class="rounded-xl border border-brand-border p-4"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
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
        <div class="grid gap-4 md:grid-cols-[10rem_minmax(0,1fr)]">
          <AdminInput
            :id="`${id}-${index}-value`"
            :model-value="item.value"
            label="Cifra"
            placeholder="30 %"
            required
            :maxlength="PORTFOLIO_LIMITS.highlightValue"
            autocomplete="off"
            :error="errors[`highlights.${index}.value`]"
            @update:model-value="set(index, 'value', String($event))"
          />
          <AdminInput
            :id="`${id}-${index}-label`"
            :model-value="item.label"
            label="Qué mide"
            placeholder="menos tiempo en cerrar el mes"
            required
            :maxlength="PORTFOLIO_LIMITS.highlightLabel"
            autocomplete="off"
            :error="errors[`highlights.${index}.label`]"
            @update:model-value="set(index, 'label', String($event))"
          />
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
          atLimit
            ? `Llegaste al máximo de ${PORTFOLIO_LIMITS.highlights} cifras`
            : `${modelValue.length} de ${PORTFOLIO_LIMITS.highlights} cifras`
        }}
      </p>
    </div>
    <p class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</p>
  </div>
</template>
