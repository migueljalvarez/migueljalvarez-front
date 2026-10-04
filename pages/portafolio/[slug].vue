<script lang="ts" setup>
  import Button from '~/components/atoms/Button/Button.vue'
  import type { PortafolioType } from '~/types/common'

  definePageMeta({
    layout: 'default',
    keepalive: true,
    title: 'Detalle del proyecto'
  })

  const route = useRoute()
  const slug = computed(() => String(route.params.slug || ''))
  const project = ref<PortafolioType | null>(null)

  const projectData = await useFetch('/api/portafolio')
  const projects = computed(() => (projectData.data.value as PortafolioType[]) ?? [])

  watch(
    () => slug.value,
    value => {
      if (!value) return
      const found = (projects.value as PortafolioType[]).find(item => item.slug === value)
      project.value = found ?? null
    },
    { immediate: true }
  )

  const hasProblem = computed(() => !!project.value?.problem?.trim())
  const hasDecision = computed(() => !!project.value?.decision?.trim())
  const hasResult = computed(() => !!project.value?.result?.trim())
  const hasGallery = computed(() => !!project.value?.gallery?.length)
</script>

<template>
  <section class="w-full bg-brand-surface px-4 py-8 md:py-12">
    <div v-if="project" class="mx-auto w-full max-w-6xl">
      <div class="mb-6">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-sm font-medium text-brand-muted"
        >
          <Icon name="mdi:arrow-left" size="18" />
          Volver al inicio
        </NuxtLink>
      </div>

      <article
        class="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[0_18px_40px_rgba(18,30,48,0.08)]"
      >
        <div class="p-5 md:p-8">
          <div
            class="mb-4 inline-flex items-center rounded-full border border-brand-border bg-brand-surface-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-blue"
          >
            {{ project.portfolioType }}
          </div>

          <h1 class="text-3xl font-semibold text-brand-navy md:text-5xl">
            {{ project.title }}
          </h1>
        </div>

        <div v-if="project.urlImage" class="px-5 pb-5 md:px-8 md:pb-8">
          <NuxtImg
            :src="project.urlImage"
            :alt="project.title"
            format="webp"
            class="h-[260px] w-full rounded-2xl object-cover md:h-[420px]"
          />
        </div>

        <div class="space-y-8 px-5 pb-8 md:px-8 md:pb-10">
          <section v-if="hasProblem" class="pt-2">
            <h2 class="mb-3 text-xl font-semibold text-brand-blue md:text-2xl">El problema</h2>
            <p class="text-base leading-7 text-brand-muted">
              {{ project.problem }}
            </p>
          </section>

          <section v-if="hasDecision" class="pt-2">
            <h2 class="mb-3 text-xl font-semibold text-brand-blue md:text-2xl">
              La decisión técnica
            </h2>
            <p class="text-base leading-7 text-brand-muted">
              {{ project.decision }}
            </p>
          </section>

          <section v-if="hasResult" class="pt-2">
            <h2 class="mb-3 text-xl font-semibold text-brand-blue md:text-2xl">El resultado</h2>
            <p class="text-base leading-7 text-brand-muted">
              {{ project.result }}
            </p>
          </section>

          <section v-if="project.technologies?.length" class="pt-2">
            <h2 class="mb-3 text-xl font-semibold text-brand-blue md:text-2xl">Stack técnico</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tech, index) in project.technologies"
                :key="`${tech}-${index}`"
                class="rounded-full border border-brand-border bg-brand-surface-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-navy"
              >
                {{ tech }}
              </span>
            </div>
          </section>

          <section v-if="hasGallery" class="pt-2">
            <h2 class="mb-4 text-xl font-semibold text-brand-blue md:text-2xl">Galería</h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <NuxtImg
                v-for="(image, index) in project.gallery"
                :key="`${image}-${index}`"
                :src="image"
                :alt="`${project.title} vista ${index + 1}`"
                format="webp"
                class="h-52 w-full rounded-2xl object-cover"
              />
            </div>
          </section>

          <div class="pt-4">
            <p class="mb-4 text-lg font-medium text-brand-navy">
              ¿Tienes un proyecto similar en mente?
            </p>
            <NuxtLink to="https://wa.link/bxjfgq" target="_blank">
              <Button icon="mdi:whatsapp" icon-position="left" theme="tertiary">
                Hablemos por WhatsApp
              </Button>
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <div
      v-else
      class="mx-auto max-w-2xl rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm"
    >
      <h1 class="text-2xl font-semibold text-brand-navy">Proyecto no encontrado</h1>
      <p class="mt-3 text-brand-muted">No existe un detalle disponible para esta ruta.</p>
      <NuxtLink to="/portafolio" class="mt-5 inline-block">
        <Button theme="secondary">Volver al portafolio</Button>
      </NuxtLink>
    </div>
  </section>
</template>
