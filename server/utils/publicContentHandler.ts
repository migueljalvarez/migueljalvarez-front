/**
 * Handler de lectura pública del contenido del sitio (portafolio, redes, políticas, Sobre mí).
 *
 * - Producción: caché de 60 s por instancia, SIN stale-while-revalidate (`swr: false`). En Nitro `swr` vale
 *   `true` por defecto (nitropack 2.13.6, runtime/internal/cache.mjs:17), así que `maxAge` solo no basta.
 *   Con swr, una función serverless devolvía la copia vencida y el refresco en segundo plano quedaba congelado al
 *   terminar la respuesta (el preset de Netlify no define `event.waitUntil`): el panel guardaba, pero la home
 *   mostraba el texto anterior durante horas. `staleMaxAge` no lo arregla: solo cambia la cabecera HTTP, no limita
 *   la copia en memoria.
 * - Retraso máximo esperado entre guardar en el panel y verlo en la home: ~60 s de esta caché + hasta 120 s del CDN
 *   (ver routeRules de '/' en nuxt.config.ts) ≈ 3 minutos; lo normal es 1-2 minutos. No hay webhooks ni purgas: la
 *   caché en memoria por instancia no los haría fiables.
 * - Desarrollo: SIN caché. La caché de Nitro persiste en disco entre reinicios y serviría contenido viejo.
 */
export const definePublicContentHandler = <T>(name: string, load: () => Promise<T>) =>
  import.meta.dev
    ? defineEventHandler(() => load())
    : defineCachedEventHandler(() => load(), { name, maxAge: 60, swr: false })
