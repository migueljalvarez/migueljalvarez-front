import { nextTick, type Ref, type VNode } from 'vue'

export type TypeContent = string | VNode

export const useTypeContent = (typingSpeed = 80) => {
  const typeContent = (
    fullContent: TypeContent[],
    target: Ref<TypeContent[]>,
    callback?: () => void
  ) => {
    target.value = []

    // 1. Convertimos todo a una cola de caracteres y nodos
    const queue: TypeContent[] = []

    fullContent.forEach(item => {
      if (typeof item === 'string') {
        item.split('').forEach(char => queue.push(char))
      } else {
        queue.push(item)
      }
    })

    // 2. Ejecutamos carácter por carácter (o nodo por nodo)
    const interval = setInterval(() => {
      if (queue.length === 0) {
        clearInterval(interval)
        callback?.()
        return
      }
      const next = queue.shift()!
      target.value.push(next)
      if (typeof next !== 'string' && next.type === 'img') {
        nextTick(() => {
          const imgs = document.querySelectorAll('img[aria-label="saludo"]')
          const last = imgs[imgs.length - 1]
          if (last && !last.classList.contains('wave')) {
            last.classList.add('wave')
          }
        })
      }
      target.value.push(queue.shift()!)
    }, typingSpeed)
  }

  return { typeContent }
}
