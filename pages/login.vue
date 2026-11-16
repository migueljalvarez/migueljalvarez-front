<script setup lang="ts">
  definePageMeta({ layout: 'default' })
  useSeoMeta({ title: 'Acceso', robots: 'noindex, nofollow' })

  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const isSubmitting = ref(false)

  const login = async () => {
    if (!email.value || !password.value) {
      errorMessage.value = 'Ingresa email y contraseña.'
      return
    }

    try {
      isSubmitting.value = true
      errorMessage.value = ''

      await $fetch('/api/admin/login', {
        method: 'POST',
        body: {
          email: email.value.trim(),
          password: password.value
        }
      })

      await navigateTo('/dashboard')
    } catch (error) {
      const status = (error as { statusCode?: number }).statusCode
      errorMessage.value =
        status === 429
          ? 'Demasiados intentos. Inténtalo más tarde.'
          : status === 503
            ? 'Acceso no disponible por configuración.'
            : 'Credenciales inválidas.'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <section class="flex min-h-[70vh] items-center justify-center bg-[#F5F7FA] px-4 py-12">
    <div
      class="w-full max-w-md rounded-2xl border border-[#E9EEF5] bg-white p-6 shadow-[0_10px_24px_rgba(18,30,48,0.05)]"
    >
      <div class="mb-6">
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C2F4C]">Dashboard</p>
        <h1 class="mt-2 text-3xl font-semibold text-navy">Iniciar sesión</h1>
      </div>

      <form class="space-y-4" @submit.prevent="login">
        <div>
          <label class="mb-1 block text-sm font-medium text-navy" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none transition focus:border-[#243B62]"
            placeholder="admin@ejemplo.com"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-navy" for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-xl border border-[#E9EEF5] bg-[#F5F7FA] px-3 py-2.5 text-navy outline-none transition focus:border-[#243B62]"
            placeholder="••••••••"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

        <Button type="submit" size="md" :disabled="isSubmitting" class="w-full">
          {{ isSubmitting ? 'Ingresando...' : 'Entrar' }}
        </Button>
      </form>
    </div>
  </section>
</template>
