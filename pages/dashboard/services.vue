<script setup lang="ts">
  type ServiceItem = {
    id: string
    title: string
    description: string
    icon: string
  }

  definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
  })

  const STORAGE_KEY = 'dashboard-services'
  const defaultServices: ServiceItem[] = [
    {
      id: 'service-1',
      title: 'Desarrollo web',
      description: 'Sitios y aplicaciones web modernas con performance y UX cuidada.',
      icon: 'mdi:code-braces'
    },
    {
      id: 'service-2',
      title: 'E-commerce',
      description: 'Tiendas y experiencias de compra enfocadas en conversión.',
      icon: 'mdi:shopping'
    }
  ]

  const items = ref<ServiceItem[]>([])
  const form = ref<ServiceItem>({
    id: '',
    title: '',
    description: '',
    icon: 'mdi:code-braces'
  })
  const isEditing = ref(false)

  const readItems = (): ServiceItem[] => {
    if (typeof window === 'undefined') return defaultServices
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as ServiceItem[]) : defaultServices
    } catch {
      return defaultServices
    }
  }

  const persist = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    }
  }

  const resetForm = () => {
    form.value = { id: '', title: '', description: '', icon: 'mdi:code-braces' }
    isEditing.value = false
  }

  const submitForm = () => {
    if (!form.value.title.trim() || !form.value.description.trim()) return

    const payload = {
      ...form.value,
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      icon: form.value.icon || 'mdi:code-braces'
    }

    if (isEditing.value && form.value.id) {
      items.value = items.value.map(item =>
        item.id === form.value.id ? { ...item, ...payload } : item
      )
    } else {
      items.value = [{ ...payload, id: `service-${Date.now()}` }, ...items.value]
    }

    persist()
    resetForm()
  }

  const editItem = (item: ServiceItem) => {
    form.value = { ...item }
    isEditing.value = true
  }

  const deleteItem = (id: string) => {
    items.value = items.value.filter(item => item.id !== id)
    persist()
    if (form.value.id === id) resetForm()
  }

  onMounted(() => {
    items.value = readItems()
  })
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Dashboard</p>
      <h1 class="mt-2 text-3xl font-semibold text-navy">Servicios</h1>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-navy">Listado</h2>
          <span class="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-xs font-semibold text-[#243B62]">
            {{ items.length }} elementos
          </span>
        </div>

        <div v-if="items.length" class="space-y-3">
          <div
            v-for="item in items"
            :key="item.id"
            class="rounded-2xl border border-[#E9EEF5] bg-[#F5F7FA] p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3">
                <div
                  class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0FF] text-[#243B62]"
                >
                  <Icon :name="item.icon || 'mdi:code-braces'" size="22" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-navy">{{ item.title }}</h3>
                  <p class="mt-1 text-sm text-[#4D5868]">{{ item.description }}</p>
                </div>
              </div>

              <div class="flex gap-2">
                <Button
                  theme="secondary"
                  size="sm"
                  class="w-auto px-2.5 py-1.5 text-xs"
                  @click="editItem(item)"
                >
                  Editar
                </Button>
                <Button
                  theme="secondary"
                  size="sm"
                  class="w-auto border-[#F4D7D7] bg-white px-2.5 py-1.5 text-xs text-[#B42318] hover:bg-[#FDF2F2]"
                  @click="deleteItem(item.id)"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-[#D7E3F5] bg-[#F5F7FA] p-6 text-sm text-[#4D5868]"
        >
          No hay servicios creados aún.
        </div>
      </div>

      <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
        <h2 class="text-xl font-semibold text-navy">
          {{ isEditing ? 'Editar servicio' : 'Nuevo servicio' }}
        </h2>

        <div class="mt-5 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-navy">Título</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
              placeholder="Desarrollo web"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-navy">Icono</label>
            <input
              v-model="form.icon"
              type="text"
              class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
              placeholder="mdi:code-braces"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-navy">Descripción</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
              placeholder="Describe el servicio..."
            />
          </div>

          <div class="flex gap-3 pt-2">
            <Button theme="primary" size="md" class="flex-1 w-auto" @click="submitForm">
              {{ isEditing ? 'Guardar cambios' : 'Crear servicio' }}
            </Button>
            <Button v-if="isEditing" theme="secondary" size="md" class="w-auto" @click="resetForm">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
