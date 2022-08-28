<script setup lang="ts">
const props = defineProps({
  authorProp: { type: String, required: true },
  descriptionProp: { type: String, required: true },
  imageUrlProp: { type: String, required: true },
  nameProp: { type: String, required: true },
  priceValueProp: { type: String, required: true },
  priceCurrencyProp: { type: String, required: true },
  typeProp: { type: String, required: true },
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
<template>
  <article
    class="flex flex-row mx-1 my-2 border-2 border-blue"
    @click="navigateToBook"
  >
    <div class="mx-1 my-1 flex justify-center">
      <img :src="imageUrlProp" :alt="nameProp + ' by ' + authorProp" />
      <p>{{ typeProp }}</p>
    </div>
    <div class="mx-1">
      <h2>{{ nameProp }}</h2>
      <p>by {{ authorProp }}</p>
      <p class="hidden sm:inline">{{ descriptionProp }} ...</p>
      <div class="flex flex-row">
        <p>{{ priceValueProp }}</p>
        <p class="">&nbsp;{{ priceCurrencyProp }}</p>
      </div>
    </div>
  </article>
</template>
