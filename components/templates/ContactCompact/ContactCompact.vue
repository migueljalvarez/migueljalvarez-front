<script lang="ts" setup>
  import { Button, Eyebrow } from '~/components/atoms'
  import { LegalFooter } from '~/components/organisms'
  import { HOME_COPY, WHATSAPP_CTA_LABEL, WHATSAPP_URL } from '~/constants/common'
</script>

<template>
  <!-- Contacto compacto para páginas legales: invitación breve + franja legal, sin formulario. -->
  <section
    aria-labelledby="contact-compact-heading"
    class="bg-brand-surface-contrast px-4 py-12 text-brand-text-strong md:py-16"
  >
    <div class="mx-auto w-full max-w-7xl">
      <Eyebrow tone="dark" class="mb-3">{{ HOME_COPY.contact.eyebrow }}</Eyebrow>
      <h2
        id="contact-compact-heading"
        class="text-2xl font-semibold leading-tight text-brand-text-strong md:text-3xl"
      >
        {{ HOME_COPY.contact.compact.heading }}
      </h2>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-brand-text-subtle md:text-base md:leading-7">
        {{ HOME_COPY.contact.compact.description }}
      </p>
      <div class="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <Button to="/#contact" theme="primary" size="md" on-dark class="whitespace-nowrap">
          {{ HOME_COPY.contact.compact.cta }}
        </Button>
        <Button
          as="a"
          :href="WHATSAPP_URL"
          target="_blank"
          rel="noopener noreferrer"
          theme="whatsapp"
          size="md"
          on-dark
          icon="mdi:whatsapp"
          icon-position="left"
          class="whitespace-nowrap"
        >
          {{ WHATSAPP_CTA_LABEL }}
        </Button>
      </div>

      <div class="mt-8 border-t border-brand-border-strong/50 pt-8">
        <LegalFooter />
      </div>
    </div>
  </section>
</template>
