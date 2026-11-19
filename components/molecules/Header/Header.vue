<script lang="ts" setup>
  import AppLogo from '~/components/atoms/AppLogo/AppLogo.vue'
  import Button from '~/components/atoms/Button/Button.vue'
  import { useSocialMedia } from '~/composables/useSocialMedia'
  import { PUBLIC_ROUTES } from '~/constants/routes'
  import SocialMedia from '../SocialMedia/SocialMedia.vue'

  const menuId = 'mobile-menu'

  const sidebarOpen = ref(false)
  const isScrolled = ref(false)
  const activeSection = ref('home')
  let isMounted = false

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const route = useRoute()
  const { socials } = useSocialMedia()
  const topSentinel = ref<HTMLElement | null>(null)
  let observers: IntersectionObserver[] = []

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
    if (route.path !== '/') return !link.includes('#') && route.path === link
    if (link === '/') return activeSection.value === 'home'
    return link.includes('#') && activeSection.value === link.split('#')[1]
  }

  const stopScrollSpy = () => {
    observers.forEach(observer => observer.disconnect())
    observers = []
  }

  // Scroll-spy con IntersectionObserver (sin listeners de scroll ni lecturas de layout por fotograma):
  // un centinela en lo alto del documento marca "con scroll" y una línea al 30 % de la ventana marca la
  // sección activa, igual que el cálculo anterior.
  const startScrollSpy = async () => {
    stopScrollSpy()
    if (typeof IntersectionObserver === 'undefined') return

    if (topSentinel.value) {
      const topObserver = new IntersectionObserver(([entry]) => {
        isScrolled.value = !entry!.isIntersecting
        if (route.path === '/' && !isScrolled.value) activeSection.value = 'home'
      })
      topObserver.observe(topSentinel.value)
      observers.push(topObserver)
    }

    if (route.path !== '/') {
      activeSection.value = ''
      return
    }

    await nextTick()
    if (route.path !== '/') return

    const targets = navLinks
      .filter(link => link.link.includes('#'))
      .map(link => document.getElementById(link.sectionId))
      .filter(Boolean) as HTMLElement[]
    const crossing = new Set<HTMLElement>()

    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) crossing.add(entry.target as HTMLElement)
          else crossing.delete(entry.target as HTMLElement)
        })

        const current = targets.filter(target => crossing.has(target)).at(-1)
        if (current) {
          activeSection.value = current.id
        } else if (
          !isScrolled.value ||
          (targets[0] && targets[0].getBoundingClientRect().top > window.innerHeight * 0.3)
        ) {
          activeSection.value = 'home'
        }
      },
      { rootMargin: '-30% 0px -69% 0px' }
    )
    targets.forEach(target => sectionObserver.observe(target))
    observers.push(sectionObserver)
  }

  onMounted(() => {
    isMounted = true
    void startScrollSpy()
  })

  watch(
    () => route.path,
    () => {
      if (isMounted) void startScrollSpy()
    }
  )

  onBeforeUnmount(() => {
    isMounted = false
    stopScrollSpy()
  })

  watch(
    () => route.fullPath,
    value => {
      if (route.path === '/' && !value.includes('#') && value === '/') {
        activeSection.value = 'home'
      } else if (route.path !== '/') {
        activeSection.value = ''
      }
    },
    { immediate: true }
  )
</script>

<template>
  <div
    ref="topSentinel"
    class="pointer-events-none absolute top-0 left-0 h-px w-px"
    aria-hidden="true"
  />
  <header
    :class="[
      'fixed top-0 left-0 z-50 w-full transition-all duration-200',
      isHeroTop ? 'header-top text-brand-white' : 'bg-brand-surface text-brand-ink',
      isScrolled ? 'shadow-header border-b border-brand-border/80' : 'border-b-0 shadow-none'
    ]"
  >
    <div
      class="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <!-- Logo compacto: blanco sobre el hero (transparente) y a color con el header sólido. Dos imágenes con
           fundido cruzado de 200 ms (igual que el fondo): sin fotograma con logo blanco sobre fondo claro. -->
      <span class="relative block h-10 w-61.25 shrink-0">
        <AppLogo
          variant="compact"
          surface="dark"
          :decorative="!isHeroTop"
          class="absolute inset-0 size-full px-2 transition-opacity duration-200 motion-reduce:transition-none"
          :class="isHeroTop ? 'opacity-100' : 'opacity-0'"
        />
        <AppLogo
          variant="compact"
          surface="light"
          :decorative="isHeroTop"
          class="absolute inset-0 size-full px-2 transition-opacity duration-200 motion-reduce:transition-none"
          :class="isHeroTop ? 'opacity-0' : 'opacity-100'"
        />
      </span>

      <nav
        class="hidden w-auto shrink-0 items-center justify-end gap-4 font-bold uppercase md:gap-5 xl:flex"
      >
        <nuxt-link
          v-for="item in navLinks"
          :key="item.name"
          :to="item.link"
          :class="
            isContactNavLink(item.name) || isHeroTop
              ? 'text-brand-white focus-visible:outline-brand-white'
              : 'text-brand-ink focus-visible:outline-brand-blue'
          "
          :aria-current="isActive(item.link) ? 'page' : undefined"
          class="nav-link group inline-flex h-11 shrink-0 flex-col items-center justify-center gap-2 whitespace-nowrap text-xs font-bold leading-none tracking-[0.12em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
        >
          <span
            :class="
              isContactNavLink(item.name)
                ? [
                    'rounded-lg px-4 py-2 transition-colors',
                    isHeroTop
                      ? 'bg-brand-warm text-brand-navy hover:bg-brand-warm/85'
                      : 'bg-brand-accent text-brand-white hover:bg-brand-mid'
                  ]
                : ''
            "
          >
            {{ item.name }}
          </span>
          <span
            class="nav-indicator h-0.5 w-full origin-center rounded-full bg-brand-blue transition-[transform,opacity] duration-300 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </nuxt-link>
      </nav>

      <div class="flex items-center gap-2 xl:hidden">
        <Button
          type="button"
          theme="secondary"
          aria-label="Abrir menú"
          :aria-expanded="sidebarOpen"
          :aria-controls="menuId"
          :on-dark="isHeroTop"
          class="ml-auto w-auto min-w-11 border-0 bg-transparent p-2"
          :class="[
            sidebarOpen ? 'hidden' : 'block',
            isHeroTop ? 'text-brand-white' : 'text-brand-ink'
          ]"
          @click="toggleSidebar"
        >
          <svg
            class="size-6 transition-transform duration-300 ease-in-out motion-reduce:transition-none"
            :class="sidebarOpen ? 'rotate-90' : 'rotate-0'"
            aria-hidden="true"
            focusable="false"
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
    :id="menuId"
    aria-label="Menú de navegación"
    :inert="!sidebarOpen"
    class="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col justify-between overflow-y-auto border-r border-brand-border bg-brand-surface p-6 text-brand-ink transition-transform duration-300 ease-in-out motion-reduce:transition-none xl:hidden"
    :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }"
    @keydown.esc="sidebarOpen = false"
  >
    <div>
      <div class="mb-8 flex items-center justify-end gap-3">
        <Button
          type="button"
          theme="secondary"
          aria-label="Cerrar menú"
          class="w-auto min-w-11 border-0 bg-transparent p-2 text-brand-navy"
          @click="toggleSidebar"
        >
          <svg
            class="size-6"
            aria-hidden="true"
            focusable="false"
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
          :aria-current="isActive(item.link) ? 'page' : undefined"
          class="nav-link group flex min-h-11 w-fit flex-col items-start justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          :class="
            isContactNavLink(item.name)
              ? 'rounded-lg bg-brand-accent px-4 py-2 text-sm tracking-[0.12em] text-brand-white transition-colors hover:bg-brand-mid motion-reduce:transition-none'
              : 'py-1 text-brand-navy'
          "
          @click="toggleSidebar"
        >
          <span>{{ item.name }}</span>
          <span
            v-if="!isContactNavLink(item.name)"
            :class="[
              'nav-indicator h-0.5 w-full origin-left rounded-full bg-brand-blue transition-[transform,opacity] duration-300 motion-reduce:transition-none'
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
        :size="28"
        on-light
      />
    </div>
  </aside>

  <div
    v-if="sidebarOpen"
    class="fixed inset-0 z-40 bg-brand-ink/30 xl:hidden"
    aria-hidden="true"
    @click="toggleSidebar"
  />
</template>

<style scoped>
  /* Inactivo: sin ancho y sin opacidad, para que no quede ni un punto de la animación. */
  .nav-indicator {
    transform: scaleX(0);
    opacity: 0;
  }

  .nav-link:hover .nav-indicator,
  .nav-link[aria-current='page'] .nav-indicator {
    transform: scaleX(1);
    opacity: 1;
  }

  .header-top {
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-brand-surface-contrast) 65%, transparent),
      transparent
    );
  }

  @media (prefers-reduced-motion: reduce) {
    .logo-fade-enter-active,
    .logo-fade-leave-active {
      transition: none;
    }
  }
</style>
