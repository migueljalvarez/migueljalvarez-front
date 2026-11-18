<script setup lang="ts">
  import Button from '~/components/atoms/Button/Button.vue'
  import { toAdminApiError } from '~/utils/adminApiError'

  definePageMeta({ layout: 'auth' })
  useSeoMeta({ title: 'Acceso', robots: 'noindex, nofollow' })

  const { login, verifySecondFactor } = useAdminSession()

  type Step = 'password' | 'code'
  const step = ref<Step>('password')
  const email = ref('')
  const password = ref('')
  const code = ref('')
  const errorMessage = ref('')
  const isSubmitting = ref(false)

  const submit = async () => {
    errorMessage.value = ''
    isSubmitting.value = true
    try {
      if (step.value === 'password') {
        if (!email.value || !password.value) {
          errorMessage.value = 'Ingresa tu correo y tu contraseña.'
          return
        }
        const needsCode = await login(email.value, password.value)
        password.value = ''
        if (needsCode) {
          step.value = 'code'
          return
        }
      } else {
        if (!code.value.trim()) {
          errorMessage.value = 'Ingresa el código de tu aplicación autenticadora.'
          return
        }
        await verifySecondFactor(code.value)
      }
      await navigateTo('/admin')
    } catch (error) {
      const apiError = toAdminApiError(error)
      errorMessage.value =
        apiError.status === 401 && step.value === 'password'
          ? 'Credenciales inválidas.'
          : apiError.status === 401
            ? 'Código inválido o vencido. Si pasaron 5 minutos, vuelve a iniciar sesión.'
            : apiError.message
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <section class="flex min-h-[70vh] items-center justify-center bg-brand-surface px-4 py-12">
    <div
      class="w-full max-w-md rounded-2xl border border-brand-border bg-brand-surface-card p-6 shadow-[0_10px_24px_var(--color-brand-shadow-card)]"
    >
      <div class="mb-6">
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-accent-text">
          Panel privado
        </p>
        <h1 class="mt-2 text-3xl font-semibold text-brand-ink">Iniciar sesión</h1>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <template v-if="step === 'password'">
          <div>
            <label class="mb-1 block text-sm font-medium text-brand-ink" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              class="w-full rounded-xl border border-brand-border bg-brand-surface px-3 py-2.5 text-brand-ink outline-none transition focus:border-brand-accent"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-brand-ink" for="password">
              Contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              class="w-full rounded-xl border border-brand-border bg-brand-surface px-3 py-2.5 text-brand-ink outline-none transition focus:border-brand-accent"
            />
          </div>
        </template>

        <div v-else>
          <label class="mb-1 block text-sm font-medium text-brand-ink" for="code">
            Código de verificación
          </label>
          <input
            id="code"
            v-model="code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="11"
            class="w-full rounded-xl border border-brand-border bg-brand-surface px-3 py-2.5 text-brand-ink outline-none transition focus:border-brand-accent"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-brand-error-text" role="alert">
          {{ errorMessage }}
        </p>

        <Button type="submit" size="md" :disabled="isSubmitting" class="w-full">
          {{ isSubmitting ? 'Verificando...' : step === 'password' ? 'Continuar' : 'Entrar' }}
        </Button>
      </form>
    </div>
  </section>
</template>
