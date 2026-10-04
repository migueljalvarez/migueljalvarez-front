<script setup lang="ts">
  type TestimonialItem = {
    id: string
    name: string
    position: string
    testimonial: string
    type: string
    company: string
    image: string
  }

  definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
  })

  const STORAGE_KEY = 'dashboard-testimonials'
  const defaultItems: TestimonialItem[] = [
    {
      id: 'testimonial-1',
      name: 'Alfredo Rojas',
      position: 'Director de AR Stereo',
      testimonial: 'Excelente trabajo, muy claro y con un enfoque muy humano.',
      type: 'Cliente',
      company: 'AR Stereo',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
    }
  ]

  const items = ref<TestimonialItem[]>([])
  const selectedId = ref('')
  const form = ref<TestimonialItem>({
    id: '',
    name: '',
    position: '',
    testimonial: '',
    type: 'Cliente',
    company: '',
    image: ''
  })
  const isEditing = ref(false)

  const readItems = (): TestimonialItem[] => {
    if (typeof window === 'undefined') return defaultItems
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as TestimonialItem[]) : defaultItems
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
      name: '',
      position: '',
      testimonial: '',
      type: 'Cliente',
      company: '',
      image: ''
    }
    isEditing.value = false
  }

  const submitForm = () => {
    if (!form.value.name.trim() || !form.value.testimonial.trim()) return

    const payload = {
      ...form.value,
      name: form.value.name.trim(),
      position: form.value.position.trim(),
      company: form.value.company.trim(),
      image: form.value.image.trim(),
      testimonial: form.value.testimonial.trim(),
      type: form.value.type || 'Cliente'
    }

    if (isEditing.value && form.value.id) {
      items.value = items.value.map(item =>
        item.id === form.value.id ? { ...item, ...payload } : item
      )
    } else {
      items.value = [{ ...payload, id: `testimonial-${Date.now()}` }, ...items.value]
    }

    persist()
    selectedId.value = isEditing.value && form.value.id ? form.value.id : items.value[0]?.id || ''
    resetForm()
  }

  const viewItem = (item: TestimonialItem) => {
    selectedId.value = item.id
  }

  const selectedItem = computed(
    () => items.value.find(item => item.id === selectedId.value) || items.value[0]
  )

  const editItem = (item: TestimonialItem) => {
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
      <h1 class="mt-2 text-3xl font-semibold text-navy">Testimonios</h1>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-navy">Listado profesional</h2>
          <span class="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-xs font-semibold text-[#243B62]">
            {{ items.length }} testimonios
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
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="h-12 w-12 rounded-full object-cover"
                />
                <div
                  v-else
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF0FF] text-sm font-semibold text-[#243B62]"
                >
                  {{ item.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-lg font-semibold text-navy">{{ item.name }}</h3>
                    <span
                      class="rounded-full bg-[#EAF0FF] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#243B62]"
                    >
                      {{ item.type }}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-[#4D5868]">{{ item.position || 'Sin cargo' }}</p>
                  <p class="mt-2 text-sm leading-6 text-[#4D5868]">“{{ item.testimonial }}”</p>
                </div>
              </div>

              <div class="flex gap-2">
                <Button
                  theme="secondary"
                  size="sm"
                  class="w-auto px-2.5 py-1.5 text-xs"
                  @click="viewItem(item)"
                >
                  Ver detalle
                </Button>
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
          No hay testimonios creados aún.
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
          <h2 class="text-xl font-semibold text-navy">
            {{ isEditing ? 'Editar testimonio' : 'Nuevo testimonio' }}
          </h2>

          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Nombre</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Ana García"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Cargo</label>
              <input
                v-model="form.position"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Directora de Marketing"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Empresa</label>
              <input
                v-model="form.company"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Empresa o marca"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Tipo</label>
              <select
                v-model="form.type"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
              >
                <option value="Cliente">Cliente</option>
                <option value="Colaborador">Colaborador</option>
                <option value="Partner">Partner</option>
              </select>
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
              <label class="mb-1 block text-sm font-medium text-navy">Testimonio</label>
              <textarea
                v-model="form.testimonial"
                rows="4"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Escribe el testimonio..."
              />
            </div>

            <div class="flex gap-3 pt-2">
              <Button theme="primary" size="md" class="flex-1 w-auto" @click="submitForm">
                {{ isEditing ? 'Guardar cambios' : 'Crear testimonio' }}
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
          <h2 class="text-xl font-semibold text-navy">Detalle</h2>
          <div class="mt-4 flex items-center gap-3">
            <img
              v-if="selectedItem.image"
              :src="selectedItem.image"
              :alt="selectedItem.name"
              class="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <p class="text-lg font-semibold text-navy">{{ selectedItem.name }}</p>
              <p class="text-sm text-[#4D5868]">{{ selectedItem.position || 'Sin cargo' }}</p>
            </div>
          </div>
          <div class="mt-4 rounded-xl bg-[#F5F7FA] p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Empresa</p>
            <p class="mt-2 text-sm text-[#4D5868]">
              {{ selectedItem.company || 'No especificada' }}
            </p>
          </div>
          <div class="mt-3 rounded-xl bg-[#F5F7FA] p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">
              Testimonio
            </p>
            <p class="mt-2 text-sm leading-6 text-[#4D5868]">“{{ selectedItem.testimonial }}”</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
