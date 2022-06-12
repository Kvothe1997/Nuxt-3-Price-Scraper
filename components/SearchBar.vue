<template>
  <input
    v-model="valoringresado"
    v-on:keydown.enter="lookFor"
    type="text"
    autocomplete="on"
    placeholder="Book name or Kobo ebook's link"
  />
  <input @click="lookFor" type="submit" value="Search" />
</template>

<script setup>
const route = useRoute();
const valoringresado = ref(route.query.books || "");
watch(
  () => route.query,
  async () => {
    if (Object.keys(route.query)[0] == "books") {
      valoringresado.value = route.query.books;
    }
  }
);
function lookForBook() {
  let book = valoringresado.value.split(/https:\/\/www.kobo.com\/.*\/ebook\//);
  return navigateTo({
    path: "/prices",
    query: { book: book[1] },
  });
}
function lookForBooks() {
  return navigateTo({
    path: "/search",
    query: { books: valoringresado.value },
  });
}
function lookFor() {
  if (
    /^https:\/\/www.kobo.com\/([a-z]{2,})\/([a-z]{2,})\/ebook\/.*/.test(
      valoringresado.value
    )
  )
    lookForBook();
  else lookForBooks();
}
</script>

<style></style>
