/**
 * Handler de lectura pública del contenido del sitio (portafolio, redes, políticas).
 *
 * - Producción: caché corta con stale-while-revalidate (60 s). Lo que se publica en el panel aparece en
 *   el sitio en pocos minutos y un fallo momentáneo de la API no se queda guardado mucho tiempo.
 * - Desarrollo: SIN caché. La caché de Nitro persiste en disco entre reinicios y serviría contenido viejo.
 */
export const definePublicContentHandler = <T>(name: string, load: () => Promise<T>) =>
  import.meta.dev
    ? defineEventHandler(() => load())
    : defineCachedEventHandler(() => load(), { name, maxAge: 60, swr: true })
