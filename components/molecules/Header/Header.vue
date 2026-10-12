<script lang="ts" setup>
  import Button from '~/components/atoms/Button/Button.vue'
  import { useSocialMedia } from '~/composables/useSocialMedia'
  import { PUBLIC_ROUTES } from '~/constants/routes'
  import type { SocialMediaType } from '~/types/common'
  import SocialMedia from '../SocialMedia/SocialMedia.vue'

  const sidebarOpen = ref(false)
  const isScrolled = ref(false)
  const activeSection = ref('home')

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const hoverIcon = (item: SocialMediaType) => {
    item.isHovered = true
  }
  const leaveIcon = (item: SocialMediaType) => {
    item.isHovered = false
  }

  const route = useRoute()
  const { socials } = useSocialMedia()
  let scrollHandler: (() => void) | null = null
  let sectionObserver: IntersectionObserver | null = null

  const navLinks = PUBLIC_ROUTES.map(item => ({
    ...item,
    sectionId: item.link.includes('#')
      ? item.link.split('#')[1]
      : item.link === '/'
        ? 'home'
        : item.link.slice(1)
  }))
  const isContactNavLink = (name: string) => name === 'Hablemos'
  const isHeroTop = computed(() => route.path === '/' && !isScrolled.value)

  const isActive = (link: string) => {
    if (link === '/') return activeSection.value === 'home'
    if (!link.includes('#')) {
      return route.path === link || (route.path === '/' && activeSection.value === link.slice(1))
    }
    return activeSection.value === link.split('#')[1]
  }

  onMounted(() => {
    isScrolled.value = window.scrollY > 10

    scrollHandler = () => {
      const scrollY = window.scrollY
      isScrolled.value = scrollY > 10

      if (scrollY <= 10) {
        activeSection.value = 'home'
      }
    }

    scrollHandler()
    window.addEventListener('scroll', scrollHandler, { passive: true })

    const targets = navLinks
      .map(link => link.sectionId)
      .filter(id => id !== 'home')
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (!targets.length) return

    sectionObserver = new IntersectionObserver(
      entries => {
        if (window.scrollY <= 10) {
          activeSection.value = 'home'
          return
        }

        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          activeSection.value = visible[0].target.id
        }
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.6],
        rootMargin: '-18% 0px -42% 0px'
      }
    )

    targets.forEach(target => sectionObserver?.observe(target))
  })

  onBeforeUnmount(() => {
    sectionObserver?.disconnect()
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
  })

  watch(
    () => route.fullPath,
    value => {
      if (!value.includes('#') && value === '/') {
        activeSection.value = 'home'
      }
    },
    { immediate: true }
  )
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 z-50 w-full backdrop-blur-md transition-all duration-200',
      isHeroTop
        ? 'header-top text-brand-white backdrop-blur-none'
        : 'bg-brand-surface/95 text-brand-ink',
      isScrolled
        ? 'shadow-[0_10px_30px_var(--color-brand-shadow-card)] border-b border-brand-border/80'
        : 'border-b-0 shadow-none'
    ]"
  >
    <div
      class="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <Transition name="logo-fade" mode="out-in">
        <NuxtImg
          :key="isHeroTop ? 'contact-logo' : 'brand-logo'"
          :src="isHeroTop ? 'brand_white_v2.svg' : 'brand.svg'"
          width="250"
          height="40"
          alt="Miguel Alvarez"
          format="webp"
          :class="['flex object-contain px-2', isHeroTop ? '' : '']"
        />
      </Transition>

      <nav
        class="hidden w-auto shrink-0 items-center justify-end gap-4 font-bold uppercase md:gap-5 xl:flex 2xl:flex"
      >
        <nuxt-link
          v-for="item in navLinks"
          :key="item.name"
          :to="item.link"
          :class="[
            isContactNavLink(item.name)
              ? 'text-brand-white'
              : isHeroTop
                ? 'text-brand-white'
                : 'text-brand-ink'
          ]"
          class="group inline-flex h-10 shrink-0 flex-col items-center justify-center gap-2 whitespace-nowrap text-xs font-bold leading-none tracking-[0.12em] transition-colors duration-300"
        >
          <span
            :class="
              isContactNavLink(item.name)
                ? 'rounded-lg bg-brand-accent px-4 py-2 text-brand-white shadow-sm transition-colors hover:bg-brand-mid'
                : ''
            "
          >
            {{ item.name }}
          </span>
          <span
            :class="[
              'h-0.5 w-full origin-center rounded-full bg-brand-blue transition-transform duration-300 motion-reduce:transition-none',
              isContactNavLink(item.name)
                ? 'invisible'
                : isActive(item.link)
                  ? 'scale-x-100'
                  : 'scale-x-0 group-hover:scale-x-100'
            ]"
            aria-hidden="true"
          />
        </nuxt-link>
      </nav>

      <div class="flex items-center gap-2 xl:hidden">
        <Button
          type="button"
          theme="secondary"
          aria-label="Toggle menu"
          class="ml-auto w-auto rounded-lg border-0 bg-transparent p-2"
          :class="[
            sidebarOpen ? 'hidden' : 'block',
            isHeroTop ? 'text-brand-white' : 'text-brand-ink'
          ]"
          @click="toggleSidebar"
        >
          <svg
            class="h-6 w-6 transition-transform duration-300 ease-in-out"
            :class="sidebarOpen ? 'rotate-90' : 'rotate-0'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              v-if="!sidebarOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    </div>
  </header>

  <aside
    class="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col justify-between overflow-y-auto border-r border-brand-border bg-brand-surface p-6 text-brand-ink transition-transform duration-300 ease-in-out lg:hidden"
    :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }"
  >
    <div>
      <div class="mb-8 flex items-center justify-end gap-3">
        <Button
          type="button"
          theme="secondary"
          aria-label="Close menu"
          class="w-auto rounded-lg border-0 bg-transparent p-2 text-brand-navy focus:ring-2 focus:ring-brand-accent"
          @click="toggleSidebar"
        >
          <svg
            class="h-6 w-6 transition-transform duration-300 ease-in-out hover:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>

      <nav class="flex flex-col gap-6 text-lg font-semibold uppercase">
        <nuxt-link
          v-for="item in navLinks"
          :key="item.name"
          :to="item.link"
          class="group flex w-fit flex-col items-start gap-2 py-1 text-brand-navy"
          @click="toggleSidebar"
        >
          <span>{{ item.name }}</span>
          <span
            v-if="!isContactNavLink(item.name)"
            :class="[
              'h-0.5 w-full origin-left rounded-full bg-brand-blue transition-transform duration-300 motion-reduce:transition-none',
              isActive(item.link) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            ]"
            aria-hidden="true"
          />
        </nuxt-link>
      </nav>
    </div>

    <div class="flex gap-6">
      <SocialMedia
        v-for="item in socials"
        :key="item.name"
        :link="item.link"
        :name="item.name"
        :icon="item.icon"
        :is-hovered="item.isHovered"
        orientation="horizontal"
        :size="28"
        @mouseover="hoverIcon(item)"
        @mouseleave="leaveIcon(item)"
      />
    </div>
  </aside>

  <div
    v-if="sidebarOpen"
    class="fixed inset-0 z-40 bg-brand-ink/30 md:hidden"
    @click="toggleSidebar"
  />
</template>

<style scoped>
  .header-top {
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-brand-surface-contrast) 65%, transparent),
      transparent
    );
  }

  .logo-fade-enter-active,
  .logo-fade-leave-active {
    transition: opacity 180ms ease;
  }

  .logo-fade-enter-from,
  .logo-fade-leave-to {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .logo-fade-enter-active,
    .logo-fade-leave-active {
      transition: none;
    }
  }
</style>
