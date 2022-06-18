<template>
  <h1><NuxtLink to="/">Kobo ebook Price Scraper</NuxtLink></h1>
  <a href="" rel="noopener noreferrer">X</a>
  <h1>{{ $route.query.book }}</h1>
  <PieDePagina />
</template>
<script setup>
const route = useRoute();
const data = reactive({ fetched: "" });
const bookCard = reactive([]);
const bookPrices = reactive({ us: 0 });
onMounted(async () => {
  data.fetched = await $fetch(
    `/api/book?search=${route.query.book}&type=${route.query.type}`
  );
  bookCard.length = 0;
  let text = JSON.parse(JSON.stringify(data.fetched.api));
  let parser = new DOMParser();
  let doc = parser.parseFromString(text, "text/html");
  //review
  let docAudiobookList = doc.getElementsByClassName("item-detail");
  let bookCardUrl = docAudiobookList.querySelector(
    ".title.product-field a"
  ).href;
  let audiobookCardName = docAudiobookList.querySelector(
    ".title.product-field a"
  ).innerText;
  let audiobookCardImageUrl =
    docAudiobookList.querySelector(".cover-image").src;
  let audiobookCardDescription = docAudiobookList.querySelector(
    ".synopsis .synopsis-text"
  )
    ? docAudiobookList.querySelector(".synopsis .synopsis-text").innerText
    : "";
  let audiobookCardAuthor = docAudiobookList.querySelector(".contributor-name")
    ? docAudiobookList.querySelector(".contributor-name").innerText
    : "";
  let audiobookCardPriceCurrency = docAudiobookList.querySelector(".currency")
    ? docAudiobookList.querySelector(".currency").innerText
    : "";
  bookCard.push({
    author: audiobookCardAuthor,
    description: audiobookCardDescription,
    imageUrl: audiobookCardImageUrl,
    name: audiobookCardName,
    //   priceValue: audiobookCardPriceValue,
    priceCurrency: audiobookCardPriceCurrency,
    url: audiobookCardUrl,
  });
  bookPrices.us = docAudiobookList.querySelector(
    ".price-value span span span:first-child"
  )
    ? docAudiobookList.querySelector(".price-value span span span:first-child")
        .innerText
    : "Free";
});
</script>
<style></style>
