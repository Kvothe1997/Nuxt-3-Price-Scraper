<template>
  <div>
    <h1><NuxtLink to="/">Kobo ebook Price Scraper</NuxtLink></h1>
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

<template>
  <div
    class="flex flex-col h-screen font-mono bg-gradient-to-t from-red-600 via-red-50 to-white"
  >
    <div class="h-full flex flex-col justify-center">
      <h1 class="text-center">
        <NuxtLink class="text-red-600 no-underline text-4xl" to="/"
          >Kobo Price Scraper</NuxtLink
        >
      </h1>
      <p class="text-center text-3xl">
        This app let's you know the prices of a Kobo ebook in every available
        country.
      </p>
      <p class="text-center text-lg">
        Insert the Kobo ebook's link or the title of the book you're looking
        for.
      </p>
      <SearchBar />
    </div>
    <PieDePagina />
  </div>
</template>
<style></style>
