<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import Button from '~/components/atoms/Button/Button.vue'
  import Title from '~/components/atoms/Title/Title.vue'
  import { useTypeContent, type TypeContent } from '~/composables/useTypeContent'

  import { MAIN_TITLE_PRESENTATION, MAIN_TITLE_PRESENTATION_COMPLEMENT } from '~/constants/common'
  import type { Me } from '~/types/common'

  const title = ref<TypeContent[]>([])

  const subtitle = ref('')

  const fullSubtitle = ref('')
  const fullDescription = ref('')
  const titleFinish = ref(false)
  const finishWrite = ref(false)

  const props = defineProps<{ me: Me | null }>()
  const { typeText } = useTypeText(80)
  const emojiRef = ref<HTMLElement | null>(null)
  onMounted(async () => {
    const emoji = h('img', {
      ref: emojiRef,
      src: '/waving.png',
      alt: '👋',
      'aria-label': 'saludo',
      class: 'size-20 mx-1 scale-110 translate-y-[-10px] align-middle inline-block',
      draggable: false,
      loading: 'lazy'
    })

    if (props.me) {
      const content: TypeContent[] = [
        MAIN_TITLE_PRESENTATION,
        ' ',
        emoji,
        ',',
        ' ',
        MAIN_TITLE_PRESENTATION_COMPLEMENT
      ]

      //console.log(content)
      const complement = ` ${props.me.name}!`
      //fullTitle.value = `${content} ${props.me.name}!`
      const rawContent = [...content, complement]

      title.value = []
      subtitle.value = ''

      finishWrite.value = false

      fullSubtitle.value = props.me.profession
      fullDescription.value = props.me.jobDescription || ''
      const { typeContent } = useTypeContent(200)

      typeContent(rawContent, title, async () => {
        titleFinish.value = true

        typeText(fullSubtitle.value, subtitle, () => (finishWrite.value = true))
      })
    }
  })
</script>
<template>
  <section class="box-border relative flex justify-between w-full h-auto overflow-hidden">
    <div
      class="absolute 2xl:w-full inset-0 z-10 lg:flex 2xl:flex lg:bg-gradient-to-r lg:from-black lg:via-black lg:to-black/10 2xl:bg-gradient-to-r 2xl:from-black 2xl:via-black 2xl:to-black/10 h-[600px]"
    />

    <div
      class="relative z-20 flex flex-col flex-wrap justify-center h-auto gap-2 p-4 py-20 text-white bg-black lg:px-10 lg:p-8 lg:w-full 2xl:px-24 2xl:ml-20 grow lg:bg-transparent"
    >
      <div class="flex items-center gap-2">
        <h1 class="text-6xl font-bold lg:text-7xl">
          <template v-for="(item, index) in title" :key="index">
            <component :is="item" v-if="typeof item !== 'string'" />
            <span v-else>{{ item }}</span>
          </template>
          <span v-if="!titleFinish" class="ml-1 text-gray-400 animate-pulse">_</span>
        </h1>
      </div>

      <Title v-if="title" :text="subtitle" variant="h2" class="justify-start p-1 text-blue-400">
        <span v-if="!finishWrite && titleFinish" class="ml-1 text-gray-400 animate-pulse">_</span>
      </Title>
      <p v-if="subtitle === fullSubtitle" class="text-gray-400 max-w-[90%] sm:max-w-[80%]">
        {{ fullDescription }}
      </p>

      <div v-if="finishWrite" class="flex flex-row gap-2 mt-4">
        <NuxtLink to="https://wa.link/bxjfgq" target="_blank">
          <Button :uppercase="true" icon="mdi:whatsapp" theme="tertiary">Contactar</Button>
        </NuxtLink>

        <a href="/docs/CV_DOWNLOAD.pdf" target="_blank" download="cv_download">
          <Button :uppercase="true" icon="mdi:download">Descargar CV</Button>
        </a>
      </div>
    </div>
    <div class="hidden relative z-0 2xl:w-full overflow-hidden h-[600px] ml-25 lg:flex 2xl:flex">
      <NuxtImg
        src="bg.webp"
        alt="Ponente"
        class="object-cover w-full h-full overflow-hidden mask-linear-at-left mask-l-from-black mask-l-to-transparent mask-l-from-50% mask-l-to-95%"
        format="webp"
        quality="80"
        preload
        priority
      />
    </div>
  </section>
</template>
<style scoped>
  @keyframes wave-hand {
    0% {
      transform: rotate(0deg);
    }
    15% {
      transform: rotate(14deg);
    }
    30% {
      transform: rotate(-8deg);
    }
    45% {
      transform: rotate(14deg);
    }
    60% {
      transform: rotate(-4deg);
    }
    75% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .wave {
    animation: wave-hand 1.5s ease-in-out;
    transform-origin: bottom center;
    display: inline-block;
  }
</style>
