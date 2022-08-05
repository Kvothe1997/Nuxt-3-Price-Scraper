<template>
  <article v-if="bookCardProp[0]">
    <img
      :src="bookCardProp[0].imageUrl"
      :alt="bookCardProp[0].name + ' by ' + bookCardProp[0].author"
    />
    <p>{{ bookCardProp[0].type }}</p>
    <h2>{{ bookCardProp[0].name }}</h2>
    <p>{{ bookCardProp[0].author }}</p>
    <p>{{ bookCardProp[0].description }}</p>
  </article>
</template>
<script setup lang="ts">
defineProps({
  bookCardProp: { type: Object, required: true },
})
</script>
<style></style>
