<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
  })

  type CvForm = {
    fullName: string
    email: string
    phone: string
    city: string
    summary: string
    experience: string
    skills: string
    tools: string
  }

  const initialForm: CvForm = {
    fullName: 'Miguel Álvarez',
    email: 'ing.migueljalvarez@gmail.com',
    phone: '+57 320 318 7076',
    city: 'Medellín, Colombia',
    summary:
      'Desarrollador de software con más de 9 años de experiencia creando productos digitales, MVPs y soluciones web de alto rendimiento.',
    experience:
      '- Desarrollo de landing pages y sistemas web para clientes y startups.\n- Diseño de MVPs con enfoque comercial y técnico.\n- Optimización de rendimiento, UX y mantenimiento de productos en producción.',
    skills: 'Nuxt, Vue, TypeScript, JavaScript, Node.js, Tailwind, Firebase, PostgreSQL, APIs REST',
    tools: 'Git, GitHub, Vercel, Netlify, Figma, Postman, Jira'
  }

  const form = ref<CvForm>({ ...initialForm })
  const output = computed(() => {
    const sections = [
      `Nombre: ${form.value.fullName}`,
      `Email: ${form.value.email}`,
      `Teléfono: ${form.value.phone}`,
      `Ubicación: ${form.value.city}`,
      '',
      'Resumen',
      form.value.summary,
      '',
      'Experiencia',
      form.value.experience,
      '',
      'Habilidades',
      form.value.skills,
      '',
      'Herramientas',
      form.value.tools
    ]

    return sections.join('\n')
  })

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(output.value)
      alert('CV copiado al portapapeles')
    } catch (error) {
      console.error('Error copiando texto:', error)
    }
  }

  const downloadText = () => {
    const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cv-ats-miguel-alvarez.txt'
    link.click()
    URL.revokeObjectURL(url)
  }
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#7E8897]">Dashboard</p>
      <h1 class="mt-2 text-3xl font-semibold text-navy">CV / ATS</h1>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
        <h2 class="text-xl font-semibold text-navy">Datos del perfil</h2>

        <div class="mt-5 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-navy">Nombre completo</label>
            <input
              v-model="form.fullName"
              type="text"
              class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
            />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Email</label>
              <input
                v-model="form.email"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-navy">Teléfono</label>
              <input
                v-model="form.phone"
                type="text"
                class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
              />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-navy">Ciudad</label>
            <input
              v-model="form.city"
              type="text"
              class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-navy">Resumen</label>
            <textarea
              v-model="form.summary"
              rows="4"
              class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-navy">Experiencia</label>
            <textarea
              v-model="form.experience"
              rows="5"
              class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-navy">Habilidades</label>
            <textarea
              v-model="form.skills"
              rows="3"
              class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-navy">Herramientas</label>
            <textarea
              v-model="form.tools"
              rows="3"
              class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none focus:border-[#243B62]"
            />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-[#E9EEF5] bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-navy">Vista previa ATS</h2>
          <div class="flex gap-2">
            <Button theme="secondary" size="md" class="w-auto" @click="copyText">Copiar</Button>
            <Button theme="primary" size="md" class="w-auto" @click="downloadText">
              Descargar
            </Button>
          </div>
        </div>

        <pre
          class="mt-5 whitespace-pre-wrap rounded-2xl bg-[#0F172A] p-4 text-sm leading-6 text-slate-100"
          >{{ output }}</pre>
      </div>
    </div>
  </div>
</template>
