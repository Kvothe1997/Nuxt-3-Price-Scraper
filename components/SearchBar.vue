<template>
  <div class="flex flex-row items-stretch justify-center mb-1">
    <input
      v-model="valoringresado"
      type="text"
      autocomplete="on"
      placeholder="Book link, title, author..."
      class="text-lg"
      @keydown.enter="lookFor"
    />
    <input
      class="i-fluent-book-search-24-regular text-3xl text-black"
      type="submit"
      title="Search"
      @click="lookFor"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const valoringresado = ref<any>(route.query.books || '')
watch(
  () => route.query,
  () => {
    if (Object.keys(route.query)[0] === 'books') {
      valoringresado.value = route.query.books
    }
  }
)
function lookForBook() {
  const book = valoringresado.value.split(
    /https:\/\/www.kobo.com\/.*\/(ebook|audiobook)\//
  )

  if (
    /^https:\/\/www.kobo.com\/([a-z]{2,})\/([a-z]{2,})\/ebook\/.*/.test(
      valoringresado.value
    )
  ) {
    return navigateTo({
      path: '/prices',
      query: { book: book[2], type: 'ebook' },
    })
  } else if (
    /^https:\/\/www.kobo.com\/([a-z]{2,})\/([a-z]{2,})\/audiobook\/.*/.test(
      valoringresado.value
    )
  ) {
    return navigateTo({
      path: '/prices',
      query: { book: book[2], type: 'audiobook' },
    })
  }
}
function lookForBooks() {
  return navigateTo({
    path: '/search',
    query: { books: valoringresado.value },
  })
}
function lookFor() {
  if (
    /^https:\/\/www.kobo.com\/([a-z]{2,})\/([a-z]{2,})\/(ebook|audiobook)\/.*/.test(
      valoringresado.value
    )
  )
    lookForBook()
  else lookForBooks()
}
</script>

<style></style>
