export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Lyrics Finder',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    API_BASEURL: 'https://api.musixmatch.com/ws/1.1/'
  },

  //target: 'static',

  //serverMiddleware: ['~/api/index'],

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // Global Style
    '@/assets/styles/css/style.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // Fontawesome
    '@nuxtjs/fontawesome',
    // Dotenv
    '@nuxtjs/dotenv',
    // GSAP
    'nuxt-gsap-module'
  ],

  // Fontawesome icons
  fontawesome: {
    icons: {
      solid: ['faSearch', 'faPlay', 'faArrowCircleLeft']
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // Proxy
    '@nuxtjs/proxy'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    credentials: false,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  
  router: {
    base: '/lyrics-finder/'
  },

  proxy: {
    '/api/': { 
      target: 'https://api.musixmatch.com/ws/1.1/', 
      pathRewrite: { '^/api/': '' } 
    }
  },

  gsap: {},
}
