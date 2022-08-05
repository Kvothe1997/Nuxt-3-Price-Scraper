<script setup lang="ts">
const route = useRoute()
const counter = ref(0)
interface BookCard {
  author?: string
  description?: string
  imageUrl?: string
  name?: string
  type?: string
  url?: string
}
const bookCard: BookCard[] = reactive([])
const tableData = reactive([
  ['us', 'United States', 'US Dollar', 1], // [country abbr., country name, name of money, exRate (pushed first), price in country currency (pushed later), price in USD (pushed last)]
  ['ca', 'Canada', 'Canadian Dollar'],
  ['in', 'India', 'Indian Rupee'],
  ['za', 'South Africa', 'South African Rand'],
  ['au', 'Australia', 'Australian Dollar'],
  ['hk', 'Hong Kong', 'Hong Kong Dollar'],
  ['jp', 'Japan', 'Japanese Yen'],
  ['my', 'Malaysia', 'US Dollar'],
  ['nz', 'New Zealand', 'New Zealand Dollar'],
  ['ph', 'Philippines', 'Philippine Peso'],
  ['sg', 'Singapore', 'US Dollar', 1],
  ['tw', 'Taiwan', 'Taiwan New Dollar'],
  ['th', 'Thailand', 'US Dollar', 1],
  ['at', 'Austria', 'Euro'],
  ['be', 'Belgium', 'Euro'],
  ['cy', 'Cyprus', 'Euro'],
  ['dk', 'Denmark', 'Danish Krone'],
  ['ee', 'Estonia', 'Euro'],
  ['fi', 'Finland', 'Euro'],
  ['fr', 'France', 'Euro'],
  ['de', 'Germany', 'Euro'],
  ['gr', 'Greece', 'Euro'],
  ['ie', 'Ireland', 'Euro'],
  ['it', 'Italy', 'Euro'],
  ['lt', 'Lithuania', 'Euro'],
  ['lu', 'Luxembourg', 'Euro'],
  ['mt', 'Malta', 'Euro'],
  ['nl', 'Netherlands', 'Euro'],
  ['no', 'Norway', 'Norwegian Krone'],
  ['pt', 'Portugal', 'Euro'],
  ['sk', 'Slovak Republic', 'Euro'],
  ['si', 'Slovenia', 'Euro'],
  ['es', 'Spain', 'Euro'],
  ['se', 'Sweden', 'Swedish Krona'],
  ['ch', 'Switzerland', 'Swiss Franc'],
  ['tr', 'Turkey', 'Turkish Lira'],
  ['gb', 'United Kingdom', 'British Pound'],
  ['br', 'Brazil', 'Brazilian Real'],
  ['mx', 'Mexico', 'Mexican Peso'],
  ['ww', 'Other', 'US Dollar', 1],
])
const tableSortedData: (string | number)[][] = reactive([])
onMounted(async () => {
  // Get exchange rate
  // Se compara el nombre de la moneda con la tabla de tipos de cambio fetcheada.
  // Se itera hasta encontrar coincidencia y se obtiene su exchange rate en base a eso.
  // Se utiliza un for dentro de otro for  para buscar el match.
  // Dentro del for más interno se pushea la exchange rate a la tableData.
  let data = await $fetch(`/api/exrate`)
  let text = JSON.parse(JSON.stringify(data.api))
  let parser = new DOMParser()
  let doc: Document = parser.parseFromString(text, 'text/html')
  for (let i = 0; i < tableData.length; i++) {
    // eslint-disable-next-line no-labels
    inLoop: {
      for (
        let j = 1;
        j <
        doc?.querySelector(`.tablesorter.ratesTable tbody`)?.rows.length + 1;
        j++
      ) {
        // VErificar que se itere desde la primera hasta la última fila. ver console.log
        if (
          tableData[i][2] ===
          (
            doc.querySelector(
              `.tablesorter.ratesTable tbody tr:nth-of-type(${j}) td:nth-of-type(1)`
            ) as HTMLElement | null
          )?.innerText
        ) {
          tableData[i].push(
            (
              doc.querySelector(
                `.tablesorter.ratesTable tbody tr:nth-of-type(${j}) td:nth-of-type(3)`
              ) as HTMLElement | null
            )?.innerText
          )
          // eslint-disable-next-line no-labels
          break inLoop
        } else if (tableData[i][2] === 'US Dollar') {
          // eslint-disable-next-line no-labels
          break inLoop
        }
      }
    }
  }

  // Get bookCard values
  data = await $fetch(
    `/api/book?search=${route.query.book}&type=${route.query.type}&country=us`
  )
  bookCard.length = 0
  text = JSON.parse(JSON.stringify(data.api))
  parser = new DOMParser()
  doc = parser.parseFromString(text, 'text/html')
  const bookCardUrl = `https://www.kobo.com/us/en/${route.query.type}/${route.query.book}`
  const bookCardName = (
    doc.querySelector('.title.product-field') as HTMLElement | null
  )?.innerText
  const bookCardImageUrl = (
    doc?.querySelector('.cover-image') as HTMLImageElement | null
  )?.src
  const bookCardType = route.query.type === 'Audiobook' ? 'Audiobook' : ''
  const bookCardDescription = doc.querySelector('.synopsis-description')
    ? (doc.querySelector('.synopsis-description') as HTMLElement | null)
        ?.innerText
    : ''
  const bookCardAuthor = doc.querySelector('.contributor-name')
    ? (doc.querySelector('.contributor-name') as HTMLElement | null)?.innerText
    : ''
  bookCard.push({
    author: bookCardAuthor,
    description: bookCardDescription,
    imageUrl: bookCardImageUrl,
    name: bookCardName,
    type: bookCardType,
    url: bookCardUrl,
  })

  // Get book prices from every country
  tableData[0].push(
    doc.querySelector('.active-price .price')
      ? (
          doc.querySelector('.active-price .price') as HTMLElement | null
        )?.innerText
          .match('([0-9]+)([\\.,][0-9]+)?')[0]
          .replace(/,/g, '.') // Precio
      : doc.querySelector('.pricing-title')
      ? doc.querySelector('.pricing-title')?.innerText // Si el libro es free
      : '' // No hay libro en ese país
  )
  tableData[0].push(
    (tableData[0][4] * tableData[0][3]).toFixed(2) // Price in USD Price*exChangeRate (two decimals)
  )
  tableSortedData.push(tableData[0]) // Add first value to tableSortedData
  // Función para selecciona posición a insertar nuevo array en tableSortedData.
  // Es una búsqueda lineal.
  function busquedaLineal(
    myArray: (string | number)[][],
    newItem: (string | number)[]
  ) {
    if (myArray[0][5] > newItem[5]) {
      return 0
    }
    let i = 1
    while (
      i < myArray.length &&
      !(myArray[i][5] > newItem[5] && myArray[i - 1][5] <= newItem[5])
    ) {
      i = i + 1
    }
    return i
  }
  // Iterar para obtener precios del libro en cada país
  for (let i = 1; i < tableData.length; i++) {
    counter.value = i // Servirá para saber el número de países que faltan.
    data = await $fetch(
      `/api/book?search=${route.query.book}&type=${route.query.type}&country=${tableData[i][0]}`
    )
    const text = JSON.parse(JSON.stringify(data.api))
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')
    tableData[i].push(
      doc.querySelector('.active-price .price')
        ? doc
            .querySelector('.active-price .price')
            ?.innerText.match('([0-9]+)([\\.,][0-9]+)?')[0]
            .replace(/,/g, '.') // Precio
        : doc.querySelector('.pricing-title')
        ? (doc.querySelector('.pricing-title') as HTMLElement | null)?.innerText // Si el libro es free
        : '' // No hay libro en ese país
    )
    tableData[i].push(
      (tableData[i][4] * tableData[i][3]).toFixed(2) // Price in USD Price*exChangeRate (two decimals)
    )
    // Se usará la función search() para buscar posición para agregar tableData[i] al array de tableSortedData
    // Los valores de posición de cada array a agregar se calculará en base a una búsqueda lineal https://stackoverflow.com/questions/42946561/how-can-i-push-an-element-into-array-at-a-sorted-index-position
    // Agregar tableData[i] al array de tableSortedData
    // Se agregará cada array de país completo en cada iteración porque se pintará el DOM con el array tableSortedData).
    // Se va allenar con Splice() uno por uno en cada iteración de conseguir precios.
    tableSortedData.splice(
      busquedaLineal(tableSortedData, tableData[i]),
      0,
      tableData[i]
    )
  }
})
</script>

<template>
  <div class="font-mono">
    <h1>
      <NuxtLink class="text-red-600 no-underline text-xl" to="/"
        >Kobo Price Scraper</NuxtLink
      >
    </h1>
    <a href="" rel="noopener noreferrer">X</a>
    <!--Falta hacer que regrese a Home o a previus page si la anterior fue dentro de la página-->
    <PricesBookCard :book-card-prop="bookCard"></PricesBookCard>
    <PricesTable
      :counter-prop="counter"
      :table-sorted-data-prop="tableSortedData"
    ></PricesTable>
    <PieDePagina />
  </div>
</template>

<style></style>
