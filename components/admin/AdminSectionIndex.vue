<script setup lang="ts">
  import { activeEditorSection, type EditorSectionItem } from '~/utils/admin/editorIndex'

  // Índice de secciones de un editor: anclas a cada bloque, con su estado (completa, vacía o con error) y un
  // contador opcional. Marca la sección visible al hacer scroll. Todo se lee también sin color (texto oculto).
  const props = defineProps<{ items: EditorSectionItem[] }>()

  const active = ref<string | null>(null)
  let observer: IntersectionObserver | undefined
  const crossing = new Set<string>()

  const ids = computed(() => props.items.map(item => item.id))

  const start = () => {
    observer?.disconnect()
    crossing.clear()
    if (typeof IntersectionObserver === 'undefined') return
    // Línea de lectura al 25 % de la ventana: la sección que la cruza es la activa.
    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(entry.target.id)
          else crossing.delete(entry.target.id)
        }
        active.value = activeEditorSection(ids.value, crossing) ?? active.value
      },
      { rootMargin: '-25% 0px -70% 0px' }
    )
    for (const id of ids.value) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
  }

  onMounted(() => {
    active.value = ids.value[0] ?? null
    start()
  })
  onBeforeUnmount(() => observer?.disconnect())

  const go = (id: string) => {
    const element = document.getElementById(id)
    if (!element) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    active.value = id
    // El foco pasa al encabezado de la sección para que el teclado continúe desde ahí.
    element.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
  }

  const icon = (status: EditorSectionItem['status']) =>
    status === 'ok'
      ? 'mdi:check-circle'
      : status === 'error'
        ? 'mdi:alert-circle'
        : 'mdi:circle-outline'
  const tone = (status: EditorSectionItem['status']) =>
    status === 'ok'
      ? 'text-brand-success-text'
      : status === 'error'
        ? 'text-brand-error-text'
        : 'text-brand-helper'
  const statusText = (status: EditorSectionItem['status']) =>
    status === 'ok' ? 'completa' : status === 'error' ? 'revisar' : 'vacía'
</script>

<template>
  <nav aria-label="Secciones del formulario">
    <ol class="space-y-0.5">
      <li v-for="item in items" :key="item.id">
        <a
          :href="`#${item.id}`"
          :aria-current="active === item.id ? 'location' : undefined"
          class="flex min-h-8 items-center gap-2 rounded-lg px-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-blue motion-reduce:transition-none"
          :class="
            active === item.id
              ? 'bg-brand-surface-soft font-semibold text-brand-ink'
              : 'text-brand-muted hover:bg-brand-surface-soft hover:text-brand-ink'
          "
          @click.prevent="go(item.id)"
        >
          <Icon
            :name="icon(item.status)"
            size="18"
            class="shrink-0"
            :class="tone(item.status)"
            aria-hidden="true"
          />
          <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
          <span v-if="item.count" class="text-xs tabular-nums text-brand-muted">
            {{ item.count }}
          </span>
          <span class="sr-only">: {{ statusText(item.status) }}</span>
        </a>
      </li>
    </ol>
  </nav>
</template>
