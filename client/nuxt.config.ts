import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/style.css'],
  app: {
    head: {
      link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap' }],
      meta: [
        { property: 'og:image', content: 'https://bmov.co/img/bmov-cover-default.jpg' },
        { property: 'twitter:image', content: 'https://bmov.co/img/bmov-cover-default.jpg' },
      ]
    },
  },
  nitro: {
    routeRules: {
      '/api/**': { proxy: 'http://localhost:3000/api/**' },
    },
  },
  devServer: {
    port: 5173
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        '@tabler/icons-vue',
        '@unhead/schema-org/vue',
      ]
    }
  },
  modules: [
    '@nuxtjs/seo',
    '@nuxtjs/sitemap',
  ],
  site: {
    url: 'https://bmov.co',
    name: 'BMOV',
    description: 'Welcome to BMOV website. We are a software development team that shapes the future with cutting-edge technology.',
    defaultLocale: 'en', // not needed if you have @nuxtjs/i18n or nuxt-i18n-micro installed
  },
  sitemap: {
    sources: [
      // Unauthenticated endpoint
      'http://localhost:3000/api/posts/sitemap',
    ]
  },
  routeRules: {
    // Don't add any /secret/** URLs to the sitemap.xml
    '/manage/**': { robots: false },
  }
})
