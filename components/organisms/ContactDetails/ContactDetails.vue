<script setup lang="ts">
  import { LEGAL_ROUTES } from '~/constants/routes'

  const { holder, sentence } = useLegalHolder()
  const linkClass =
    'inline-flex min-h-11 items-center rounded-lg text-xs text-brand-text-subtle underline-offset-4 transition-colors duration-200 hover:text-brand-text-strong hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white motion-reduce:transition-none'
</script>

<template>
  <section
    aria-label="Información legal"
    class="flex w-full flex-col items-center gap-2 text-center text-xs leading-5 text-brand-text-subtle md:w-auto md:items-end md:text-right"
  >
    <nav aria-label="Enlaces legales">
      <ul class="flex flex-wrap justify-center gap-x-3 md:justify-end">
        <li v-for="item in LEGAL_ROUTES" :key="item.link">
          <NuxtLink :to="item.link" :class="linkClass">{{ item.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <p v-if="sentence">{{ sentence }}</p>
    <p v-if="holder.city">{{ holder.city }}, Colombia</p>
    <a
      v-if="holder.email"
      :href="`mailto:${holder.email}`"
      class="inline-flex min-h-11 items-center rounded-lg underline underline-offset-4 hover:text-brand-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white"
    >
      {{ holder.email }}
    </a>
    <p>&copy; {{ new Date().getFullYear() }} · Todos los derechos reservados</p>
  </section>
</template>
