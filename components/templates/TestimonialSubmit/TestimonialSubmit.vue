<script lang="ts" setup>
  import { Button, Card, Checkbox } from '~/components/atoms'
  import { SectionHeader, StatusMessage, TextField } from '~/components/molecules'
  import {
    TESTIMONIAL_ANSWER_MAX,
    emptyTestimonialForm,
    validateTestimonialForm,
    type TestimonialSubmission
  } from '~/utils/testimonialSubmission'

  type TestimonialSubmitProps = {
    phase: 'form' | 'sent' | 'invalid' | 'limited' | 'unavailable'
    /** Datos mínimos del enlace (solo en la fase `form`). */
    clientName?: string
    projectName?: string
    message?: string
    expiresAt?: string
    submitting?: boolean
    /** Error del servidor al enviar (el texto escrito se conserva). */
    error?: string
  }

  // Página interior del cliente que escribe su testimonio desde el enlace único del correo: formulario
  // y estados (enviado, enlace no válido o vencido, demasiados intentos, sin conexión). El texto
  // escrito se conserva si el envío falla; los errores se anuncian y el foco va al primer campo inválido.
  const props = defineProps<TestimonialSubmitProps>()
  const emit = defineEmits<{ submit: [data: TestimonialSubmission]; retry: [] }>()

  const values = reactive(emptyTestimonialForm())
  const errors = ref<Record<string, string>>({})

  const firstName = computed(() => (props.clientName ?? '').trim().split(/\s+/)[0] ?? '')
  const intro = computed(() => {
    const project = props.projectName?.trim()
    return [
      firstName.value ? `Hola, ${firstName.value}.` : '',
      project ? `Gracias por confiarme «${project}».` : 'Gracias por confiar en mi trabajo.',
      'Cuéntame con tus palabras cómo fue: te toma un par de minutos.'
    ]
      .filter(Boolean)
      .join(' ')
  })
  const expiry = computed(() => {
    const date = props.expiresAt ? new Date(props.expiresAt) : null
    return date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString('es-CO', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'America/Bogota'
        })
      : ''
  })

  const ID = {
    answer: 'testimonial-answer',
    authorName: 'testimonial-name',
    authorRole: 'testimonial-role',
    authorCompany: 'testimonial-company',
    consentPublish: 'testimonial-consent'
  } as const

  const onSubmit = async () => {
    if (props.submitting) return
    const result = validateTestimonialForm(values)
    if (!result.ok) {
      errors.value = result.errors
      await nextTick()
      const first = (Object.keys(ID) as (keyof typeof ID)[]).find(key => result.errors[key])
      if (first) document.getElementById(ID[first])?.focus()
      return
    }
    errors.value = {}
    emit('submit', result.data)
  }
</script>

<template>
  <div class="bg-brand-surface px-4 py-12 md:py-16">
    <div class="mx-auto w-full max-w-2xl">
      <template v-if="phase === 'form'">
        <SectionHeader
          eyebrow="Tu testimonio"
          heading="Cuéntame cómo fue trabajar juntos"
          level="h1"
          :description="intro"
        />

        <Card v-if="message" tone="soft" class="mt-6 p-5">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-logo-blue">
            Unas palabras de Miguel
          </p>
          <blockquote class="mt-2 whitespace-pre-line text-base leading-7 text-brand-ink">
            {{ message }}
          </blockquote>
        </Card>

        <Card elevated class="mt-8 p-5 md:p-8">
          <form
            class="space-y-6"
            novalidate
            aria-label="Formulario de testimonio"
            @submit.prevent="onSubmit"
          >
            <TextField
              :id="ID.answer"
              v-model="values.answer"
              tag="textarea"
              label="Tu testimonio"
              required
              :rows="7"
              :maxlength="TESTIMONIAL_ANSWER_MAX"
              hint="Qué necesitabas, cómo fue trabajar juntos y qué resultado tuviste."
              :error="errors.answer"
            />
            <TextField
              :id="ID.authorName"
              v-model="values.authorName"
              label="Tu nombre (opcional)"
              :maxlength="100"
              autocomplete="name"
              :placeholder="clientName"
              :hint="
                clientName
                  ? `Si lo dejas vacío, usaré «${clientName}».`
                  : 'Con este nombre aparecería tu testimonio.'
              "
              :error="errors.authorName"
            />
            <div class="grid gap-6 sm:grid-cols-2">
              <TextField
                :id="ID.authorRole"
                v-model="values.authorRole"
                label="Cargo (opcional)"
                :maxlength="120"
                autocomplete="organization-title"
                :error="errors.authorRole"
              />
              <TextField
                :id="ID.authorCompany"
                v-model="values.authorCompany"
                label="Empresa (opcional)"
                :maxlength="120"
                autocomplete="organization"
                :error="errors.authorCompany"
              />
            </div>

            <div>
              <Checkbox
                v-model="values.consentPublish"
                :name="ID.consentPublish"
                tone="light"
                required
                :invalid="!!errors.consentPublish"
                :describedby="errors.consentPublish ? 'testimonial-consent-error' : undefined"
              >
                Autorizo de forma expresa que se publique mi testimonio, junto con mi nombre, cargo
                y empresa, en el sitio de Miguel Álvarez. Puedo pedir que lo retire cuando quiera.
                Más información en la
                <NuxtLink
                  to="/privacidad"
                  target="_blank"
                  rel="noopener"
                  class="font-medium text-logo-blue underline underline-offset-4 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                >
                  política de tratamiento de datos
                </NuxtLink>
                (se abre en otra pestaña).
              </Checkbox>
              <p
                v-if="errors.consentPublish"
                id="testimonial-consent-error"
                role="alert"
                class="mt-1 text-xs font-medium text-brand-error-text"
              >
                {{ errors.consentPublish }}
              </p>
            </div>

            <p
              v-if="error"
              role="alert"
              class="flex items-start gap-2 rounded-lg border border-brand-error-border bg-brand-error-bg px-3 py-2 text-sm font-medium text-brand-error-text"
            >
              <Icon
                name="mdi:alert-circle-outline"
                size="20"
                class="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <span class="leading-6">{{ error }}</span>
            </p>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                size="lg"
                class="w-full sm:w-auto"
                :disabled="submitting"
                :aria-busy="submitting || undefined"
              >
                {{ submitting ? 'Enviando…' : 'Enviar mi testimonio' }}
              </Button>
              <p v-if="expiry" class="text-xs text-brand-muted">
                Este enlace funciona hasta el {{ expiry }}.
              </p>
            </div>
          </form>
        </Card>
      </template>

      <Card v-else elevated class="p-8 md:p-12">
        <StatusMessage
          v-if="phase === 'sent'"
          icon="mdi:check-bold"
          tone="success"
          level="h1"
          title="¡Gracias por tu testimonio!"
        >
          <p>
            Ya lo recibí. Lo reviso y solo se publica con la autorización que acabas de darme. Si
            quieres cambiar algo o que lo retire, escríbeme cuando quieras.
          </p>
          <template #actions>
            <Button theme="secondary" to="/">Ir al inicio</Button>
          </template>
        </StatusMessage>

        <StatusMessage
          v-else-if="phase === 'invalid'"
          icon="mdi:link-off"
          level="h1"
          title="Enlace no válido o vencido"
        >
          <p>
            Puede que ya lo hayas usado o que haya pasado su fecha límite. Si todavía quieres dejar
            tu testimonio, escríbeme y te envío uno nuevo.
          </p>
          <template #actions>
            <Button theme="secondary" to="/">Ir al inicio</Button>
          </template>
        </StatusMessage>

        <StatusMessage
          v-else-if="phase === 'limited'"
          icon="mdi:timer-sand"
          tone="warning"
          role="alert"
          level="h1"
          title="Demasiados intentos"
        >
          <p>Espera unos minutos y vuelve a abrir el enlace del correo.</p>
        </StatusMessage>

        <StatusMessage
          v-else
          icon="mdi:cloud-off-outline"
          tone="warning"
          role="alert"
          level="h1"
          title="No pudimos cargar el formulario"
        >
          <p>Hubo un problema de conexión. Inténtalo de nuevo en unos minutos.</p>
          <template #actions>
            <Button @click="emit('retry')">Reintentar</Button>
          </template>
        </StatusMessage>
      </Card>
    </div>
  </div>
</template>
