<script setup lang="ts">
  type PortfolioItem = {
    id: string
    title: string
    type: string
    description: string
    url: string
    technologies: string
    image: string
    client: string
    challenge: string
    solution: string
  }

  definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
  })

  const STORAGE_KEY = 'dashboard-portfolio'
  const defaultItems: PortfolioItem[] = [
    {
      id: 'portfolio-1',
      title: 'Mi Comodoro',
      type: 'Producto propio',
      description: 'Aplicación para gestionar finanzas personales y presupuesto familiar.',
      url: 'https://example.com',
      technologies: 'Nuxt, Tailwind, PostgreSQL',
      image:
        'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
      client: 'Propio',
      challenge: 'Necesidad de centralizar ingresos, gastos y metas en un solo dashboard amigable.',
      solution: 'Desarrollo de un producto con UX clara, información visual y métricas accionables.'
    }
  ]

  const items = ref<PortfolioItem[]>([])
  const selectedId = ref('')
  const form = ref<PortfolioItem>({
    id: '',
    title: '',
    type: 'Cliente',
    description: '',
    url: '',
    technologies: '',
    image: '',
    client: '',
    challenge: '',
    solution: ''
  })
  const isEditing = ref(false)

  const readItems = (): PortfolioItem[] => {
    if (typeof window === 'undefined') return defaultItems
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as PortfolioItem[]) : defaultItems
    } catch {
      return defaultItems
    }
  }

  const persist = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    }
  }

  const resetForm = () => {
    form.value = {
      id: '',
      title: '',
      type: 'Cliente',
      description: '',
      url: '',
      technologies: '',
      image: '',
      client: '',
      challenge: '',
      solution: ''
    }
    isEditing.value = false
  }

  const submitForm = () => {
    if (!form.value.title.trim() || !form.value.description.trim()) return

    const payload = {
      ...form.value,
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      type: form.value.type || 'Cliente',
      url: form.value.url.trim(),
      technologies: form.value.technologies.trim(),
      image: form.value.image.trim(),
      client: form.value.client.trim(),
      challenge: form.value.challenge.trim(),
      solution: form.value.solution.trim()
    }

    if (isEditing.value && form.value.id) {
      items.value = items.value.map(item =>
        item.id === form.value.id ? { ...item, ...payload } : item
      )
    } else {
      items.value = [{ ...payload, id: `portfolio-${Date.now()}` }, ...items.value]
    }

    persist()
    selectedId.value = isEditing.value && form.value.id ? form.value.id : items.value[0]?.id || ''
    resetForm()
  }

  const viewItem = (item: PortfolioItem) => {
    selectedId.value = item.id
  }

  const selectedItem = computed(
    () => items.value.find(item => item.id === selectedId.value) || items.value[0]
  )

  const editItem = (item: PortfolioItem) => {
    form.value = { ...item }
    isEditing.value = true
  }

  const deleteItem = (id: string) => {
    items.value = items.value.filter(item => item.id !== id)
    persist()
    if (selectedId.value === id) {
      selectedId.value = items.value[0]?.id || ''
    }
    if (form.value.id === id) resetForm()
  }

  onMounted(() => {
    items.value = readItems()
    selectedId.value = items.value[0]?.id || ''
  })
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Dashboard</p>
      <h1 class="mt-2 text-3xl font-semibold text-navy">Portafolio</h1>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-navy">Listado profesional</h2>
          <span class="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-xs font-semibold text-[#243B62]">
            {{ items.length }} proyectos
          </span>
        </div>

        <div v-if="items.length" class="space-y-3">
          <div
            v-for="item in items"
            :key="item.id"
            class="rounded-2xl border border-[#E9EEF5] bg-[#F5F7FA] p-3"
          >
            <div class="flex gap-4">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                class="h-24 w-24 rounded-xl object-cover"
              />
              <div class="flex-1">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <h3 class="text-lg font-semibold text-navy">{{ item.title }}</h3>
                    <span
                      class="rounded-full bg-[#EAF0FF] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#243B62]"
                    >
                      {{ item.type }}
                    </span>
                  </div>
                  <Button
                    theme="secondary"
                    size="sm"
                    class="w-auto px-2.5 py-1.5 text-xs"
                    @click="viewItem(item)"
                  >
                    Ver detalle
                  </Button>
                </div>

                <p class="mt-2 text-sm text-[#4D5868]">{{ item.description }}</p>
                <p class="mt-2 text-xs text-[#7E8897]">
                  {{ item.technologies || 'Sin tecnologías' }}
                </p>

                <div class="mt-3 flex gap-2">
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
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-[#D7E3F5] bg-[#F5F7FA] p-6 text-sm text-[#4D5868]"
        >
          No hay proyectos creados aún.
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
          <h2 class="text-xl font-semibold text-navy">
            {{ isEditing ? 'Editar proyecto' : 'Nuevo proyecto' }}
          </h2>

          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Título</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Mi Comodoro"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Tipo</label>
              <select
                v-model="form.type"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
              >
                <option value="Cliente">Cliente</option>
                <option value="Producto propio">Producto propio</option>
                <option value="Próximo proyecto">Próximo proyecto</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Cliente</label>
              <input
                v-model="form.client"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Empresa o marca"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">URL</label>
              <input
                v-model="form.url"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">
                Imagen (Cloudinary URL)
              </label>
              <input
                v-model="form.image"
                type="url"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="https://res.cloudinary.com/..."
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Tecnologías</label>
              <input
                v-model="form.technologies"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Nuxt, Tailwind, Firebase"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Descripción</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Resumen del proyecto..."
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Desafío</label>
              <textarea
                v-model="form.challenge"
                rows="3"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Qué problema se resolvía..."
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Solución</label>
              <textarea
                v-model="form.solution"
                rows="3"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Cómo se resolvió..."
              />
            </div>

            <div class="flex gap-3 pt-2">
              <Button theme="primary" size="md" class="flex-1 w-auto" @click="submitForm">
                {{ isEditing ? 'Guardar cambios' : 'Crear proyecto' }}
              </Button>
              <Button
                v-if="isEditing"
                theme="secondary"
                size="md"
                class="w-auto"
                @click="resetForm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>

        <div v-if="selectedItem" class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-navy">Detalle</h2>
            <span
              class="rounded-full bg-[#EEF3FF] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243B62]"
            >
              {{ selectedItem.type }}
            </span>
          </div>

          <div class="mt-4 overflow-hidden rounded-xl border border-[#E9EEF5] bg-[#F5F7FA]">
            <img
              v-if="selectedItem.image"
              :src="selectedItem.image"
              :alt="selectedItem.title"
              class="h-44 w-full object-cover"
            />
          </div>

          <h3 class="mt-4 text-lg font-semibold text-navy">{{ selectedItem.title }}</h3>
          <p class="mt-1 text-sm text-[#4D5868]">
            {{ selectedItem.client || 'Proyecto personal' }}
          </p>
          <p class="mt-3 text-sm leading-6 text-[#4D5868]">{{ selectedItem.description }}</p>
          <div class="mt-4 rounded-xl bg-[#F5F7FA] p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Desafío</p>
            <p class="mt-2 text-sm text-[#4D5868]">
              {{ selectedItem.challenge || 'Sin detalle registrado' }}
            </p>
          </div>
          <div class="mt-3 rounded-xl bg-[#F5F7FA] p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Solución</p>
            <p class="mt-2 text-sm text-[#4D5868]">
              {{ selectedItem.solution || 'Sin detalle registrado' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
