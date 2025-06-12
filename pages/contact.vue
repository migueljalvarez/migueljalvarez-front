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
  watch(
    form,
    newVal => {
      console.log('Form changed:', { ...newVal })
    },
    { deep: true }
  )
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
      <div class="flex flex-col w-2/4 p-8 bg-white rounded-lg shadow-lg z-1">
        <h2 class="mb-4 text-2xl font-bold">Formulario de contacto</h2>
        <p class="mb-4">
          Completa el formulario a continuación y me pondré en contacto contigo lo antes posible.
        </p>

        <div
          v-if="isSendedSuccessful"
          class="flex items-center justify-center gap-2 p-4 mb-4 text-green-900 bg-green-200 rounded-lg"
        >
          <Icon name="mdi:check-circle" size="20" class="" />
          <p>Mensaje enviado exitosamente</p>
        </div>

        <div
          v-if="errorMessage"
          class="flex items-center justify-center gap-2 p-4 mb-4 text-red-900 bg-red-200 rounded-lg"
        >
          <Icon name="mdi:close-circle" size="20" class="" />
          <p>{{ errorMessage }}</p>
        </div>

        <form class="flex flex-col gap-4">
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
          <textarea
            v-model="form.message"
            name="message"
            placeholder="Mensaje"
            class="w-full p-2 mb-4 border rounded"
            rows="4"
            required
          ></textarea>
        </form>
        <Button :onclick="onSubmit" :disabled="disabledButton">Enviar</Button>
      </div>
    </div>
  </section>
</template>

<style></style>
