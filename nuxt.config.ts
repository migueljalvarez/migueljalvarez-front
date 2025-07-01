// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'pathe'
export default defineNuxtConfig({
  app: {
    rootAttrs: {
      lang: 'es'
    },
    head: {
      title: 'Miguel Alvarez | Ingeniero de Software',
      titleTemplate: '%s | Ingeniero de Software',
      meta: [
        {
          name: 'description',
          content:
            'Desarrollador de Software con enfoque en crear soluciones digitales escalables y de alto impacto. Transformo ideas en productos funcionales, combinando eficiencia técnica con una visión orientada a resultados.'
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }]
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
    '@nuxt/ui',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      Roboto: [400, 700]
    },
    display: 'swap',
    download: true,
    inject: true,
    subsets: ['latin'],
    preconnect: true,
    prefetch: true
  },
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
