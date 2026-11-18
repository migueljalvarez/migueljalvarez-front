<script setup lang="ts">
  import AdminBadge from '~/components/admin/AdminBadge.vue'
  import AdminIconButton from '~/components/admin/AdminIconButton.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import {
    SOCIAL_NAME_MAX,
    SOCIAL_URL_MAX,
    isValidIcon,
    type SocialLinkDraft,
    type SocialLinkErrors
  } from '~/utils/admin/siteContent'

  // Una red social en edición: sus campos, vista previa del icono, visibilidad y acciones de orden.
  const props = defineProps<{
    modelValue: SocialLinkDraft
    index: number
    total: number
    errors: SocialLinkErrors
    /** Id de un `<datalist>` con iconos sugeridos. */
    iconListId: string
  }>()
  const emit = defineEmits<{
    'update:modelValue': [value: SocialLinkDraft]
    'move-up': []
    'move-down': []
    remove: []
    touch: [field: string]
  }>()

  const uid = useId()
  const set = (field: keyof SocialLinkDraft, value: string | number | boolean) =>
    emit('update:modelValue', { ...props.modelValue, [field]: value })

  // Al salir de un campo se avisa a la pantalla para mostrar su error (el id termina en el nombre del campo).
  const onFocusOut = (event: FocusEvent) => {
    const id = (event.target as HTMLElement).id ?? ''
    if (id.startsWith(`${uid}-`)) emit('touch', id.slice(uid.length + 1))
  }

  const displayName = computed(() => props.modelValue.name.trim() || 'esta red')
</script>

<template>
  <li
    :data-key="modelValue.key"
    class="rounded-2xl border border-brand-border bg-brand-surface-card p-5 md:p-6"
    @focusout="onFocusOut"
  >
    <div class="mb-4 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="truncate text-lg font-semibold text-brand-ink">
          {{ modelValue.name.trim() || 'Red nueva' }}
        </h2>
        <p class="mt-1 flex flex-wrap items-center gap-2 text-xs text-brand-muted">
          <span class="tabular-nums">Posición {{ index + 1 }} de {{ total }}</span>
          <AdminBadge
            :tone="modelValue.visible ? 'success' : 'neutral'"
            :icon="modelValue.visible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'"
          >
            {{ modelValue.visible ? 'Visible' : 'Oculta' }}
          </AdminBadge>
        </p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <AdminIconButton
          data-move="up"
          icon="mdi:arrow-up"
          :label="`Subir ${displayName}`"
          :disabled="index === 0"
          @click="emit('move-up')"
        />
        <AdminIconButton
          data-move="down"
          icon="mdi:arrow-down"
          :label="`Bajar ${displayName}`"
          :disabled="index === total - 1"
          @click="emit('move-down')"
        />
        <AdminIconButton
          data-remove
          tone="danger"
          icon="mdi:trash-can-outline"
          :label="`Quitar ${displayName}`"
          @click="emit('remove')"
        />
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <AdminInput
        :id="`${uid}-name`"
        :model-value="modelValue.name"
        label="Nombre"
        placeholder="LinkedIn"
        required
        :maxlength="SOCIAL_NAME_MAX"
        autocomplete="off"
        :error="errors.name"
        @update:model-value="set('name', $event)"
      />
      <AdminInput
        :id="`${uid}-icon`"
        :model-value="modelValue.icon"
        label="Icono"
        placeholder="mdi:linkedin"
        required
        autocomplete="off"
        :list="iconListId"
        hint="Formato prefijo:nombre. Elige uno de la lista o escribe el tuyo."
        :error="errors.icon"
        @update:model-value="set('icon', $event)"
      >
        <template #prefix>
          <span
            class="grid size-11 shrink-0 place-items-center rounded-lg border border-brand-helper bg-brand-surface-soft text-brand-accent"
            role="img"
            :aria-label="
              isValidIcon(modelValue.icon) ? 'Vista previa del icono' : 'Sin vista previa del icono'
            "
          >
            <Icon
              :name="isValidIcon(modelValue.icon) ? modelValue.icon.trim() : 'mdi:shape-outline'"
              size="22"
              :class="isValidIcon(modelValue.icon) ? '' : 'text-brand-helper'"
              aria-hidden="true"
            />
          </span>
        </template>
      </AdminInput>
      <div class="md:col-span-2">
        <AdminInput
          :id="`${uid}-url`"
          :model-value="modelValue.url"
          label="Enlace"
          placeholder="https://www.linkedin.com/in/tu-usuario"
          required
          inputmode="url"
          autocomplete="off"
          :maxlength="SOCIAL_URL_MAX"
          hint="Debe empezar por https:// o mailto: (para un correo)."
          :error="errors.url"
          @update:model-value="set('url', $event)"
        />
      </div>
      <div class="md:col-span-2">
        <AdminInput
          :id="`${uid}-visible`"
          :model-value="modelValue.visible"
          type="checkbox"
          label="Mostrar en el sitio"
          hint="Si la ocultas, se guarda pero no aparece en el sitio."
          @update:model-value="set('visible', $event)"
        />
      </div>
    </div>
  </li>
</template>
