<script lang="ts" setup>
  import { Button } from '~/components/atoms'
  import { WHATSAPP_URL } from '~/constants/common'
  import type { ProjectFillerCardProps } from '../organism'

  // «Siguiente proyecto»: tarjeta que NO es un proyecto (no cuenta para el orden ni para el SEO). El listado la
  // pone al final del grid solo mientras haya menos de 3 proyectos publicados.
  withDefaults(defineProps<ProjectFillerCardProps>(), { headingLevel: 'h2' })
</script>

<template>
  <aside
    class="flex min-w-0 flex-col justify-center gap-4 rounded-[1.25rem] border-2 border-dashed border-logo-blue/40 bg-tint p-8 text-brand-ink md:p-10"
    aria-label="Siguiente proyecto"
  >
    <p class="text-xs font-semibold uppercase tracking-[0.14em] text-logo-blue">
      Siguiente proyecto
    </p>
    <component :is="headingLevel" class="text-2xl font-semibold leading-tight md:text-3xl">
      Aquí puede ir el tuyo.
    </component>
    <p class="max-w-md text-base leading-7 text-brand-muted">
      Estoy tomando nuevos proyectos. Cuéntame qué problema quieres resolver y lo definimos juntos
      antes de escribir una línea de código.
    </p>
    <div class="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button
        as="a"
        :href="WHATSAPP_URL"
        target="_blank"
        rel="noopener noreferrer"
        theme="whatsapp"
        icon="mdi:whatsapp"
        icon-position="left"
        class="sm:w-fit"
      >
        Hablemos por WhatsApp
      </Button>
      <Button
        v-track="{ id: 'cta_ver_como_trabajo' }"
        to="/como-trabajo"
        theme="secondary"
        class="border-brand-accent text-brand-accent hover:bg-brand-white/60 sm:w-fit"
      >
        Ver cómo trabajo
      </Button>
    </div>
  </aside>
</template>
