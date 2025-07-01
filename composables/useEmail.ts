export function useEmail() {
  const sendEmail = async (fullName: string, email: string, subject: string, message: string) => {
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: {
          name: fullName,
          email,
          subject,
          message
        }
      })

      return true
    } catch (error) {
      console.error('Error enviando el correo:', error)
      throw new Error('No se pudo enviar el correo')
    }
  }

  return {
    sendEmail
  }
}
