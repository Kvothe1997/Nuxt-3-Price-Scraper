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
<script setup lang="ts">
const props = defineProps({
  authorProp: { type: String, required: true },
  descriptionProp: { type: String, required: true },
  imageUrlProp: { type: String, required: true },
  nameProp: { type: String, required: true },
  priceValueProp: { type: String, required: true },
  priceCurrencyProp: { type: String, required: true },
  urlProp: { type: String, required: true },
})
function navigateToBook() {
  const book = props.urlProp.split(
    /https:\/\/www.kobo.com\/.*\/(ebook|audiobook)\//
  )

  if (
    /^https:\/\/www.kobo.com\/([a-z]{2,})\/([a-z]{2,})\/ebook\/.*/.test(
      props.urlProp
    )
  ) {
    return navigateTo({
      path: '/prices',
      query: { book: book[2], type: 'ebook' },
    })
  } else if (
    /^https:\/\/www.kobo.com\/([a-z]{2,})\/([a-z]{2,})\/audiobook\/.*/.test(
      props.urlProp
    )
  ) {
    return navigateTo({
      path: '/prices',
      query: { book: book[2], type: 'audiobook' },
    })
  }
}
</script>
