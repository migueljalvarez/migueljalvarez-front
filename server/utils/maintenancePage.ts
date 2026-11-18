/**
 * Página de mantenimiento (HTML autocontenido). Se responde con 503 cuando la API no está disponible:
 * al no pasar por Nuxt, no depende de la API ni de ningún JS del sitio. Identidad: banda oscura
 * (`brand-navy`), hexágono como motivo, Poppins/Inter si están disponibles y tipografía de sistema si no.
 */
export const MAINTENANCE_RETRY_SECONDS = 60

export const maintenanceHtml = (): string => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Volvemos en unos minutos | Miguel Alvarez</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px 16px; background: #121e30; color: #f5f7fa; font-family: Inter, system-ui, -apple-system, 'Segoe UI', sans-serif; }
  main { width: 100%; max-width: 32rem; text-align: center; }
  svg { width: 72px; height: 72px; color: #3f6bad; }
  p.eyebrow { margin: 24px 0 0; font-size: 12px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: #9fb3d1; }
  h1 { margin: 12px 0 0; font-family: Poppins, Inter, system-ui, sans-serif; font-size: clamp(1.75rem, 5vw, 2.25rem); line-height: 1.15; font-weight: 600; letter-spacing: -.02em; }
  p.lead { margin: 16px 0 0; font-size: 16px; line-height: 1.7; color: #c9d1dc; }
  button { margin-top: 32px; min-height: 44px; padding: 0 24px; border: 1px solid #3f6bad; border-radius: 8px; background: #3f6bad; color: #fff; font: 600 14px/1 Inter, system-ui, sans-serif; cursor: pointer; }
  button:hover { background: #4c79bd; }
  button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
  p.hint { margin: 16px 0 0; font-size: 13px; color: #9fb3d1; }
</style>
</head>
<body>
<main role="main" aria-labelledby="title">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5 20.2 7.25v9.5L12 21.5 3.8 16.75v-9.5L12 2.5Z"/><path d="M12 8v4.5l3 1.75" stroke-linecap="round"/></svg>
  <p class="eyebrow">Mantenimiento</p>
  <h1 id="title">Estoy actualizando el sitio</h1>
  <p class="lead">Estoy haciendo un ajuste rápido y vuelvo en unos minutos. No tienes que hacer nada: esta página se reintenta sola.</p>
  <button type="button" onclick="location.reload()">Reintentar ahora</button>
  <p class="hint">Se vuelve a comprobar cada ${MAINTENANCE_RETRY_SECONDS} segundos.</p>
</main>
<script>setTimeout(function () { location.reload() }, ${MAINTENANCE_RETRY_SECONDS * 1000})</script>
</body>
</html>`
