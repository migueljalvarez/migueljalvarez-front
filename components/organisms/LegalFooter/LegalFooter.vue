<script lang="ts" setup>
  import ContactDetails from '../ContactDetails/ContactDetails.vue'
</script>

<template>
  <!-- Franja legal compartida: logo + datos del titular, enlaces legales y ©. Se usa en el Contacto completo y en el compacto. -->
  <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
    <img
      src="/brand_white_v2.svg"
      width="250"
      height="40"
      alt="Miguel Álvarez"
      loading="lazy"
      decoding="async"
      class="object-contain"
    />
    <ContactDetails />
  </div>
</template>
