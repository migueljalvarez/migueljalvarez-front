<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
  })

  type ProfileForm = {
    name: string
    profession: string
    jobDescription: string
    image: string
    imageAlt: string
  }

  const STORAGE_KEY = 'dashboard-profile'
  const defaultProfile: ProfileForm = {
    name: 'Miguel Álvarez',
    profession: 'Desarrollador de software',
    jobDescription:
      'Creo soluciones digitales que combinan estrategia, diseño y código para resolver problemas reales.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Retrato profesional de Miguel Álvarez'
  }

  const form = ref<ProfileForm>({ ...defaultProfile })

  const readProfile = (): ProfileForm => {
    if (typeof window === 'undefined') return defaultProfile
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as ProfileForm) : defaultProfile
    } catch {
      return defaultProfile
    }
  }

  const saveProfile = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value))
    }
  }

  onMounted(() => {
    form.value = readProfile()
  })
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Dashboard</p>
      <h1 class="mt-2 text-3xl font-semibold text-navy">Datos del Hero</h1>
    </div>

    <div class="rounded-2xl border border-[#E9EEF5] bg-white p-6 shadow-sm">
      <h2 class="text-xl font-semibold text-navy">Perfil principal</h2>

      <div class="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-navy">Nombre</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-navy">Profesión</label>
          <input
            v-model="form.profession"
            type="text"
            class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
          />
        </div>
      </div>

      <div class="mt-4">
        <label class="mb-1 block text-sm font-medium text-navy">Descripción</label>
        <textarea
          v-model="form.jobDescription"
          rows="5"
          class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
        />
      </div>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-navy">
            Imagen principal (Cloudinary URL)
          </label>
          <input
            v-model="form.image"
            type="url"
            class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
            placeholder="https://res.cloudinary.com/.../image/upload/..."
          />
          <p class="mt-1 text-xs text-[#7E8897]">
            Idealmente usa una URL de Cloudinary para imágenes optimizadas y profesionales.
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-navy">Texto alt de la imagen</label>
          <input
            v-model="form.imageAlt"
            type="text"
            class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
          />
        </div>
      </div>

      <div class="mt-5 rounded-2xl border border-[#E9EEF5] bg-[#F5F7FA] p-4">
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">
          Vista previa
        </p>
        <div class="flex items-center gap-4">
          <img
            v-if="form.image"
            :src="form.image"
            :alt="form.imageAlt || form.name"
            class="h-24 w-24 rounded-full object-cover shadow-sm"
          />
          <div>
            <p class="text-lg font-semibold text-navy">{{ form.name }}</p>
            <p class="text-sm text-[#4D5868]">{{ form.profession }}</p>
          </div>
        </div>
      </div>

      <div class="mt-5 flex justify-end">
        <Button theme="primary" size="md" class="w-auto" @click="saveProfile">
          Guardar cambios
        </Button>
      </div>
    </div>
  </div>
</template>
