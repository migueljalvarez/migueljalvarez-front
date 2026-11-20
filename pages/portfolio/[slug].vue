<script lang="ts" setup>
  import { Button, Card, Chip } from '~/components/atoms'
  import { BackLink, CheckList, ImageWithFallback } from '~/components/molecules'
  import { WHATSAPP_URL } from '~/constants/common'
  import type { PortfolioType } from '~/types/common'

  definePageMeta({
    path: '/portafolio/:slug()',
    layout: 'default',
    keepalive: true,
    title: 'Detalle del proyecto'
  })

  const route = useRoute()
  const slug = computed(() => String(route.params.slug || ''))
  const project = ref<PortfolioType | null>(null)

  const { items: projects } = await usePortfolio()

  watch(
    () => slug.value,
    value => {
      if (!value) return
      const found = (projects.value as PortfolioType[]).find(
        item => item.slug === value && item.status !== 'in-development'
      )
      project.value = found ?? null
    },
    { immediate: true }
  )

  const siteUrl = useSiteUrl()
  const seoImage = computed(() => `${siteUrl}${project.value?.ogImage ?? '/og-image.jpg'}`)
  const seoTitle = computed(() => project.value?.title ?? 'Proyecto no encontrado')
  const seoDescription = computed(
    () => project.value?.description ?? 'Proyecto del portafolio de Miguel Álvarez.'
  )
  useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    robots: () => (project.value ? 'index, follow' : 'noindex, nofollow'),
    ogType: 'article',
    ogLocale: 'es_CO',
    ogSiteName: 'Miguel Álvarez',
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogUrl: () => `${siteUrl}/portafolio/${slug.value}`,
    ogImage: seoImage,
    twitterCard: 'summary_large_image',
    twitterTitle: seoTitle,
    twitterDescription: seoDescription,
    twitterImage: seoImage
  })
  useHead({ link: [{ rel: 'canonical', href: () => `${siteUrl}/portafolio/${slug.value}` }] })

  // Respuesta 404 real (no un "soft 404") cuando el proyecto no existe o no tiene ficha pública.
  if (!project.value && import.meta.server) {
    const event = useRequestEvent()
    if (event) setResponseStatus(event, 404)
  }

  // Datos rápidos de la ficha: solo se muestran los que tienen valor.
  const facts = computed(() =>
    [
      { label: 'Tipo', value: project.value?.portfolioType },
      { label: 'Mi rol', value: project.value?.role },
      { label: 'Año', value: project.value?.year },
      { label: 'Duración', value: project.value?.duration }
    ].filter(item => !!item.value?.trim())
  )

  const hasText = (value?: string) => !!value?.trim()
  const gallery = computed(() => project.value?.gallery ?? [])
  // La primera imagen ocupa todo el ancho solo si el resto se reparte en filas completas de 2.
  const featureFirst = computed(() => gallery.value.length > 2 && gallery.value.length % 2 === 1)
</script>

<template>
  <section class="w-full bg-brand-surface px-4 py-12 md:py-16">
    <div v-if="project" class="mx-auto w-full max-w-5xl">
      <BackLink to="/portafolio">Volver al portafolio</BackLink>

      <article class="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface-card">
        <header class="p-5 md:p-8">
          <Chip pill uppercase class="mb-4 tracking-[0.12em] text-brand-accent-text">
            {{ project.portfolioType }}
          </Chip>
          <h1 class="text-3xl font-semibold leading-tight text-brand-ink md:text-5xl">
            {{ project.title }}
          </h1>
          <p class="mt-4 max-w-3xl text-lg leading-8 text-brand-muted">
            {{ project.description }}
          </p>

          <dl
            v-if="facts.length > 1"
            class="mt-6 grid gap-4 border-t border-brand-border pt-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div v-for="fact in facts" :key="fact.label">
              <dt class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                {{ fact.label }}
              </dt>
              <dd class="mt-1 text-sm font-medium text-brand-ink">{{ fact.value }}</dd>
            </div>
          </dl>

          <div v-if="project.url" class="mt-6">
            <Button
              v-track="{ id: 'cta_ver_proyecto', slug: project.slug }"
              as="a"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              theme="primary"
              size="md"
              icon="mdi:open-in-new"
              icon-position="right"
              class="w-fit"
            >
              Ver proyecto
            </Button>
          </div>
        </header>

        <div class="px-5 pb-6 md:px-8 md:pb-8">
          <ImageWithFallback
            :src="project.urlImage"
            :alt="`Portada del proyecto ${project.title}`"
            :width="1280"
            :height="720"
            loading="eager"
            fetchpriority="high"
            class="relative aspect-video w-full rounded-2xl"
          />
        </div>

        <div class="space-y-10 px-5 pb-8 md:px-8 md:pb-10">
          <ul
            v-if="project.highlights?.length"
            class="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
            aria-label="Cifras destacadas"
          >
            <li v-for="item in project.highlights" :key="item.label">
              <Card tone="soft" class="rounded-2xl p-5">
                <p class="text-3xl font-semibold text-brand-ink">{{ item.value }}</p>
                <p class="mt-1 text-sm text-brand-muted">{{ item.label }}</p>
              </Card>
            </li>
          </ul>

          <section v-if="hasText(project.problem)">
            <h2 class="mb-3 text-xl font-semibold text-brand-accent-text md:text-2xl">
              El problema
            </h2>
            <p class="max-w-3xl text-base leading-7 text-brand-muted">{{ project.problem }}</p>
          </section>

          <section v-if="hasText(project.decision)">
            <h2 class="mb-3 text-xl font-semibold text-brand-accent-text md:text-2xl">
              Lo que decidí y por qué
            </h2>
            <p class="max-w-3xl text-base leading-7 text-brand-muted">{{ project.decision }}</p>
          </section>

          <section v-if="hasText(project.result)">
            <h2 class="mb-3 text-xl font-semibold text-brand-accent-text md:text-2xl">
              El resultado
            </h2>
            <p class="max-w-3xl text-base leading-7 text-brand-muted">{{ project.result }}</p>
          </section>

          <section v-if="gallery.length">
            <h2 class="mb-4 text-xl font-semibold text-brand-accent-text md:text-2xl">Así se ve</h2>
            <ul class="grid gap-4 sm:grid-cols-2 md:gap-5">
              <li
                v-for="(image, index) in gallery"
                :key="`${image.src}-${index}`"
                :class="index === 0 && featureFirst ? 'sm:col-span-2' : ''"
              >
                <figure>
                  <ImageWithFallback
                    :src="image.src"
                    :alt="image.alt"
                    :width="1600"
                    :height="900"
                    sizes="100vw sm:50vw"
                    class="relative aspect-video w-full rounded-2xl border border-brand-border"
                  />
                  <figcaption v-if="image.caption" class="mt-2 text-sm text-brand-muted">
                    {{ image.caption }}
                  </figcaption>
                </figure>
              </li>
            </ul>
          </section>

          <section v-if="project.scope?.length">
            <h2 class="mb-3 text-xl font-semibold text-brand-accent-text md:text-2xl">
              Qué incluyó
            </h2>
            <CheckList :items="project.scope" size="md" class="max-w-3xl" />
          </section>

          <section v-if="project.technologies?.length">
            <h2 class="mb-3 text-xl font-semibold text-brand-accent-text md:text-2xl">
              Tecnologías
            </h2>
            <ul class="flex flex-wrap gap-2">
              <li v-for="tech in project.technologies" :key="tech">
                <Chip pill uppercase class="px-3 py-1.5 tracking-[0.08em] text-brand-ink">
                  {{ tech }}
                </Chip>
              </li>
            </ul>
          </section>

          <aside
            class="rounded-2xl bg-brand-navy p-5 text-brand-text-strong md:p-8"
            aria-labelledby="cta-heading"
          >
            <h2 id="cta-heading" class="text-xl font-semibold md:text-2xl">
              ¿Necesitas algo parecido a {{ project.title }}?
            </h2>
            <p class="mt-2 max-w-2xl text-base leading-7 text-brand-text-soft">
              Cuéntame qué quieres lograr. Primero hablamos y después vemos si puedo ayudarte; la
              primera consulta no tiene costo.
            </p>
            <div class="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                v-track="{ id: 'wa_proyecto', slug: project.slug }"
                as="a"
                :href="WHATSAPP_URL"
                target="_blank"
                rel="noopener noreferrer"
                theme="whatsapp"
                icon="mdi:whatsapp"
                icon-position="left"
                :on-dark="true"
                class="sm:w-fit"
              >
                Hablemos por WhatsApp
              </Button>
              <Button to="/#contact" theme="secondary" on-dark class="px-5">
                Escribirme por el formulario
              </Button>
            </div>
          </aside>
        </div>
      </article>
    </div>

    <div
      v-else
      class="mx-auto max-w-2xl rounded-2xl border border-brand-border bg-brand-surface-card p-8 text-center"
    >
      <h1 class="text-2xl font-semibold text-brand-ink">Proyecto no encontrado</h1>
      <p class="mt-3 text-brand-muted">No existe un detalle disponible para esta ruta.</p>
      <Button to="/portafolio" theme="secondary" class="mt-5 inline-flex">
        Volver al portafolio
      </Button>
    </div>
  </section>
</template>
