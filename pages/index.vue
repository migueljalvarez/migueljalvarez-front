<script setup lang="ts">
  import {
    About,
    Contact,
    Main,
    PortfolioSection,
    ProcessSection,
    Services
  } from '~/components/templates'

  import { META, MY_SOCIAL_MEDIA } from '~/constants/common'
  import { Section } from '~/components/organisms'
  import { HOME_PORTFOLIO_PROJECTS } from '~/constants/portfolio'

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
  const portfolioProjects = HOME_PORTFOLIO_PROJECTS
</script>

<template>
  <div>
    <Main />

    <Services />
    <ProcessSection />
    <Section id="portfolio-background" class="gap-4 bg-brand-surface px-4 py-8 md:py-12">
      <div class="mx-auto w-full max-w-7xl">
        <PortfolioSection title="Portafolio" :projects="portfolioProjects" />
      </div>
    </Section>
    <About title="Sobre mí" />
    <Contact title="Hablemos" />
  </div>
</template>
