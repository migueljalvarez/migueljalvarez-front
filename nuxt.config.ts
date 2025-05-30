// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'pathe'
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Miguel Alvarez',
      titleTemplate: '%s - Ingeniero de Software',
      meta: [
        { name: 'description', content: 'My Nuxt 3 application' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
        }
      ]
    }
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui'
  ],
  imports: {
    autoImport: true
  },
  image: {
    dir: 'public',
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  alias: {
    '@components': resolve(__dirname, 'components'),
    '@composables': resolve(__dirname, 'composables'),
    '@utils': resolve(__dirname, 'utils'),
    '@types': resolve(__dirname, 'types'),
    '@assets': resolve(__dirname, 'assets'),
    '@public': resolve(__dirname, 'public')
  }
})
