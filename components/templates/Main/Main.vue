<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import Button from '~/components/atoms/Button/Button.vue'
  import Title from '~/components/atoms/Title/Title.vue'

  import { MAIN_TITLE_PRESENTATION } from '~/constants/common'
  import type { Me } from '~/types/common'

  const title = ref('')
  const subtitle = ref('')
  const description = ref('')
  const fullTitle = ref('')
  const fullSubtitle = ref('')
  const fullDescription = ref('')
  const finishWrite = ref(false)

  const props = defineProps<{ me: Me | null }>()
  const { typeText } = useTypeText(80)

  onMounted(async () => {
    if (props.me) {
      fullTitle.value = `${MAIN_TITLE_PRESENTATION} ${props.me.name}!`
      fullSubtitle.value = props.me.profession
      fullDescription.value = props.me.jobDescription || ''
      typeText(fullTitle.value, title, () => {
        typeText(fullSubtitle.value, subtitle, () => {
          typeText(fullDescription.value, description, () => {
            finishWrite.value = true
          })
        })
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
      class="relative z-20 flex flex-col flex-wrap justify-center h-auto gap-2 p-4 pt-40 text-white bg-black lg:p-8 lg:w-full 2xl:px-24 2xl:ml-20 grow lg:bg-transparent"
    >
      <Title :text="title" variant="h1" />
      <Title
        v-if="title === fullTitle"
        :text="subtitle"
        variant="h3"
        class="justify-start p-1 text-blue-400"
      />
      <p v-if="subtitle === fullSubtitle" class="text-gray-400 max-w-[90%] sm:max-w-[80%]">
        {{ description }}
      </p>
      <div v-if="finishWrite" class="flex flex-row gap-2 mt-4">
        <NuxtLink to="https://wa.link/bxjfgq" target="_blank">
          <Button :uppercase="true" icon="mdi:whatsapp" theme="tertiary">Contactar</Button>
        </NuxtLink>

        <NuxtLink to="./docs/cv.pdf" target="_blank">
          <Button :uppercase="true" icon="mdi:download">Descargar CV</Button>
        </NuxtLink>
      </div>
    </div>
    <div class="hidden relative z-0 2xl:w-full overflow-hidden h-[600px] ml-25 lg:flex 2xl:flex">
      <NuxtImg
        src="bg.webp"
        alt="Ponente"
        class="object-cover w-full h-full overflow-hidden mask-linear-at-left mask-l-from-black mask-l-to-transparent mask-l-from-50% mask-l-to-95%"
        format="webp"
        quality="80"
        loading="lazy"
        :preload="true"
        priority
      />
    </div>
  </section>
</template>
