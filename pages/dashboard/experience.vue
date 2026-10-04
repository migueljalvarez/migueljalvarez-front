<script setup lang="ts">
  type ExperienceItem = {
    id: string
    company: string
    role: string
    period: string
    type: string
    location: string
    description: string
    achievements: string
  }

  definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
  })

  const STORAGE_KEY = 'dashboard-experience'
  const defaultItems: ExperienceItem[] = [
    {
      id: 'experience-1',
      company: 'Freelance',
      role: 'Desarrollador Full Stack',
      period: '2022 - Presente',
      type: 'Freelance',
      location: 'Remote',
      description:
        'Diseño y desarrollo de productos digitales, MVPs, landing pages y plataformas para clientes y startups.',
      achievements:
        'Líder en la ejecución de productos digitales con enfoque comercial, UI/UX y código escalable.'
    },
    {
      id: 'experience-2',
      company: 'Agencia digital',
      role: 'Frontend Engineer',
      period: '2019 - 2022',
      type: 'Tiempo completo',
      location: 'Colombia',
      description:
        'Implementación de interfaces modernas, optimización de rendimiento y colaboración con equipos de diseño y producto.',
      achievements:
        'Optimización continua de experiencia de usuario y desarrollo de interfaces de alto impacto.'
    }
  ]

  const items = ref<ExperienceItem[]>([])
  const selectedId = ref('')
  const form = ref<ExperienceItem>({
    id: '',
    company: '',
    role: '',
    period: '',
    type: 'Tiempo completo',
    location: '',
    description: '',
    achievements: ''
  })
  const isEditing = ref(false)

  const readItems = (): ExperienceItem[] => {
    if (typeof window === 'undefined') return defaultItems
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as ExperienceItem[]) : defaultItems
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
      company: '',
      role: '',
      period: '',
      type: 'Tiempo completo',
      location: '',
      description: '',
      achievements: ''
    }
    isEditing.value = false
  }

  const submitForm = () => {
    if (!form.value.company.trim() || !form.value.role.trim() || !form.value.description.trim())
      return

    const payload = {
      ...form.value,
      company: form.value.company.trim(),
      role: form.value.role.trim(),
      period: form.value.period.trim(),
      type: form.value.type || 'Tiempo completo',
      location: form.value.location.trim(),
      description: form.value.description.trim(),
      achievements: form.value.achievements.trim()
    }

    if (isEditing.value && form.value.id) {
      items.value = items.value.map(item =>
        item.id === form.value.id ? { ...item, ...payload } : item
      )
    } else {
      items.value = [{ ...payload, id: `experience-${Date.now()}` }, ...items.value]
    }

    persist()
    selectedId.value = isEditing.value && form.value.id ? form.value.id : items.value[0]?.id || ''
    resetForm()
  }

  const viewItem = (item: ExperienceItem) => {
    selectedId.value = item.id
  }

  const selectedItem = computed(
    () => items.value.find(item => item.id === selectedId.value) || items.value[0]
  )

  const editItem = (item: ExperienceItem) => {
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
      <h1 class="mt-2 text-3xl font-semibold text-navy">Experiencia</h1>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-navy">Listado profesional</h2>
          <span class="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-xs font-semibold text-[#243B62]">
            {{ items.length }} experiencias
          </span>
        </div>

        <div v-if="items.length" class="space-y-3">
          <div
            v-for="item in items"
            :key="item.id"
            class="rounded-2xl border border-[#E9EEF5] bg-[#F5F7FA] p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-lg font-semibold text-navy">{{ item.role }}</h3>
                  <span
                    class="rounded-full bg-[#EAF0FF] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#243B62]"
                  >
                    {{ item.type }}
                  </span>
                </div>
                <p class="mt-2 text-sm font-medium text-[#243B62]">{{ item.company }}</p>
                <p class="mt-1 text-xs text-[#7E8897]">
                  {{ item.period }} · {{ item.location || 'Remoto' }}
                </p>
                <p class="mt-2 text-sm leading-6 text-[#4D5868]">{{ item.description }}</p>
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
          No hay experiencias creadas aún.
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
          <h2 class="text-xl font-semibold text-navy">
            {{ isEditing ? 'Editar experiencia' : 'Nueva experiencia' }}
          </h2>

          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Empresa</label>
              <input
                v-model="form.company"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Nombre de la empresa"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Cargo</label>
              <input
                v-model="form.role"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Desarrollador Frontend"
              />
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-navy">Periodo</label>
                <input
                  v-model="form.period"
                  type="text"
                  class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                  placeholder="2022 - 2024"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-navy">Tipo</label>
                <select
                  v-model="form.type"
                  class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                >
                  <option value="Tiempo completo">Tiempo completo</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Contrato">Contrato</option>
                  <option value="Práctica">Práctica</option>
                </select>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Ubicación</label>
              <input
                v-model="form.location"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Medellín, Colombia"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Descripción</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Describe tus responsabilidades..."
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Logros / achievements</label>
              <textarea
                v-model="form.achievements"
                rows="3"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
                placeholder="Resultados clave y responsabilidades..."
              />
            </div>

            <div class="flex gap-3 pt-2">
              <Button theme="primary" size="md" class="flex-1 w-auto" @click="submitForm">
                {{ isEditing ? 'Guardar cambios' : 'Crear experiencia' }}
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
          <div class="mt-4 rounded-xl bg-[#F5F7FA] p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Empresa</p>
            <p class="mt-2 text-base font-semibold text-navy">{{ selectedItem.company }}</p>
          </div>
          <div class="mt-3 rounded-xl bg-[#F5F7FA] p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Rol</p>
            <p class="mt-2 text-sm text-[#4D5868]">{{ selectedItem.role }}</p>
          </div>
          <div class="mt-3 rounded-xl bg-[#F5F7FA] p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Periodo</p>
            <p class="mt-2 text-sm text-[#4D5868]">
              {{ selectedItem.period }} · {{ selectedItem.location || 'Remoto' }}
            </p>
          </div>
          <div class="mt-3 rounded-xl bg-[#F5F7FA] p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">
              Descripción
            </p>
            <p class="mt-2 text-sm leading-6 text-[#4D5868]">{{ selectedItem.description }}</p>
          </div>
          <div class="mt-3 rounded-xl bg-[#F5F7FA] p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Logros</p>
            <p class="mt-2 text-sm leading-6 text-[#4D5868]">
              {{ selectedItem.achievements || 'Sin logros registrados' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
