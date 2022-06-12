<template>
  <div>
    <h1>Kobo ebook Price Scraper</h1>
    <p>
      Insert the Kobo ebook's link or the name of the book you're looking for.
    </p>
    <SearchBar />
    <PieDePagina />
  </div>
</template>

<script setup>
useHead({
  title: "Kobo Price Scraper",
  titleTemplate: "Kobo Price Scraper",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [
    {
      name: "Kobo Price Scraper",
      content:
        "In which country is it cheaper to buy this Kobo Ebook? Well, let's find it out. Insert the name or the Kobo page link of the book you're looking for.",
    },
  ],
  bodyAttrs: {
    class: "test",
  },
});
</script>

<style></style>
