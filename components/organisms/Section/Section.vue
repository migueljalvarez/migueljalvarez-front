<script lang="ts" setup>
  import { Title } from '~/components/atoms'

  type SectionType = {
    id: string
    title?: string
    background?: string
    backgroundImage?: string
  }
  const props = withDefaults(defineProps<SectionType>(), {
    title: ''
  })

  const sectionClass = computed(() => ({
    'text-gray-800': props.background === 'bg-white' && !props.backgroundImage,
    'text-white': !!props.backgroundImage,
    [props.background || '']: true
  }))

  const backgroundStyle = computed(() => {
    if (!props.backgroundImage) return {}
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }
  })
</script>

<template>
  <section :id="id" :class="['w-full h-auto', sectionClass]" :style="backgroundStyle">
    <div class="flex flex-col items-center w-full gap-6">
      <Title v-if="title" :text="String(title)" variant="h2" />
      <slot />
    </div>
  </section>
</template>
