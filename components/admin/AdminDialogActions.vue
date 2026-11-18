<script setup lang="ts">
  // Pie de diálogo: acciones a la derecha en orden secundario → primario; en móvil, apiladas a ancho
  // completo con el primario arriba (por eso el orden del DOM va invertido en columna).
</script>

<template>
  <div
    class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end [&>*]:w-full sm:[&>*]:w-auto"
  >
    <slot />
  </div>
</template>
