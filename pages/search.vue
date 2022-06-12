<template>
  <div>
    <h1 @click="navigateHome">Kobo ebook Price Scraper</h1>
    <SearchBar />
    <BookCard
      v-for="bookCard in bookCards"
      :key="bookCard.id"
      :author-prop="bookCard.author"
      :description-prop="bookCard.description"
      :image-url-prop="bookCard.imageUrl"
      :name-prop="bookCard.name"
      :price-value-prop="bookCard.priceValue"
      :price-currency-prop="bookCard.priceCurrency"
      :url-prop="bookCard.url"
    ></BookCard>
    <PieDePagina />
  </div>
</template>
<script setup>
const bookCards = reactive([]);
const route = useRoute();
const data = reactive({ fetched: "" });
onMounted(async () => {
  data.fetched = await $fetch(`/api/books?search=${route.query.books}`);
  updateBookCards();
});
watch(
  () => route.query,
  async () => {
    if (route.name === "search") {
      data.fetched = await $fetch(`/api/books?search=${route.query.books}`);
      await updateBookCards();
    }
  }
);
async function updateBookCards() {
  bookCards.length = 0;
  let text = JSON.parse(JSON.stringify(data.fetched.api));
  let parser = new DOMParser();
  let doc = parser.parseFromString(text, "text/html");
  let docBooksList = doc.getElementsByClassName("item-detail");
  for (const docBook of docBooksList) {
    let bookCardUrl = docBook.querySelector(".title.product-field a").href;
    let bookCardName = docBook.querySelector(
      ".title.product-field a"
    ).innerText;
    let bookCardImageUrl = docBook.querySelector(".cover-image").src;
    let bookCardDescription = docBook.querySelector(".synopsis .synopsis-text")
      ? docBook.querySelector(".synopsis .synopsis-text").innerText
      : "";
    let bookCardAuthor = docBook.querySelector(".contributor-name")
      ? docBook.querySelector(".contributor-name").innerText
      : "";
    let bookCardPriceValue = docBook.querySelector(
      ".price-value span span span:first-child"
    )
      ? docBook.querySelector(".price-value span span span:first-child")
          .innerText
      : "Free";
    let bookCardPriceCurrency = docBook.querySelector(".currency")
      ? docBook.querySelector(".currency").innerText
      : "";
    bookCards.push({
      author: bookCardAuthor,
      description: bookCardDescription,
      imageUrl: bookCardImageUrl,
      name: bookCardName,
      priceValue: bookCardPriceValue,
      priceCurrency: bookCardPriceCurrency,
      url: bookCardUrl,
    });
  }
}
function navigateHome() {
  return navigateTo({
    path: "/",
  });
}
</script>
<style></style>
