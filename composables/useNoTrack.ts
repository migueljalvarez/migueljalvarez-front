import { isTrackingDisabled, setTrackingDisabled } from '~/utils/track'

/**
 * Interruptor «No contar mis visitas» del panel. La marca vive SOLO en el localStorage del navegador del
 * autor (clave `mj_no_track`); es la única escritura en almacenamiento del sitio y solo la hace el panel.
 * Antes de montar el valor es `false` (el SSR no conoce el navegador).
 */
export const useNoTrack = () => {
  const disabled = ref(false)
  const failed = ref(false)
  const storage = () => window.localStorage

  onMounted(() => {
    disabled.value = isTrackingDisabled(storage)
  })

  const toggle = (value: boolean) => {
    failed.value = !setTrackingDisabled(storage, value)
    disabled.value = failed.value ? disabled.value : value
  }

  return { disabled, failed, toggle }
}
