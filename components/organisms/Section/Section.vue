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
    'text-white': props.backgroundImage
  }))
  // Background style computed
  const backgroundStyle = computed(() => {
    const style: Record<string, string> = {}
    if (props.backgroundImage) {
      style.backgroundImage = `url(${props.backgroundImage})`
      style.backgroundSize = 'cover'
      style.backgroundPosition = 'center'
      style.backgroundRepeat = 'no-repeat'
      style.backgroundAttachment = 'fixed'
    }
    return style
  })
</script>
<template>
  <section
    :id="id"
    :class="sectionClass"
    :style="backgroundStyle"
    class="flex flex-col items-center justify-center w-full h-auto text-lg font-bold"
  >
    <Title :text="String(title)" variant="h2" />
    <slot />
  </section>
</template>
<style></style>
