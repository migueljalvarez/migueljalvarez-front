<script lang="ts" setup>
  import { reactive } from 'vue'
  useHead({
    titleTemplate: titleChunk => {
      return titleChunk ? `Contactame - ${titleChunk}` : ''
    }
  })

  const subjectOptions = [
    { value: 'desarrollo', label: 'Desarrollo' },
    { value: 'contrato', label: 'Contratar' },
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
</script>
<template>
  <section
    class="flex items-center justify-center min-h-screen gap-4 bg-[url('../../assets/images/64363.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative"
  >
    <div
      class="flex justify-center min-h-screen gap-4 p-8 shadow-lg z-1 bg-black/60 backdrop-blur-md"
    >
      <div class="flex flex-col w-2/6 gap-4 text-wrap z-1">
        <h1 class="font-bold text-white">Contactame</h1>
        <p class="mb-4 text-white">
          ¿Buscas impulsar tus proyectos con soluciones creativas y efectivas? ¡Estoy listo para
          ayudarte! Ponte en contacto conmigo y descubre cómo juntos podemos llevar tus ideas al
          siguiente nivel. Tu mensaje es el primer paso para comenzar algo increíble.
        </p>

        <span class="flex items-center gap-2 mb-4 text-white">
          <Icon name="mdi:location" size="50" />
          <h3>Medellin, Antioquia - Colombia</h3>
        </span>
      </div>
      <div class="flex flex-col w-2/4 h-auto p-8 bg-white rounded-lg shadow-lg z-1">
        <Form
          title="Formulario de contacto"
          description="Completa el formulario a continuación y me pondré en contacto contigo lo antes posible."
          :successful="isSendedSuccessful"
          :validation-message="isSendedSuccessful ? 'Mensaje enviado exitosamente' : errorMessage"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-2 gap-2">
            <Input
              v-model="form.name"
              type="text"
              name="name"
              place-holder="Nombre"
              label="Nombre"
              required
            />
            <Input
              v-model="form.lastName"
              type="text"
              name="lastName"
              place-holder="Apellido"
              label="Apellido"
              required
            />
          </div>

          <Input
            v-model="form.email"
            type="email"
            name="email"
            place-holder="Correo electrónico"
            label="Email"
            required
          />
          <Select
            v-model="form.subject"
            name="subject"
            label="Asunto"
            :options="subjectOptions"
            placeholder="Selecciona un asunto"
            required
          />
          <TextArea
            v-model="form.message"
            :label="'Mensaje'"
            name="message"
            place-holder="Deja aqui tu mensaje"
            rows="4"
            required
          />
          <Button :disabled="disabledButton">Enviar</Button>
        </Form>
      </div>
    </div>
  </section>
</template>

<style></style>
