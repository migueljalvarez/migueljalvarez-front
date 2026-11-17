/** Mensaje de confirmación breve (visible y anunciado a lectores de pantalla). */
export const useAdminStatus = () => {
  const status = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  const announce = (message: string) => {
    status.value = message
    clearTimeout(timer)
    timer = setTimeout(() => (status.value = ''), 3500)
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { status, announce }
}
