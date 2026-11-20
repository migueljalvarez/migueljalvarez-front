<script setup lang="ts">
  import AdminButton from '~/components/admin/AdminButton.vue'
  import AppLogo from '~/components/atoms/AppLogo/AppLogo.vue'
  import AdminInput from '~/components/admin/AdminInput.vue'
  import AdminNotice from '~/components/admin/AdminNotice.vue'
  import { toAdminApiError } from '~/utils/adminApiError'
  import {
    isPendingExpired,
    loginErrorMessage,
    normalizeRecoveryInput,
    normalizeTotpInput,
    validateCredentials,
    validateSecondFactor,
    type LoginStep,
    type SecondFactorMode
  } from '~/utils/admin/loginFlow'

  definePageMeta({ layout: 'auth' })
  useSeoMeta({ title: 'Acceso', robots: 'noindex, nofollow' })

  const { login, verifySecondFactor } = useAdminSession()

  const step = ref<LoginStep>('password')
  const mode = ref<SecondFactorMode>('totp')
  const email = ref('')
  const password = ref('')
  const code = ref('')
  const fieldErrors = ref<{ email?: string; password?: string; code?: string }>({})
  const errorMessage = ref('')
  const isSubmitting = ref(false)
  // Momento en que la API abrió la sesión pendiente (vence a los 5 minutos).
  const pendingSince = ref(0)

  const isRecovery = computed(() => mode.value === 'recovery')

  const focusField = async (id: string, select = false) => {
    await nextTick()
    const element = document.getElementById(id) as HTMLInputElement | null
    element?.focus()
    if (select) element?.select()
  }

  const onCodeInput = (value: string | number | boolean) => {
    const text = String(value)
    code.value = isRecovery.value ? normalizeRecoveryInput(text) : normalizeTotpInput(text)
    fieldErrors.value = { ...fieldErrors.value, code: undefined }
  }

  const switchMode = () => {
    mode.value = isRecovery.value ? 'totp' : 'recovery'
    code.value = ''
    fieldErrors.value = {}
    errorMessage.value = ''
    focusField('login-code')
  }

  const goBack = () => {
    step.value = 'password'
    mode.value = 'totp'
    code.value = ''
    password.value = ''
    fieldErrors.value = {}
    errorMessage.value = ''
    focusField('login-password')
  }

  const submit = async () => {
    errorMessage.value = ''
    fieldErrors.value = {}

    if (step.value === 'password') {
      const errors = validateCredentials(email.value, password.value)
      if (errors.email || errors.password) {
        fieldErrors.value = errors
        focusField(errors.email ? 'login-email' : 'login-password')
        return
      }
    } else {
      const codeError = validateSecondFactor(mode.value, code.value)
      if (codeError) {
        fieldErrors.value = { code: codeError }
        focusField('login-code')
        return
      }
    }

    isSubmitting.value = true
    try {
      if (step.value === 'password') {
        const needsCode = await login(email.value, password.value)
        if (needsCode) {
          password.value = ''
          pendingSince.value = Date.now()
          step.value = 'code'
          focusField('login-code')
          return
        }
      } else {
        await verifySecondFactor(code.value)
      }
      await navigateTo('/admin')
    } catch (error) {
      const status = toAdminApiError(error).status
      errorMessage.value = loginErrorMessage({
        step: step.value,
        status,
        expired: step.value === 'code' && isPendingExpired(pendingSince.value)
      })
      // Se conserva lo escrito: el foco vuelve al campo para corregirlo.
      focusField(step.value === 'password' ? 'login-password' : 'login-code', true)
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(() => focusField('login-email'))
</script>

<template>
  <div
    class="w-full max-w-md rounded-2xl border border-brand-border bg-brand-surface-card p-6 shadow-card-lg md:p-8"
  >
    <div class="mb-6 flex flex-col items-center border-b border-brand-border pb-6 text-center">
      <AppLogo :height="48" />
      <h1 class="mt-6 text-2xl font-semibold leading-tight text-brand-ink">
        {{ step === 'password' ? 'Iniciar sesión' : 'Verifica que eres tú' }}
      </h1>
      <p v-if="step === 'code'" class="mt-2 max-w-sm text-sm leading-6 text-brand-muted">
        {{
          isRecovery
            ? 'Usa uno de los códigos de recuperación que guardaste. Cada uno sirve una sola vez.'
            : 'Abre tu aplicación autenticadora e ingresa el código de 6 dígitos.'
        }}
      </p>
    </div>

    <form novalidate @submit.prevent="submit">
      <div class="space-y-4">
        <template v-if="step === 'password'">
          <AdminInput
            id="login-email"
            v-model="email"
            type="email"
            label="Correo"
            required
            autocomplete="email"
            inputmode="email"
            :error="fieldErrors.email"
          />
          <AdminInput
            id="login-password"
            v-model="password"
            type="password"
            label="Contraseña"
            revealable
            required
            autocomplete="current-password"
            :error="fieldErrors.password"
          />
        </template>

        <template v-else>
          <AdminInput
            id="login-code"
            :model-value="code"
            :label="isRecovery ? 'Código de recuperación' : 'Código de verificación'"
            required
            autocomplete="one-time-code"
            :inputmode="isRecovery ? undefined : 'numeric'"
            :placeholder="isRecovery ? 'XXXXX-XXXXX' : '000000'"
            :maxlength="isRecovery ? 11 : 6"
            input-class="text-center text-2xl font-semibold tabular-nums tracking-[0.2em]"
            :hint="
              isRecovery
                ? 'Formato XXXXX-XXXXX. Tienes 5 minutos desde que pusiste tu contraseña.'
                : 'Tienes 5 minutos desde que pusiste tu contraseña. Si vence, pulsa «Volver» e inicia sesión otra vez.'
            "
            :error="fieldErrors.code"
            @update:model-value="onCodeInput"
          />
        </template>
      </div>

      <AdminNotice tone="error" :message="errorMessage" gap="top" />

      <AdminButton
        type="submit"
        variant="primary"
        class="mt-4 w-full"
        :loading="isSubmitting"
        :loading-label="step === 'password' ? 'Verificando…' : 'Entrando…'"
      >
        {{ step === 'password' ? 'Continuar' : 'Entrar' }}
      </AdminButton>

      <div
        v-if="step === 'code'"
        class="mt-4 flex flex-col gap-2 border-t border-brand-border pt-4 sm:flex-row sm:justify-between"
      >
        <AdminButton variant="ghost" :disabled="isSubmitting" @click="goBack">
          <Icon name="mdi:arrow-left" size="18" aria-hidden="true" />
          Volver
        </AdminButton>
        <AdminButton variant="ghost" :disabled="isSubmitting" @click="switchMode">
          {{ isRecovery ? 'Usar el código de la aplicación' : 'Usar un código de recuperación' }}
        </AdminButton>
      </div>
    </form>
  </div>
</template>
