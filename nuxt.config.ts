// https://nuxt.com/docs/api/configuration/nuxt-config

import { META } from './constants/common'

export default defineNuxtConfig({
  ssr: true,
  app: {
    rootAttrs: {
      lang: 'es'
    },
    head: {
      title: 'Miguel Alvarez',
      titleTemplate: '%s | Desarrollo de Software',
      meta: [
        {
          name: 'description',
          content: META.DESCRIPTION
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      htmlAttrs: {
        lang: 'es'
      }
    }
  },
  runtimeConfig: {
    // Secretos privados: vacíos a propósito (no se hornean en el build). Se proveen en ejecución con
    // NUXT_<CLAVE> (p. ej. NUXT_RESEND_API_KEY) o con el nombre clásico leído en server/utils/secrets.ts.
    resendApiKey: '',
    mailFrom: '',
    mailTo: '',
    // API de contenido (migueljalvarez-api). Vacío = sin API: el sitio usa su contenido de respaldo.
    // Se provee en ejecución con NUXT_API_BASE_URL (o API_BASE_URL). Las credenciales de servicio de
    // Cloudflare Access (NUXT_API_ACCESS_CLIENT_ID/SECRET) solo se necesitan si la API está detrás de Access.
    apiBaseUrl: '',
    apiAccessClientId: '',
    apiAccessClientSecret: '',
    // Clave compartida con la API para guardar los leads del formulario de contacto (INTAKE_API_KEY de la API).
    intakeApiKey: '',
    public: {
      // Los datos del titular (NUXT_PUBLIC_LEGAL_*) NO van aquí: la configuración pública se serializa en el HTML
      // de TODAS las páginas. Se leen en el servidor y solo llegan a Términos y Privacidad (GET /api/legal).
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/ui', '@nuxt/fonts'],
  fonts: {
    provider: 'google',
    // Solo los pesos y estilos que usa el diseño (sin pesos 300/800/900 ni cursiva de Poppins).
    families: [
      {
        name: 'Poppins',
        provider: 'google',
        display: 'swap',
        // Precarga solo los titulares (hero y secciones)
        preload: { weights: [600, 700], styles: ['normal'], subsets: ['latin'] },
        subsets: ['latin'],
        weights: [400, 500, 600, 700],
        styles: ['normal']
      },
      {
        name: 'Inter',
        provider: 'google',
        display: 'swap',
        // Archivo variable: un solo archivo cubre 400-700
        preload: { weights: [400], styles: ['normal'], subsets: ['latin'] },
        subsets: ['latin'],
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'] // la cursiva solo la usa QuoteBlock
      }
    ]
  },
  imports: {
    autoImport: true
  },
  image: {
    dir: 'public',
    format: ['webp', 'avif', 'svg'],
    sizes: [300, 480, 600, 768, 1024, 1280],
    screens: { sm: 320, md: 640, lg: 1024, xl: 1280 },
    // Imágenes subidas desde el panel (URL https del almacenamiento R2): ya vienen en WebP y se muestran tal
    // cual con `provider="none"` (ver ImageWithFallback); el optimizador solo procesa archivos del sitio.
    providers: { none: { provider: 'none' } }
  },
  hooks: {
    // Menos precargas en la home: las secciones bajo el pliegue (lazySection) se descargan al acercarse y los
    // layouts/páginas privadas no se prefetchean para visitantes públicos.
    'build:manifest': manifest => {
      const lazyChunks = new Set([
        'Services',
        'ProcessSection',
        'PortfolioSection',
        'About',
        'Contact'
      ])
      const privateSrc =
        /^(layouts\/(admin|auth)\.vue|pages\/(admin|login|testimonial)\/|pages\/login\.vue)/
      for (const entry of Object.values(manifest) as Array<{
        name?: string
        src?: string
        preload?: boolean
        prefetch?: boolean
      }>) {
        if (entry.name && lazyChunks.has(entry.name)) entry.preload = false
        if (entry.src && privateSrc.test(entry.src)) {
          entry.preload = false
          entry.prefetch = false
        }
      }
    }
  },
  devServer: {
    // Solo local: no expone el servidor de desarrollo a toda la red.
    host: 'localhost',
    port: 3000
  },
  routeRules: {
    // Cabeceras de seguridad para todo el sitio. El CSP completo (script-src, connect-src...) se
    // activará más adelante; por ahora solo directivas que no
    // pueden romper la hidratación de Nuxt.
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
        'Strict-Transport-Security': 'max-age=31536000',
        'Content-Security-Policy':
          "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"
      }
    },
    // Home: el HTML lo guarda el CDN de Netlify (no la memoria de la función) solo en producción; en desarrollo siempre
    // fresco. s-maxage=60 + stale-while-revalidate=60: pasado el minuto puede servir la copia vencida hasta 60 s más
    // mientras el propio CDN la renueva (esa renovación sí es fiable, a diferencia del swr de Nitro en serverless).
    // Antes era `swr: 60` sin tope (`stale-while-revalidate` a secas): servía copias vencidas durante horas.
    // Retraso máximo esperado tras publicar en el panel ≈ 3 min (60 s de caché de contenido + hasta 120 s del CDN).
    // No aplica a /privacidad ni /terminos-y-condiciones: el titular llega por variable en ejecución.
    // El middleware de mantenimiento corre antes de la caché, así que con la API caída sigue devolviendo 503.
    ...(process.env.NODE_ENV === 'production'
      ? {
          '/': {
            headers: {
              'Cache-Control': 'public, max-age=0, must-revalidate',
              'Netlify-CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60'
            }
          }
        }
      : {}),
    // Zonas privadas: sin caché compartida y fuera de buscadores.
    '/admin/**': {
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
    },
    // Enlaces antiguos del panel viejo.
    '/dashboard/**': { redirect: '/admin' },
    '/login': {
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
    },
    '/api/admin/**': { headers: { 'Cache-Control': 'no-store' } },
    // Enlace único del correo de testimonios: el token viaja en la URL, así que sin caché, sin
    // indexar y sin enviar el referrer a otros sitios.
    '/testimonio/**': {
      headers: {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        'Referrer-Policy': 'no-referrer'
      }
    },
    '/api/testimonial/**': { headers: { 'Cache-Control': 'no-store' } }
  },
  nitro: {
    // Comprime (gzip/brotli) los estáticos al compilar; reemplaza a vite-plugin-compression (sin mantenimiento).
    compressPublicAssets: true,
    publicAssets: [
      {
        baseURL: '/',
        dir: 'public'
      }
    ],
    prerender: {
      routes: [],
      failOnError: false,
      crawlLinks: false,
      concurrency: 1,
      interval: 200 // ms entre solicitudes
    },
    storage: {
      cache: {
        driver: 'memory',
        ttl: 60
      }
    }
  },
  vite: {
    css: {
      devSourcemap: false
    },
    build: {
      sourcemap: false
    }
  }
})
