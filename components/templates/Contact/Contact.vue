<script lang="ts" setup>
  import { Button, Input, Select } from '~/components/atoms'
  import Form from '~/components/Form/Form.vue'
  import { SocialMedia } from '~/components/molecules'
  import { Section } from '~/components/organisms'

  import {
    HOME_COPY,
    REGEX_COMMON,
    REGEX_EMAIL,
    REGEX_LARGE_TEXT,
    WHATSAPP_CTA_LABEL
  } from '~/constants/common'
  import type { SocialMediaType } from '~/types/common'

  defineProps<{
    title?: string
  }>()
  const { socials } = useSocialMedia()
  const hoverIcon = (item: SocialMediaType) => {
    item.isHovered = true
  }
  const leaveIcon = (item: SocialMediaType) => {
    item.isHovered = false
  }
  // Contact Form
  const subjectOptions = HOME_COPY.contact.form.subjects

  const form = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const { sendEmail } = useEmail()
  const disabledButton = computed(() => {
    return !form.name || !form.email || !form.subject || !form.message || !form.email.includes('@')
  })
  const isSendedSuccessful = ref(false)
  const errorMessage = ref('')
  const cleanForm = () => {
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }
  async function onSubmit() {
    const name = form.name.trim()

    try {
      await sendEmail(name, form.email, form.subject, form.message)
      isSendedSuccessful.value = true
      cleanForm()
    } catch (error) {
      console.error('Error sending email:', error)
      errorMessage.value = HOME_COPY.contact.sendError
    }
  }
</script>
<template>
  <Section
    id="contact"
    class="gap-4 bg-[linear-gradient(180deg,var(--color-brand-surface)_0%,var(--color-brand-surface)_22%,var(--color-brand-surface-contrast)_22%,var(--color-brand-surface-contrast)_100%)] px-4"
  >
    <div
      class="relative mx-auto mb-8 w-full max-w-7xl overflow-hidden rounded-2xl border border-brand-border-strong/50 bg-brand-surface-contrast p-9 shadow-[0_18px_40px_var(--color-brand-shadow-card)]"
    >
      <!-- Logo decorativo asomando desde la esquina — placeholder mientras subes el SVG real a public/ -->
      <NuxtImg
        src="only-brand.svg"
        alt="Miguel Álvarez"
        class="pointer-events-none select-none absolute -bottom-10 -right-20 w-64 h-64 opacity-[0.06] z-0"
      />

      <div class="relative z-10">
        <h5 class="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-soft">
          {{ title || HOME_COPY.contact.eyebrow }}
        </h5>

        <div class="flex flex-col md:flex-row gap-8 items-stretch">
          <div class="flex flex-col gap-4 md:w-1/2">
            <h3 class="text-2xl font-semibold leading-tight text-brand-text-strong md:text-3xl">
              {{ HOME_COPY.contact.heading }}
            </h3>
            <p class="text-sm leading-6 text-brand-text-subtle md:text-base md:leading-7">
              {{ HOME_COPY.contact.description }}
            </p>
            <Button
              as="a"
              href="https://wa.link/bxjfgq"
              target="_blank"
              rel="noopener noreferrer"
              icon="mdi:whatsapp"
              class="w-fit whitespace-nowrap bg-brand-whatsapp text-brand-white hover:bg-brand-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white"
              icon-position="left"
              size="md"
            >
              {{ WHATSAPP_CTA_LABEL }}
            </Button>

            <ul class="space-y-3 p-4 text-sm leading-6 text-brand-text-subtle">
              <li v-for="benefit in HOME_COPY.contact.benefits" :key="benefit" class="flex gap-3">
                <Icon
                  name="mdi:check-circle-outline"
                  size="19"
                  class="mt-0.5 shrink-0 text-brand-blue"
                  aria-hidden="true"
                />
                <span>{{ benefit }}</span>
              </li>
            </ul>
            <div class="flex gap-3">
              <SocialMedia
                v-for="item in socials"
                :key="item.name"
                :link="item.link"
                :name="item.name"
                :icon="item.icon"
                :is-hovered="item.isHovered"
                orientation="horizontal"
                :size="32"
                @mouseover="hoverIcon(item)"
                @mouseleave="leaveIcon(item)"
              />
            </div>

            <div class="mt-auto pt-4">
              <NuxtImg
                src="brand_white_v2.svg"
                width="250"
                height="40"
                alt="Miguel Álvarez"
                class="object-contain"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2 md:w-1/2">
            <div
              class="rounded-2xl border border-brand-border-strong/70 bg-brand-surface-panel p-4 shadow-[0_8px_22px_var(--color-brand-shadow-card)]"
            >
              <Form
                :successful="isSendedSuccessful"
                :validation-message="
                  isSendedSuccessful ? HOME_COPY.contact.form.success : errorMessage
                "
                @submit="onSubmit"
              >
                <div class="flex flex-col gap-2 lg:grid-cols-2 lg:grid">
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
                <Button
                  :disabled="disabledButton"
                  size="md"
                  class="w-full whitespace-nowrap py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white"
                  theme="primary"
                >
                  {{ HOME_COPY.contact.form.submit }}
                </Button>
                <p class="text-xs leading-5 text-brand-text-subtle">
                  {{ HOME_COPY.contact.privacy }}
                </p>
              </Form>
            </div>

            <p
              class="mt-auto flex w-full flex-col pt-2 text-right font-sans text-xs text-brand-text-subtle"
            >
              <span class="font-sans font-bold text-brand-text-strong">
                &copy; {{ new Date().getFullYear() }} Miguel Álvarez
              </span>
              <span class="font-sans">{{ HOME_COPY.contact.serviceDescription }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
