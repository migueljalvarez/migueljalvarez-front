<script lang="ts" setup>
  import AppLogo from '~/components/atoms/AppLogo/AppLogo.vue'
  import ContactDetails from '../ContactDetails/ContactDetails.vue'
</script>

<template>
  <!-- Franja legal compartida: logo + datos del titular, enlaces legales y ©. Se usa en el Contacto completo y en el compacto. -->
  <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
    <AppLogo variant="compact" surface="dark" :height="40" loading="lazy" />
    <ContactDetails />
  </div>
</template>
