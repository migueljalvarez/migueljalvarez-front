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
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      // Titular del sitio (Términos, Privacidad y pie). Vacío a propósito: nunca van datos personales en el
      // código. Se llenan en ejecución con NUXT_PUBLIC_LEGAL_NAME, _ID_TYPE (CC | NIT), _ID_NUMBER, _EMAIL y _CITY.
      legal: {
        name: '',
        idType: '',
        idNumber: '',
        email: '',
        city: ''
      }
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/ui', '@nuxt/fonts'],
  fonts: {
    provider: 'google',
    families: [
      { name: 'Poppins', provider: 'google', display: 'swap', preload: true, subsets: ['latin'] },
      { name: 'Inter', provider: 'google', display: 'swap', preload: true, subsets: ['latin'] }
    ]
  },
  imports: {
    autoImport: true
  },
  image: {
    dir: 'public',
    format: ['webp', 'avif', 'svg'],
    sizes: [300, 480, 600, 768, 1024, 1280],
    screens: { sm: 320, md: 640, lg: 1024, xl: 1280 }
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
    // Zonas privadas: sin caché compartida y fuera de buscadores.
    '/admin/**': {
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
    },
    // Enlaces antiguos del panel viejo.
    '/dashboard/**': { redirect: '/admin' },
    '/login': {
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
    },
    '/api/admin/**': { headers: { 'Cache-Control': 'no-store' } }
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
