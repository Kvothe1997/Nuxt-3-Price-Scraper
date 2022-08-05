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
    <SearchBar />
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
    <PieDePagina />
  </div>
</template>
<script setup lang="ts">
const bookCards = reactive([])
const route = useRoute()
const data = reactive({ fetched: '' })
onMounted(async () => {
  data.fetched = await $fetch(`/api/books?search=${route.query.books}`)
  updateBookCards()
})
watch(
  () => route.query,
  async () => {
    if (route.name === 'search') {
      data.fetched = await $fetch(`/api/books?search=${route.query.books}`)
      await updateBookCards() // maybe sacar el await para que cargue el logo de la página? y ponerle v if a las bookcards
    }
  }
)
function updateBookCards() {
  bookCards.length = 0
  const text = JSON.parse(JSON.stringify(data.fetched.api))
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')
  const docBooksList = doc.getElementsByClassName('item-detail')
  for (const docBook of docBooksList) {
    const bookCardUrl = docBook.querySelector('.title.product-field a').href
    const bookCardName = docBook.querySelector(
      '.title.product-field a'
    ).innerText
    const bookCardImageUrl =
      docBook.querySelector('.cover-image').getAttribute('data-lazy') ||
      docBook.querySelector('.cover-image').src
    const bookCardType = docBook.querySelector(
      'product-type-field secondary-field'
    )
      ? docBook.querySelector('product-type-field secondary-field').innerText
      : ''
    const bookCardDescription = docBook.querySelector(
      '.synopsis .synopsis-text'
    )
      ? docBook.querySelector('.synopsis .synopsis-text').innerText
      : ''
    const bookCardAuthor = docBook.querySelector('.contributor-name')
      ? docBook.querySelector('.contributor-name').innerText
      : ''
    const bookCardPriceValue = docBook.querySelector(
      '.price-value span span span:first-child'
    )
      ? docBook.querySelector('.price-value span span span:first-child')
          .innerText
      : 'Free'
    const bookCardPriceCurrency = docBook.querySelector('.currency')
      ? docBook.querySelector('.currency').innerText
      : ''
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
</script>
<style></style>
