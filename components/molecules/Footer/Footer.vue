<script setup lang="ts"></script>

<template>
  <footer class="box-border flex flex-col w-full">
    <div
      class="flex w-full px-4 py-4 mx-auto text-sm grid-cols text-[#4D5868] sm:flex-row sm:text-base"
    >
      <p class="flex justify-between w-full gap-8 px-4 mx-auto max-w-7xl text-sm">
        <span class="font-sans text-navy">
          &copy; {{ new Date().getFullYear() }} Miguel Álvarez
        </span>
        <span class="font-sans">Servicios de consultoría y desarrollo de software</span>
      </p>
    </div>
  </footer>
</template>
