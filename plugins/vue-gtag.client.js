import VueGtag from 'vue-gtag-next'
// Permite usar Google Analitics utilizando el ID de otorgado.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: 'G-5D313T2Y3T',
    },
  })
})
