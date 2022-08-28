<!-- eslint-disable vue/no-v-html -->
<template>
  <article v-if="bookCardProp[0]" class="flex flex-col mx-3 my-2">
    <h2 class="text-center">{{ bookCardProp[0].name }}</h2>
    <img
      class="self-center mx-1 my-1 w-3/5"
      :src="bookCardProp[0].imageUrl"
      :alt="bookCardProp[0].name + ' by ' + bookCardProp[0].author"
    />
    <div class="flex flex-row items-center self-center">
      <p>by&nbsp;{{ bookCardProp[0].type }}</p>
      <p>{{ bookCardProp[0].author }}</p>
    </div>
    <p>Synopsis</p>
    <p class="text-justify" v-html="bookCardProp[0].description"></p>
  </article>
</template>
<script setup lang="ts">
defineProps({
  bookCardProp: { type: Object, required: true },
})
</script>
<style></style>
