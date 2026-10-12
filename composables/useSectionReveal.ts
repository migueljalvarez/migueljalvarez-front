import type { Ref } from 'vue'

export function useSectionReveal(target: Ref<HTMLElement | null>, threshold = 0.12) {
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const element = target.value
    if (
      !element ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    element.classList.add('is-reveal-pending')
    observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          element.classList.remove('is-reveal-pending')
          element.classList.add('is-visible')
          observer?.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)
  })

  onBeforeUnmount(() => observer?.disconnect())
}
