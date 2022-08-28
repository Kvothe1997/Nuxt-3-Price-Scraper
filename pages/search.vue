<script setup lang="ts">
// SEO
useHead({
  script: [
    {
      async: 'true',
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3787111415027881',
      crossorigin: 'anonymous',
    },
  ],
  title: "Kobo Price Scraper: Ebook's prices comparison",
  titleTemplate: 'Kobo Price Scraper',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [
    {
      name: 'description',
      content:
        "In which country is it cheaper to buy this Kobo Ebook? Well, let's find it out. Insert the name or the Kobo page link of the book you're looking for.",
    },
  ],
  bodyAttrs: {
    class: 'test',
  },
})
interface BookCards {
  author: string
  description: string
  imageUrl: string
  name: string
  priceValue: string
  priceCurrency: string
  type: string
  url: string
}
interface Data {
  api: string
}
const bookCards: Array<BookCards> = reactive([])
const route = useRoute()
onMounted(async () => {
  const data: Data = await $fetch(`/api/books?search=${route.query.books}`)
  updateBookCards(data.api)
})
watch(
  () => route.query,
  async () => {
    if (route.name === 'search') {
      const data: Data = await $fetch(`/api/books?search=${route.query.books}`)
      await updateBookCards(data.api) // maybe sacar el await para que cargue el logo de la página? y ponerle v if a las bookcards
    }
  }
)
function updateBookCards(pageFetchedText: string) {
  if (pageFetchedText !== '') {
    bookCards.length = 0
    const parser = new DOMParser()
    const doc = parser.parseFromString(pageFetchedText, 'text/html')
    const docBooksList = doc.getElementsByClassName('item-detail')
    for (const docBook of docBooksList) {
      const bookCardUrl = (docBook.querySelector(
        '.title.product-field a'
      ) as HTMLAnchorElement | null)
        ? (
            docBook.querySelector(
              '.title.product-field a'
            ) as HTMLAnchorElement | null
          )?.href
        : ''
      const bookCardName = (docBook.querySelector(
        '.title.product-field a'
      ) as HTMLElement | null)
        ? (
            docBook.querySelector(
              '.title.product-field a'
            ) as HTMLElement | null
          )?.innerText
        : ''
      const bookCardImageUrl =
        docBook.querySelector('.cover-image')?.getAttribute('data-lazy') ||
        (docBook.querySelector('.cover-image') as HTMLImageElement | null)?.src
      const bookCardType = docBook.querySelector(
        'product-type-field secondary-field'
      )
        ? (
            docBook.querySelector(
              'product-type-field secondary-field'
            ) as HTMLElement | null
          )?.innerText
        : ''
      const bookCardDescription = docBook.querySelector(
        '.synopsis .synopsis-text'
      )
        ? (
            docBook.querySelector(
              '.synopsis .synopsis-text'
            ) as HTMLElement | null
          )?.innerText
        : ''
      const bookCardAuthor = docBook.querySelector('.contributor-name')
        ? (docBook.querySelector('.contributor-name') as HTMLElement | null)
            ?.innerText
        : ''
      const bookCardPriceValue = docBook.querySelector(
        '.price-value span span span:first-child'
      )
        ? (
            docBook.querySelector(
              '.price-value span span span:first-child'
            ) as HTMLElement | null
          )?.innerText
        : 'Free'
      const bookCardPriceCurrency = docBook.querySelector('.currency')
        ? (docBook.querySelector('.currency') as HTMLElement | null)?.innerText
        : ''
      if (
        bookCardAuthor !== undefined &&
        bookCardDescription !== undefined &&
        bookCardImageUrl !== undefined &&
        bookCardName !== undefined &&
        bookCardPriceValue !== undefined &&
        bookCardPriceCurrency !== undefined &&
        bookCardType !== undefined &&
        bookCardUrl !== undefined
      ) {
        bookCards.push({
          author: bookCardAuthor,
          description: bookCardDescription,
          imageUrl: bookCardImageUrl,
          name: bookCardName,
          priceValue: bookCardPriceValue,
          priceCurrency: bookCardPriceCurrency,
          type: bookCardType,
          url: bookCardUrl,
        })
      }
    }
  } else {
    // Qué hacer si no se puede conectar con Kobo y traer las cards
    // Presentar un mensaje o imagen para que refresque la pagina.
    // O un botón para que presione y se refresque la página.
    // Todo en el espacio donde irían las cards
    console.log(
      'We´re having problems to connet to the server. Please refresh the page.'
    )
  }
}
</script>
<template>
  <div class="flex flex-col h-screen font-mono">
    <h1 class="flex justify-center">
      <NuxtLink class="text-red-600 no-underline" to="/"
        >Kobo Price Scraper</NuxtLink
      >
    </h1>
    <p class="text-center">
      Select the book you want to know the prices of in every available country.
    </p>
    <SearchBar class="mb-1" />
    <SearchBookCard
      v-for="bookCard in bookCards"
      :key="bookCard.name"
      :author-prop="bookCard.author"
      :description-prop="bookCard.description"
      :image-url-prop="bookCard.imageUrl"
      :name-prop="bookCard.name"
      :price-value-prop="bookCard.priceValue"
      :price-currency-prop="bookCard.priceCurrency"
      :type-prop="bookCard.type"
      :url-prop="bookCard.url"
    ></SearchBookCard>
    <p class="self-center">* More pages functionality coming soon...</p>
    <PieDePagina />
  </div>
</template>
<style></style>
