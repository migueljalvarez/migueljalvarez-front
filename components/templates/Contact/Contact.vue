<script lang="ts" setup>
  import { Button, Input, Select } from '~/components/atoms'
  import Form from '~/components/Form/Form.vue'
  import { SocialMedia } from '~/components/molecules'
  import { Section } from '~/components/organisms'

  import { REGEX_COMMON, REGEX_EMAIL, REGEX_LARGE_TEXT } from '~/constants/common'
  import type { SocialMediaType } from '~/types/common'

  defineProps<{
    title: string
  }>()
  const { socials } = useSocialMedia()
  const hoverIcon = (item: SocialMediaType) => {
    item.isHovered = true
  }
  const leaveIcon = (item: SocialMediaType) => {
    item.isHovered = false
  }
  // Contact Form
  const subjectOptions = [
    { value: 'desarrollo', label: 'Desarrollo' },
    { value: 'oferta', label: 'Oferta' },
    { value: 'consulta', label: 'Consulta' },
    { value: 'soporte', label: 'Soporte' },
    { value: 'otro', label: 'Otro' }
  ]

  const form = reactive({
    name: '',
    lastName: '',
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
      errorMessage.value = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.'
      cleanForm()
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
        alt="Miguel Alvarez"
        class="pointer-events-none select-none absolute -bottom-10 -right-20 w-64 h-64 opacity-[0.06] z-0"
      />

      <div class="relative z-10">
        <h5 class="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-soft">
          {{ title }}
        </h5>

        <div class="flex flex-col md:flex-row gap-8 items-stretch">
          <div class="flex flex-col gap-4 md:w-1/2">
            <h3 class="text-2xl font-semibold leading-tight text-brand-text-strong md:text-3xl">
              ¿Tienes algo en mente?
            </h3>
            <p class="text-sm leading-6 text-brand-text-subtle md:text-base md:leading-7">
              No necesitas tener un documento técnico ni todos los requisitos definidos. Cuéntame
              qué quieres hacer, qué problema tienes o qué quieres mejorar. Primero hablamos;
              después vemos si puedo ayudarte.
            </p>
            <NuxtLink to="https://wa.link/bxjfgq" target="_blank" class="w-fit">
              <Button
                icon="mdi:whatsapp"
                class="whitespace-nowrap bg-brand-whatsapp text-brand-white hover:bg-brand-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white"
                icon-position="left"
                size="md"
              >
                Hablemos por Whatsapp
              </Button>
            </NuxtLink>

            <div class="">
              <ul
                class="p-4 text-sm marker:text-brand-blue marker:text-lg leading-6 text-brand-text-subtle"
              >
                <li class="list-disc">Respuesta en menos de 24 horas</li>
                <li class="list-disc">Primera consulta sin Costo</li>
              </ul>
            </div>
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
                alt="Miguel Alvarez"
                class="object-contain"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2 md:w-1/2">
            <div
              class="rounded-2xl border border-brand-border-strong/70 bg-brand-surface-panel p-4 shadow-[0_12px_28px_var(--color-brand-shadow-card)]"
            >
              <Form
                :successful="isSendedSuccessful"
                :validation-message="
                  isSendedSuccessful ? 'Mensaje enviado exitosamente' : errorMessage
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
                    label="Email"
                    required
                    error-message="Email inválido"
                  />
                </div>

                <Select
                  v-model="form.subject"
                  name="subject"
                  label="Asunto"
                  :options="subjectOptions"
                  placeholder="Selecciona un asunto"
                  required
                />
                <Input
                  v-model="form.message"
                  :pattern="REGEX_LARGE_TEXT"
                  type="text"
                  tag="textarea"
                  label="Mensaje"
                  name="message"
                  place-holder="Deja aqui tu mensaje"
                  :rows="4"
                  required
                  error-message="Se ha detectado uso de caracter inválido"
                />
                <Button
                  :disabled="disabledButton"
                  size="md"
                  class="whitespace-nowrap py-2"
                  theme="tertiary"
                >
                  Enviar
                </Button>
              </Form>
            </div>

            <p
              class="mt-auto flex w-full flex-col pt-2 text-right font-sans text-xs text-brand-text-subtle"
            >
              <span class="font-sans font-bold text-brand-text-strong">
                &copy; {{ new Date().getFullYear() }} Miguel Alvarez
              </span>
              <span class="font-sans">Servicios de consultoria y desarrollo de Software</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
