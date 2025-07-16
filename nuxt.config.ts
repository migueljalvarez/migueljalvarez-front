// https://nuxt.com/docs/api/configuration/nuxt-config

import compression from 'vite-plugin-compression'
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
          content:
            'Desarrollador de Software con enfoque en crear soluciones digitales escalables y de alto impacto. Transformo ideas en productos funcionales, combinando eficiencia técnica con una visión orientada a resultados.'
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
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  modules: ['@nuxt/icon', '@nuxt/image-edge', '@nuxt/ui', '@nuxt/fonts'],
  fonts: {
    provider: 'google',
    families: [
      { name: 'Roboto', provider: 'google', display: 'swap', preload: true, subsets: ['latin'] }
    ]
  },
  imports: {
    autoImport: true
  },
  image: {
    dir: 'public',
    formats: ['webp', 'avif', 'svg'],
    sizes: [300, 480, 600, 768, 1024, 1280], // <- importante
    screens: { sm: 320, md: 640, lg: 1024, xl: 1280 },
    domains: ['res.cloudinary.com'],
    providers: {
      ipx: {
        options: {
          dir: 'public'
        }
      },
      cloudinary: {
        provider: 'cloudinary',
        options: {
          baseURL: 'https://res.cloudinary.com/m2a/image/upload/'
        }
      },
      netlify: {
        provider: 'netlify',
        options: {} // No necesitas nada más
      }
    },
    devServer: {
      host: '0.0.0.0',
      port: 3000
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
        // almacenamiento en memoria para cache en tiempo de desarrollo
        cache: {
          driver: 'memory',
          ttl: 60
        }
      }
    },
    vite: {
      plugins: [compression()],
      css: {
        devSourcemap: false // desactiva sourcemaps CSS en desarrollo
      },
      build: {
        sourcemap: false // desactiva sourcemaps completamente
      }
    }
  }
})
