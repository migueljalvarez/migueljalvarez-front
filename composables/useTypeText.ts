// composables/useTypeText.ts

export const useTypeText = (typingSpeed = 100) => {
  const typeText = (fullText: string, target: Ref<string>, callback?: () => void) => {
    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.length) {
        target.value += fullText[index]
        index++
      } else {
        clearInterval(interval)
        callback?.()
      }
    }, typingSpeed)
  }

  return { typeText }
}
