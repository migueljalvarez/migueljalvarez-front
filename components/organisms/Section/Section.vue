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

  const sectionRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    if (!sectionRef.value) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            sectionRef.value?.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    observer.observe(sectionRef.value)
  })

  const sectionClass = computed(() => ({
    'text-brand-ink': props.background === 'bg-white' && !props.backgroundImage,
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
  <section
    :id="id"
    ref="sectionRef"
    :class="['reveal-section w-full h-auto', sectionClass]"
    :style="backgroundStyle"
  >
    <div class="flex flex-col items-center w-full gap-6">
      <Title v-if="title" :text="String(title)" variant="h2" />
      <slot />
    </div>
  </section>
</template>

<style scoped>
  .reveal-section {
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }

  .reveal-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>
