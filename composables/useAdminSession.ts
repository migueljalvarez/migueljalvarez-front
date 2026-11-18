/**
 * Sesión del panel. La autenticación completa la resuelve la API en dos pasos:
 *   1) `login` (correo + contraseña) → sesión pendiente de 5 minutos;
 *   2) `verifySecondFactor` (código TOTP de 6 dígitos o código de recuperación) → sesión completa.
 * La cookie `admin_session` es HttpOnly: el navegador nunca la lee, solo la envía.
 */
export const useAdminSession = () => {
  const api = useAdminApi()
  const session = useState<{ email: string } | null>('admin-session', () => null)

  /** Paso 1. Devuelve `true` si la API pide el segundo factor. */
  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await api.post<{ mfaRequired: boolean }>('login', {
      email: email.trim(),
      password
    })
    return result.mfaRequired
  }

  /** Paso 2: código de 6 dígitos o de recuperación (XXXXX-XXXXX). */
  const verifySecondFactor = async (code: string): Promise<void> => {
    await api.post('login/totp', { code: code.trim() })
  }

  /** Carga el estado de la sesión actual; `null` si no hay sesión válida. */
  const load = async () => {
    try {
      session.value = await api.get<{ email: string }>('session')
    } catch {
      session.value = null
    }
    return session.value
  }

  const logout = async () => {
    try {
      await api.post('logout')
    } finally {
      session.value = null
      await navigateTo('/login')
    }
  }

  return { session, login, verifySecondFactor, load, logout }
}
