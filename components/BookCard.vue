<template>
  <article @click="navigateToBook">
    <img :src="imageUrlProp" :alt="nameProp + ' by ' + authorProp" />
    <h2>{{ nameProp }}</h2>
    <p>{{ authorProp }}</p>
    <p>{{ descriptionProp }} ...</p>
    <p>{{ priceValueProp }}</p>
    <p>{{ priceCurrencyProp }}</p>
  </article>
</template>
<script setup>
const props = defineProps({
  authorProp: String,
  descriptionProp: String,
  imageUrlProp: String,
  nameProp: String,
  priceValueProp: String,
  priceCurrencyProp: String,
  urlProp: String,
});
function navigateToBook() {
  let book = props.urlProp.split(/https:\/\/www.kobo.com\/.*\/ebook\//);
  return navigateTo({
    path: "/prices",
    query: { book: book[1] },
  });
}
</script>
