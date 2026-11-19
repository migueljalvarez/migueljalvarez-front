import { defineAsyncComponent, hydrateOnVisible } from 'vue'
import type { Component } from 'vue'

// Sección bajo el pliegue: el HTML sale completo del SSR (SEO y anclas intactos), pero su JS se descarga y
// se hidrata cuando está a punto de entrar en pantalla. El margen evita que la animación de aparición
// (useSectionReveal) se dispare con la sección ya visible.
export function lazySection<T extends Component>(loader: () => Promise<{ default: T } | T>) {
  return defineAsyncComponent({
    loader: loader as () => Promise<Component>,
    hydrate: hydrateOnVisible({ rootMargin: '250px 0px' })
  })
}
