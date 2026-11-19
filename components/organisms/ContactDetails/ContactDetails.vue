<script setup lang="ts">
  import { LEGAL_ROUTES } from '~/constants/routes'

  const { holder, sentence } = useLegalHolder()

  const linkClass =
    'inline-flex min-h-11 items-center rounded-lg text-xs text-brand-text-subtle underline-offset-4 transition-colors duration-200 hover:text-brand-text-strong hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white motion-reduce:transition-none'
</script>

<template>
  <section
    aria-label="Enlaces legales y derechos reservados"
    class="mt-auto flex w-full flex-col items-center text-center text-xs leading-5 text-brand-text-subtle"
  >
    <nav aria-label="Enlaces legales">
      <ul class="flex flex-wrap justify-center gap-x-3">
        <li v-for="item in LEGAL_ROUTES" :key="item.link">
          <NuxtLink :to="item.link" :class="linkClass">{{ item.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <div v-if="sentence" class="max-w-md">
      <p class="text-balance">{{ sentence }}</p>
      <p v-if="holder.email || holder.city">
        <template v-if="holder.city">{{ holder.city }}, Colombia</template>
        <span v-if="holder.email && holder.city" class="mx-2" aria-hidden="true">·</span>
        <a
          v-if="holder.email"
          :href="`mailto:${holder.email}`"
          class="inline-flex min-h-11 items-center rounded-lg underline underline-offset-4 hover:text-brand-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white"
        >
          {{ holder.email }}
        </a>
      </p>
    </div>
    <p>&copy; {{ new Date().getFullYear() }} · Todos los derechos reservados</p>
  </section>
</template>
