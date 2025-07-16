<script lang="ts" setup>
  import Button from '~/components/atoms/Button/Button.vue'
  import Title from '~/components/atoms/Title/Title.vue'

  import { MAIN_TITLE_PRESENTATION, MAIN_TITLE_PRESENTATION_COMPLEMENT } from '~/constants/common'
  import type { Me } from '~/types/common'

  const name = ref('')
  const subtitle = ref('')
  const fullSubtitle = ref('')
  const fullDescription = ref('')

  const showWave = ref(false)
  const props = defineProps<{ me: Me | null }>()
  const showMainImage = ref(false)
  const isVisible = ref(false)
  onMounted(async () => {
    if (props.me) {
      name.value = ` ${props.me.name}!`
      subtitle.value = props.me.profession
      fullSubtitle.value = props.me.profession
      fullDescription.value = props.me.jobDescription || ''
      setTimeout(() => {
        isVisible.value = true
        showMainImage.value = true
      }, 100)
      setTimeout(() => {
        showWave.value = true
      }, 500)
    }
  })
</script>
<template>
  <section
    class="box-border relative flex justify-center w-full h-[600px] lg:h-[600px] xl:h-[488px] md:h-[488px] py-10 overflow-hidden bg-black"
  >
    <div class="max-w-[1440px] flex items-center">
      <Transition name="slide-left">
        <div
          v-if="isVisible"
          class="relative z-20 flex flex-col flex-wrap justify-center h-auto gap-2 px-4 text-white lg:pl-18 grow md:p-10 lg:w-3/5"
        >
          <h1 class="w-full text-6xl italic font-bold lg:text-6xl leading-[1.2]">
            <span class="inline-flex flex-wrap items-baseline gap-x-1">
              {{ MAIN_TITLE_PRESENTATION }}
              <Transition name="wave-fade">
                <NuxtImg
                  v-if="showWave"
                  src="/waving.webp"
                  alt="👋"
                  width="64"
                  height="64"
                  aria-label="saludo"
                  class="wave-animation inline-block h-[1em] w-auto align-baseline translate-y-2"
                  draggable="false"
                  loading="lazy"
                />
              </Transition>
              <span class="inline-block mr-2 align-baseline">,</span>
              <span>
                {{ `${MAIN_TITLE_PRESENTATION_COMPLEMENT} ${name}` }}
              </span>
            </span>
          </h1>

          <Title :text="subtitle" variant="h2" class="justify-start p-1 text-blue-400" />
          <p v-if="subtitle === fullSubtitle" class="text-gray-400 max-w-full sm:max-w-[80%]">
            {{ fullDescription }}
          </p>

          <div class="flex flex-row w-full gap-2 mt-4">
            <NuxtLink to="https://wa.link/bxjfgq" target="_blank" class="w-full md:w-2/4 xl:w-1/3">
              <Button :uppercase="true" icon="mdi:whatsapp" theme="tertiary">Contactar</Button>
            </NuxtLink>

            <a
              href="/docs/CV_DOWNLOAD.pdf"
              target="_blank"
              download="cv_download"
              class="w-full md:w-2/4 xl:w-1/3"
            >
              <Button :uppercase="true" icon="mdi:download">Descargar CV</Button>
            </a>
          </div>
        </div>
      </Transition>
      <Transition name="fade-up" appear>
        <div
          v-if="showMainImage"
          class="relative justify-center hidden w-180 rounded-2xl md:hidden lg:flex lg:w-2/5"
        >
          <NuxtImg
            src="about-me-transparent.webp"
            alt="Miguel Alvarez"
            width="300"
            height="350"
            class="relative z-10 rounded-2xl"
            loading="eager"
            fetchpriority="high"
          />
          <div class="absolute w-[300px] bg-white h-[200px] rounded-2xl top-[148px]"></div>
        </div>
      </Transition>
    </div>
  </section>
</template>
<style scoped>
  .slide-left-enter-active {
    transition:
      opacity 0.6s ease,
      transform 0.6s ease;
  }
  .slide-left-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }
  .slide-left-enter-from {
    opacity: 0;
    transform: translateX(-40px);
  }
  .slide-left-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }

  /* Saludo animado */
  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .wave-animation {
    display: inline-block;
    transform-origin: 70% 70%;
    animation: wave 2s ease-in-out infinite;
  }

  /* Transición opcional */
  .wave-fade-enter-active {
    transition: opacity 0.4s ease;
  }
  .wave-fade-enter-from {
    opacity: 0;
  }

  .fade-up-enter-active {
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }
  .fade-up-enter-from {
    opacity: 0;
    transform: translateY(30px);
  }
  .fade-up-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
</style>
