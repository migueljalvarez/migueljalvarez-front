<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AdminField from '~/components/admin/AdminField.vue'
  import { ADMIN_CONTROL_BASE, adminControlState } from '~/utils/admin/controlClass'
  import { cn } from '~/utils/cn'

  // Lista de textos cortos (etiquetas, alcance, tecnologías): se escribe, se añade con Enter o con el
  // botón y se quita con el botón de cada elemento. Todo con teclado; el foco vuelve al campo.
  const props = defineProps<{
    id: string
    label: string
    modelValue: string[]
    /** Máximo de elementos y de caracteres por elemento (los límites de la API). */
    max: number
    maxLength: number
    placeholder?: string
    hint?: string
    error?: string
  }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

  const draft = ref('')
  const localError = ref('')
  const input = ref<HTMLInputElement | null>(null)
  const liveMessage = ref('')

  const atLimit = computed(() => props.modelValue.length >= props.max)
  const shownError = computed(() => localError.value || props.error)

  const add = () => {
    const text = draft.value.trim()
    if (!text) {
      localError.value = 'Escribe algo antes de añadir.'
      return
    }
    if (atLimit.value) return
    if (props.modelValue.some(item => item.toLowerCase() === text.toLowerCase())) {
      localError.value = 'Ya lo añadiste.'
      return
    }
    emit('update:modelValue', [...props.modelValue, text])
    liveMessage.value = `«${text}» añadido. ${props.modelValue.length + 1} de ${props.max}.`
    draft.value = ''
    localError.value = ''
  }

  const remove = async (index: number) => {
    const removed = props.modelValue[index]
    emit(
      'update:modelValue',
      props.modelValue.filter((_, i) => i !== index)
    )
    liveMessage.value = `«${removed}» quitado.`
    await nextTick()
    input.value?.focus()
  }

  watch(draft, () => {
    localError.value = ''
  })
</script>

<template>
  <div>
    <AdminField
      :id="id"
      :label="label"
      :hint="hint"
      :error="shownError"
      :count="{ current: modelValue.length, max }"
    >
      <template #default="{ describedBy, invalid }">
        <div class="flex items-start gap-2">
          <input
            :id="id"
            ref="input"
            v-model="draft"
            type="text"
            autocomplete="off"
            :maxlength="maxLength"
            :placeholder="atLimit ? `Llegaste al máximo de ${max}` : placeholder"
            :disabled="atLimit"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
            :class="
              cn(
                ADMIN_CONTROL_BASE,
                adminControlState(invalid),
                'min-w-0 flex-1 disabled:cursor-not-allowed disabled:opacity-60'
              )
            "
            @keydown.enter.prevent="add"
          />
          <AdminButton :disabled="atLimit" @click="add">
            <Icon name="mdi:plus" size="20" aria-hidden="true" />
            Añadir
          </AdminButton>
        </div>
      </template>
    </AdminField>
    <ul v-if="modelValue.length" class="mt-2 flex flex-wrap gap-2" :aria-label="label">
      <li
        v-for="(item, index) in modelValue"
        :key="item"
        class="inline-flex min-h-11 max-w-full items-center rounded-full border border-brand-border bg-brand-surface-soft pl-3 text-sm text-brand-ink"
      >
        <span class="min-w-0 break-words">{{ item }}</span>
        <button
          type="button"
          class="ml-1 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-brand-muted transition hover:text-brand-error-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          :aria-label="`Quitar «${item}»`"
          @click="remove(index)"
        >
          <Icon name="mdi:close" size="18" aria-hidden="true" />
        </button>
      </li>
    </ul>
    <p class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</p>
  </div>
</template>
