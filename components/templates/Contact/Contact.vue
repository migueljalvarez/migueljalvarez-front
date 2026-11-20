<script lang="ts" setup>
  import { Button, Card, Checkbox, Eyebrow, Input, Select } from '~/components/atoms'
  import Form from '~/components/Form/Form.vue'
  import { CheckList, SocialMedia } from '~/components/molecules'
  import { LegalFooter, Section } from '~/components/organisms'

  import {
    HOME_COPY,
    REGEX_COMMON,
    REGEX_EMAIL,
    REGEX_LARGE_TEXT,
    WHATSAPP_CTA_LABEL,
    WHATSAPP_URL
  } from '~/constants/common'

  defineProps<{
    title?: string
  }>()
  const { socials } = useSocialMedia()
  // Contact Form
  const subjectOptions = HOME_COPY.contact.form.subjects

  const form = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false, // autorización previa, expresa e informada (Ley 1581)
    website: '' // honeypot: oculto para personas
  })
  const { sendEmail } = useEmail()
  const { track } = useTrack()
  const isSubmitting = ref(false)
  const disabledButton = computed(() => {
    return (
      isSubmitting.value ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject ||
      !form.message.trim() ||
      !form.consent ||
      !form.email.includes('@')
    )
  })
  const isSendedSuccessful = ref(false)
  const errorMessage = ref('')
  const cleanForm = () => {
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    form.consent = false
  }
  async function onSubmit() {
    const name = form.name.trim()
    isSubmitting.value = true
    isSendedSuccessful.value = false
    errorMessage.value = ''

    try {
      await sendEmail(name, form.email, form.subject, form.message, form.consent, form.website)
      isSendedSuccessful.value = true
      track('form_submit_ok')
      cleanForm()
    } catch (error) {
      console.error('Error sending email:', error)
      errorMessage.value = HOME_COPY.contact.sendError
    } finally {
      isSubmitting.value = false
    }
  }
</script>
<template>
  <Section
    id="contact"
    class="gap-4 bg-[linear-gradient(180deg,var(--color-brand-surface)_0%,var(--color-brand-surface)_22%,var(--color-brand-surface-contrast)_22%,var(--color-brand-surface-contrast)_100%)] px-0 sm:px-4"
  >
    <div
      class="relative mx-auto mb-0 w-full max-w-none overflow-hidden rounded-none border-y border-brand-border-strong bg-brand-surface-contrast p-5 shadow-none sm:mb-8 sm:max-w-7xl sm:rounded-2xl sm:border sm:p-8 sm:shadow-inverse"
    >
      <!-- Logo decorativo asomando desde la esquina — placeholder mientras subes el SVG real a public/ -->
      <NuxtImg
        src="only-brand.svg"
        alt=""
        aria-hidden="true"
        width="256"
        height="256"
        class="pointer-events-none select-none absolute -bottom-10 -right-20 z-0 h-64 w-64 object-contain opacity-[0.06]"
      />

      <div class="relative z-10">
        <Eyebrow tone="dark" class="mb-3">{{ title || HOME_COPY.contact.eyebrow }}</Eyebrow>

        <div class="flex flex-col md:flex-row gap-8 items-stretch">
          <div class="flex flex-col gap-4 md:w-1/2">
            <h2 class="text-2xl font-semibold leading-tight text-brand-text-strong md:text-3xl">
              {{ HOME_COPY.contact.heading }}
            </h2>
            <p class="text-sm leading-6 text-brand-text-subtle md:text-base md:leading-7">
              {{ HOME_COPY.contact.description }}
            </p>
            <Button
              v-track="'wa_contacto'"
              as="a"
              :href="WHATSAPP_URL"
              target="_blank"
              rel="noopener noreferrer"
              icon="mdi:whatsapp"
              theme="whatsapp"
              :on-dark="true"
              class="w-fit whitespace-nowrap"
              icon-position="left"
              size="md"
            >
              {{ WHATSAPP_CTA_LABEL }}
            </Button>

            <CheckList :items="HOME_COPY.contact.benefits" tone="dark" class="p-4" />

            <div class="flex gap-3">
              <SocialMedia
                v-for="item in socials"
                :key="item.name"
                :link="item.link"
                :name="item.name"
                :icon="item.icon"
                :size="32"
              />
            </div>
            <p class="-mt-1 flex items-center gap-1.5 text-sm text-brand-text-subtle">
              <Icon name="mdi:map-marker-outline" class="size-4 shrink-0" aria-hidden="true" />
              {{ HOME_COPY.contact.location }}
            </p>
          </div>

          <div class="flex flex-col gap-2 md:w-1/2">
            <Card tone="dark" class="p-5">
              <Form
                :successful="isSendedSuccessful"
                :validation-message="
                  isSendedSuccessful ? HOME_COPY.contact.form.success : errorMessage
                "
                @submit="onSubmit"
              >
                <div class="flex flex-col gap-4 lg:grid-cols-2 lg:grid">
                  <Input
                    v-model="form.name"
                    type="text"
                    name="name"
                    place-holder="Nombre"
                    label="Nombre"
                    required
                    :pattern="REGEX_COMMON"
                    error-message="Nombre inválido"
                  />
                  <Input
                    v-model="form.email"
                    :pattern="REGEX_EMAIL"
                    type="email"
                    name="email"
                    place-holder="Correo electrónico"
                    label="Correo electrónico"
                    required
                    error-message="Correo electrónico inválido"
                  />
                </div>

                <Select
                  v-model="form.subject"
                  name="subject"
                  label="Asunto"
                  :options="subjectOptions"
                  :placeholder="HOME_COPY.contact.form.subjectPlaceholder"
                  required
                />
                <Input
                  v-model="form.message"
                  :pattern="REGEX_LARGE_TEXT"
                  type="text"
                  tag="textarea"
                  label="Mensaje"
                  name="message"
                  place-holder="Deja aquí tu mensaje"
                  :rows="4"
                  required
                  error-message="Se ha detectado uso de carácter inválido"
                />
                <input
                  v-model="form.website"
                  type="text"
                  name="website"
                  tabindex="-1"
                  autocomplete="off"
                  aria-hidden="true"
                  class="absolute -left-[9999px] size-px opacity-0"
                />
                <Checkbox v-model="form.consent" name="consent" required>
                  {{ HOME_COPY.contact.consent }}
                  <NuxtLink
                    to="/privacidad"
                    target="_blank"
                    class="rounded-sm underline underline-offset-4 hover:text-brand-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white"
                  >
                    {{ HOME_COPY.contact.privacyLink }}
                  </NuxtLink>
                  <span class="mt-1 block">{{ HOME_COPY.contact.privacy }}</span>
                </Checkbox>
                <!-- Estados del átomo Button sobre fondo oscuro: activo = ámbar; deshabilitado = tenue con borde
                     discontinuo; hover = ámbar más suave con halo; foco = contorno blanco; enviando = ámbar con indicador. -->
                <Button
                  type="submit"
                  :disabled="disabledButton"
                  :loading="isSubmitting"
                  size="md"
                  class="w-full whitespace-nowrap py-2 font-bold"
                  on-dark
                  theme="primary"
                >
                  {{ HOME_COPY.contact.form.submit }}
                </Button>
              </Form>
            </Card>
          </div>
        </div>

        <LegalFooter class="mt-8" />
      </div>
    </div>
  </Section>
</template>
