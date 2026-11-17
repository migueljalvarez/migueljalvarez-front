// https://nuxt.com/docs/api/configuration/nuxt-config

import compression from 'vite-plugin-compression'
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
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
        { rel: 'preload', as: 'image', href: '/about-me-transparent.webp' }
      ],
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
    adminEmail: '',
    adminPassword: '',
    adminSessionSecret: '',
    firebaseProjectId: '',
    firebaseClientEmail: '',
    firebasePrivateKey: '',
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
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
      { name: 'Inter', provider: 'google', display: 'swap', preload: true, subsets: ['latin'] },
      { name: 'IBM Plex Mono', provider: 'google', display: 'swap', subsets: ['latin'] }
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
    domains: ['res.cloudinary.com'],
    providers: {
      ipx: {},
      cloudinary: {
        provider: 'cloudinary',
        options: {
          baseURL: 'https://res.cloudinary.com/m2a/image/upload/'
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
    // activará cuando se retire el SDK de Firebase del navegador; por ahora solo directivas que no
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
    '/dashboard/**': {
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
    },
    '/login': {
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
    },
    '/api/admin/**': { headers: { 'Cache-Control': 'no-store' } }
  },
  nitro: {
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
    plugins: [compression()],
    css: {
      devSourcemap: false
    },
    build: {
      sourcemap: false
    }
  }
})
