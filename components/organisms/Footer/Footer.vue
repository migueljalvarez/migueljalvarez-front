<script lang="ts" setup>
  import { SocialMedia } from '~/components/molecules'
  import { FOOTER_ROUTES, LEGAL_ROUTES } from '~/constants/routes'

  const { socials } = useSocialMedia()
  const { holder, sentence } = useLegalHolder()

  const linkClass =
    'inline-flex min-h-11 items-center rounded-lg text-sm text-brand-text-subtle underline-offset-4 transition-colors duration-200 hover:text-brand-text-strong hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-white motion-reduce:transition-none'
  const headingClass = 'text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-soft'
</script>

<template>
  <footer class="border-t border-brand-border-soft bg-brand-surface-contrast px-4 py-10 md:py-12">
    <div class="mx-auto grid w-full max-w-7xl gap-8 sm:px-2 md:grid-cols-3 lg:px-4">
      <div>
        <NuxtImg
          src="brand_white_v2.svg"
          width="250"
          height="40"
          alt="Miguel Álvarez"
          format="webp"
          class="h-10 w-auto object-contain"
        />
        <p class="mt-4 max-w-sm text-sm leading-6 text-brand-text-subtle">
          Desarrollo de software a tu medida: primero entiendo el problema, después escribo código.
        </p>
        <div v-if="sentence" class="mt-4 max-w-sm text-sm leading-6 text-brand-text-subtle">
          <p>{{ sentence }}</p>
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
      </div>

      <nav aria-label="Enlaces del sitio">
        <p :class="headingClass">Explora</p>
        <ul class="mt-2 flex flex-col">
          <li v-for="item in FOOTER_ROUTES" :key="item.link">
            <NuxtLink :to="item.link" :class="linkClass">{{ item.name }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex flex-col gap-6">
        <nav aria-label="Información legal">
          <p :class="headingClass">Legal</p>
          <ul class="mt-2 flex flex-col">
            <li v-for="item in LEGAL_ROUTES" :key="item.link">
              <NuxtLink :to="item.link" :class="linkClass">{{ item.name }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <div v-if="socials.length">
          <p :class="headingClass">Redes</p>
          <div class="mt-2 flex flex-wrap gap-x-4">
            <SocialMedia
              v-for="item in socials"
              :key="item.name"
              :link="item.link"
              :name="item.name"
              :icon="item.icon"
              :size="20"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
