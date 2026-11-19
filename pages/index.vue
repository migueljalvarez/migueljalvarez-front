<script setup lang="ts">
  import Main from '~/components/templates/Main/Main.vue'
  import { Section } from '~/components/organisms'
  import { META, MY_SOCIAL_MEDIA } from '~/constants/common'
  import { lazySection } from '~/utils/lazySection'

  // Solo el hero es crítico; el resto se hidrata al acercarse (ver utils/lazySection.ts).
  const Services = lazySection(() => import('~/components/templates/Services/Services.vue'))
  const ProcessSection = lazySection(
    () => import('~/components/templates/Services/ProcessSection.vue')
  )
  const PortfolioSection = lazySection(
    () => import('~/components/templates/Portfolio/PortfolioSection.vue')
  )
  const About = lazySection(() => import('~/components/templates/About/About.vue'))

  definePageMeta({ layout: 'default', keepalive: true })

  usePageSeo({
    title: META.TITLE,
    description: META.DESCRIPTION,
    path: '/',
    imageAlt: 'Miguel Álvarez, desarrollo de software y soluciones digitales'
  })
  useHead({
    titleTemplate: titleChunk =>
      titleChunk
        ? `${titleChunk} | Desarrollo de Software y Soluciones Digitales`
        : 'Desarrollo de Software y Soluciones Digitales',
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              '@id': `${useSiteUrl()}/#person`,
              name: 'Miguel Álvarez',
              jobTitle: 'Ingeniero de sistemas',
              url: useSiteUrl(),
              image: `${useSiteUrl()}/og-image.jpg`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Medellín',
                addressCountry: 'CO'
              },
              sameAs: MY_SOCIAL_MEDIA.map(item => item.link)
            },
            {
              '@type': 'ProfessionalService',
              '@id': `${useSiteUrl()}/#service`,
              name: 'Miguel Álvarez - Desarrollo de Software',
              description: META.DESCRIPTION,
              url: useSiteUrl(),
              founder: { '@id': `${useSiteUrl()}/#person` },
              areaServed: 'Latinoamérica',
              availableLanguage: 'es'
            }
          ]
        })
      }
    ]
  })
  const { homeCards: portfolioProjects } = await usePortfolio()
  const { about } = await useAbout()
</script>

<template>
  <div>
    <Main :content="about" />

    <Services />
    <ProcessSection />
    <Section id="portfolio-background" class="gap-4 bg-brand-surface px-4 py-12 md:py-16">
      <div class="mx-auto w-full max-w-7xl">
        <PortfolioSection title="Portafolio" :projects="portfolioProjects" />
      </div>
    </Section>
    <About :content="about" />
  </div>
</template>
