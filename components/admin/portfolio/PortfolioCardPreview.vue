<script setup lang="ts">
  import ProjectCard from '~/components/templates/Portfolio/ProjectCard.vue'
  import { formToCardProject, type PortfolioFormValues } from '~/utils/admin/portfolio'

  // La tarjeta real de la home (ProjectCard) con lo que hay en el formulario. Es una vista previa:
  // `inert` evita que se pueda enfocar o abrir. El ancho es el de una tarjeta de la rejilla del sitio.
  const props = defineProps<{ values: PortfolioFormValues }>()
  const project = computed(() => formToCardProject(props.values))
</script>

<template>
  <div>
    <p class="mb-2 flex items-center gap-2 text-sm font-medium text-brand-ink">
      <Icon name="mdi:eye-outline" size="18" class="text-brand-accent-text" aria-hidden="true" />
      Así se verá en la home
    </p>
    <div class="w-full max-w-sm" inert>
      <ProjectCard :project="project" variant="default" layout-mode="bento" show-type-badge />
    </div>
  </div>
</template>
