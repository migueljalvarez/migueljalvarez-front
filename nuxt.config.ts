// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'pathe'
import compression from 'vite-plugin-compression'
export default defineNuxtConfig({
  app: {
    rootAttrs: {
      lang: 'es'
    },
    head: {
      title: 'Miguel Alvarez | Desarrollo de Software',
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
      ]
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
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/ui', '@nuxt/fonts'],
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
    provider: 'ipx',
    dir: 'public',
    formats: ['webp', 'avif', 'svg'],
    screens: { sm: 320, md: 640, lg: 1024, xl: 1280 },
    ipx: {
      maxAge: 60 * 60 * 24 * 7 // cache IPX por 7 días :contentReference[oaicite:5]{index=5}
    },

    domains: ['res.cloudinary.com']
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  nitro: {
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
  alias: {
    '@components': resolve(__dirname, 'components'),
    '@composables': resolve(__dirname, 'composables'),
    '@utils': resolve(__dirname, 'utils'),
    '@types': resolve(__dirname, 'types'),
    '@assets': resolve(__dirname, 'assets'),
    '@public': resolve(__dirname, 'public')
  },
  vite: {
    plugins: [compression()]
  }
})
