<script setup lang="ts">
const route = useRoute()
defineProps({
  counterProp: { type: Number, required: true },
  tableSortedDataProp: { type: Array<Array<string | number>>, required: true },
})
</script>

<template>
  <div class="mx-3 mt-2 mb-4">
    <table class="text-center">
      <thead>
        <tr class="">
          <th colspan="3">Prices comparison</th>
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
              <br />
              <span class="text-xs">{{
                sortedDataProp[5] === 'NaN' ? '' : sortedDataProp[2]
              }}</span>
              <!-- Si PriceUSD es NaN, no se pone currency -->
            </td>
            <!--price -->
            <td>
              <NuxtLink
                class="text-red-600"
                target="_blank"
                :to="`https://www.kobo.com/${sortedDataProp[0]}/en/${route.query.type}/${route.query.book}`"
              >
                {{
                  sortedDataProp[5] === 0
                    ? 'N/A'
                    : sortedDataProp[5] === 'NaN'
                    ? 'Free'
                    : sortedDataProp[5]
                }}
              </NuxtLink>
            </td>
            <!--Price in USD. Si es 0 pintar N/A (Significa que no hay exRate available) -->
            <!-- Si es NaN implica que la multiplicación no tenía números por lo que es Free ya que si no existiera libro fuera undefined el precio -->
          </tr>
        </template>
      </tbody>
      <tfoot v-if="counterProp < 40">
        <!-- Se oculta el tfoot al terminar de llenar la tabla -->
        <tr>
          <td colspan="3">
            Wait for completion:
            {{ ((counterProp / 40) * 100).toFixed(2) }}&nbsp;%&nbsp;
            <progress :value="((counterProp / 40) * 100).toFixed(2)" max="100">
              {{ ((counterProp / 40) * 100).toFixed(2) }}&nbsp;%
            </progress>
          </td>
        </tr>
      </tfoot>
    </table>
    <div>Tip: Click the USD price to go to the Kobo page.</div>
  </div>
</template>

<style></style>
