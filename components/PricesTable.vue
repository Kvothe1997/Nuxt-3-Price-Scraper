<script setup lang="ts">
defineProps({
  counterProp: { type: Number, required: true },
  tableSortedDataProp: { type: Array<Array<string | number>>, required: true },
})
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Comparison</th>
      </tr>
      <tr>
        <th>Country</th>
        <th>Price</th>
        <th>Price (USD)</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="sortedDataProp in tableSortedDataProp">
        <tr v-if="sortedDataProp[4]" :key="sortedDataProp[0]">
          <!--if price not empty-->
          <td>{{ sortedDataProp[1] }}</td>
          <!--country -->
          <td>
            <span>{{ sortedDataProp[4] }}</span>
            &nbsp;
            <span>{{ sortedDataProp[2] }}</span>
          </td>
          <!--price -->
          <td>
            {{ sortedDataProp[5] }}
          </td>
          <!--Price in USD-->
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr>
        {{
          counterProp
        }}
        &nbsp;out of 40
      </tr>
    </tfoot>
  </table>
</template>

<style></style>
