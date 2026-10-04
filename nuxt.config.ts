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
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
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
