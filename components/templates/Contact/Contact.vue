<script lang="ts" setup>
  import { Title, Button, Input, Select } from '~/components/atoms'
  import Form from '~/components/Form/Form.vue'
  import { Section } from '~/components/organisms'

  import {
    CONTACT_INFO,
    CONTACT_INFO_DESCRIPTION,
    REGEX_COMMON,
    REGEX_EMAIL,
    REGEX_LARGE_TEXT
  } from '~/constants/common'

  const { email, phone, location } = CONTACT_INFO
  defineProps<{
    title: string
  }>()
  const iconSize = 40
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
    return (
      !form.name ||
      !form.lastName ||
      !form.email ||
      !form.subject ||
      !form.message ||
      !form.email.includes('@')
    )
  })
  const isSendedSuccessful = ref(false)
  const errorMessage = ref('')
  const cleanForm = () => {
    form.name = ''
    form.lastName = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }
  async function onSubmit() {
    const name = form.name.trim()
    const lastName = form.lastName.trim()
    const fullName = `${name} ${lastName}`.trim()

    try {
      await sendEmail(fullName, form.email, form.subject, form.message)
      isSendedSuccessful.value = true
      cleanForm()
    } catch (error) {
      console.error('Error sending email:', error)
      errorMessage.value = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.'
      cleanForm()
    }
  }
  const backgroundStyle = ref({})
  const hasLoaded = ref(false)
  onMounted(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.5 // 50% del viewport
      const section = document.getElementById('contact')
      if (!section || hasLoaded.value) return

      const sectionTop = section.getBoundingClientRect().top

      if (sectionTop <= scrollThreshold) {
        backgroundStyle.value = {
          backgroundImage: "url('/contact-bg.webp')"
        }
        hasLoaded.value = true
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
  })
</script>
<template>
  <Section
    id="contact"
    class="relative flex justify-center h-auto bg-fixed bg-center bg-no-repeat bg-cover"
    :style="backgroundStyle"
  >
    <div
      class="flex flex-col justify-center gap-4 shadow-lg lg:justify-around lg:gap-8 lg:flex-row lg:p-8 py-30 lg:pt-30 z-1 bg-black/60 backdrop-blur-md"
    >
      <div class="flex flex-col flex-wrap w-full gap-4 p-4 lg:w-2/6 z-1">
        <Title variant="h2" :text="title" class="text-white" />

        <p class="flex mb-4 font-light text-white text-wrap lg:text-xl">
          {{ CONTACT_INFO_DESCRIPTION }}
        </p>

        <div class="flex flex-col font-light lg:text-xl">
          <span class="flex items-center gap-2 mb-4 text-lg text-white">
            <Icon name="mdi:phone" :size="iconSize" />
            <h3 class="flex text-lg text-wrap">{{ phone }}</h3>
          </span>
          <span class="flex items-center gap-2 mb-4 text-lg text-white">
            <Icon name="mdi:email" :size="iconSize" />
            <h3 class="flex text-lg text-wrap">{{ email }}</h3>
          </span>
          <span class="flex items-center gap-2 mb-4 text-lg text-white">
            <Icon name="mdi:location" :size="iconSize" />
            <h3 class="flex text-lg text-wrap">{{ location }}</h3>
          </span>
        </div>

        <div class="flex flex-row gap-2 mt-4">
          <div class="flex flex-col gap-4">
            <p class="text-2xl italic text-white">Quiero ayudarte, contáctame ahora.</p>
            <NuxtLink to="https://wa.link/bxjfgq" target="_blank">
              <Button :uppercase="true" icon="mdi:whatsapp" theme="tertiary">Contactar</Button>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="p-8 bg-white rounded-lg shadow-lg lg:w-2/4 z-1 2xl:w-2/5 h-min">
        <Form
          title="Formulario de contacto"
          description="Completa el formulario a continuación y me pondré en contacto contigo lo antes posible."
          :successful="isSendedSuccessful"
          :validation-message="isSendedSuccessful ? 'Mensaje enviado exitosamente' : errorMessage"
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
              v-model="form.lastName"
              :pattern="REGEX_COMMON"
              type="text"
              name="lastName"
              place-holder="Apellido"
              label="Apellido"
              required
              error-message="Apellido inválido"
            />
          </div>

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
          <Button :disabled="disabledButton">Enviar</Button>
        </Form>
      </div>
    </div>
  </Section>
</template>
