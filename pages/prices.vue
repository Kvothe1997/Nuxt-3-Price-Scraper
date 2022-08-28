<script setup lang="ts">
// SEO
useHead({
  title: "Kobo Price Scraper: Ebook's prices comparison",
  titleTemplate: 'Kobo Price Scraper',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [
    {
      name: 'description',
      content:
        "In which country is it cheaper to buy this Kobo Ebook? Well, let's find it out. Insert the name or the Kobo page link of the book you're looking for.",
    },
  ],
  bodyAttrs: {
    class: 'test',
  },
})
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
interface Data {
  api: string
}
const bookCard: Array<BookCard> = reactive([])

const tableData: [string, string, string, string?, string?, number?][] =
  reactive([
    ['us', 'United States', 'US Dollar'], // [country abbr., country name, name of money, exRate (pushed first), price in country currency (pushed later), price in USD (pushed last)]
    ['ca', 'Canada', 'Canadian Dollar'],
    ['in', 'India', 'Indian Rupee'],
    ['za', 'South Africa', 'South African Rand'],
    ['au', 'Australia', 'Australian Dollar'],
    ['hk', 'Hong Kong', 'Hong Kong Dollar'],
    ['jp', 'Japan', 'Japanese Yen'],
    ['my', 'Malaysia', 'US Dollar'],
    ['nz', 'New Zealand', 'New Zealand Dollar'],
    ['ph', 'Philippines', 'Philippine Peso'],
    ['sg', 'Singapore', 'US Dollar'],
    ['tw', 'Taiwan', 'Taiwan New Dollar'],
    ['th', 'Thailand', 'US Dollar'],
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
    ['ww', 'Other', 'US Dollar'],
  ])
const tableSortedData: [string, string, string, string, string, number][] =
  reactive([])
onMounted(() => fillPage())
async function fillPage() {
  // Get exchange rate
  // Se compara el nombre de la moneda con la tabla de tipos de cambio fetcheada.
  // Se itera hasta encontrar coincidencia y se obtiene su exchange rate en base a eso.
  // Se utiliza un for dentro de otro for  para buscar el match.
  // Dentro del for más interno se pushea la exchange rate a la tableData.
  let data: Data = await $fetch(`/api/exrate`)
  // Si viene "", el valor de cada exRate será "" o 1.
  // Se atrapa esa sitaución al pushear tableSortedData
  let parser = new DOMParser()
  let doc: Document = parser.parseFromString(data.api, 'text/html')
  for (let i = 0; i < tableData.length; i++) {
    if (tableData[i][2] === 'US Dollar') {
      tableData[i].push('1')
      continue
    }
    // eslint-disable-next-line no-labels
    inLoop: {
      for (
        let j = 1;
        j <=
        (
          doc?.querySelector(
            `.tablesorter.ratesTable tbody`
          ) as HTMLTableElement
        )?.rows.length;
        j++
      ) {
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
        }
      }
      // Pushea "" si no hay exRate para ese País. Al hacer Number("") saldrá 0.
      tableData[i].push('')
    }
  }
  // Get bookCard values
  data = await $fetch(
    `/api/book?search=${route.query.book}&type=${route.query.type}&country=us`
  )
  bookCard.length = 0
  // Falta agregar qué hacer si data viene ""
  // Si viene vacío o no hay ese libro en US o
  // Se ha ingresado un libro errado. Detener todo y lanzar una imagen de error indicando:
  // Revisa que el libro que has puesto exista en Kobo US
  parser = new DOMParser()
  doc = parser.parseFromString(data.api, 'text/html')
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
        ?.innerHTML
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
  // primero conseguimos precio de libro en USD porque
  // Ya se tiene la data fetcheada de ese pais (US).
  const pricesSelectedExists = (
    doc.querySelector('.active-price .price') as HTMLElement | null
  )?.innerText.match('([0-9]+)([\\.,][0-9]+)?')
  tableData[0].push(
    pricesSelectedExists // Evalúa si el valor es false (Null) o true (Existe valor)
      ? pricesSelectedExists[0]?.replace(/,/g, '.') // Precio
      : doc.querySelector('.pricing-title')
      ? (doc.querySelector('.pricing-title') as HTMLElement | null)?.innerText // Si el libro es free
      : undefined // No hay libro en ese país
  )
  const exRate = tableData[0][3]
  const PriceOfBook = tableData[0][4]
  // Falta agregar condición, qué hacer si el libro es free. NO se
  // debe multiplicar. igualar Price USD a PriceofBook ambos dirán FREE
  // Si exRate es "" Number(PriceOfBook) es 0 y por tanto, PriceUSDofBook es 0.
  tableData[0].push(
    exRate !== undefined && PriceOfBook !== undefined
      ? (Number(exRate) * Number(PriceOfBook)).toFixed(2) // Price in USD Price*exChangeRate (two decimals)
      : undefined
  )
  const priceUSDOfBook = tableData[0][5]
  if (
    exRate !== undefined &&
    PriceOfBook !== undefined &&
    priceUSDOfBook !== undefined
  ) {
    // Add first value to tableSortedData que son valores de US
    tableSortedData.push([
      tableData[0][0],
      tableData[0][1],
      tableData[0][2],
      exRate,
      PriceOfBook,
      priceUSDOfBook,
    ])
  }
  // Función para selecciona posición a insertar nuevo array en tableSortedData.
  // Es una búsqueda lineal.
  function busquedaLineal(
    myArray: [string, string, string, string, string, number][],
    newItem: number
  ) {
    if (myArray[0][5] !== undefined && newItem !== undefined) {
      if (Number(myArray[0][5]) > Number(newItem)) {
        return 0
      }
      let i = 1
      while (
        i < myArray.length &&
        !(
          Number(myArray[i][5]) > Number(newItem) &&
          Number(myArray[i - 1][5]) <= Number(newItem)
        )
      ) {
        i = i + 1
      }

      return i
    } else {
      return Number(myArray.length) + 1
    }
  }
  // Ahora ya se iterar para obtener precios del libro en cada país
  for (let i = 1; i < tableData.length; i++) {
    counter.value = i + 1 // Servirá para saber el número de países que faltan.
    data = await $fetch(
      `/api/book?search=${route.query.book}&type=${route.query.type}&country=${tableData[i][0]}`
    )
    // Si data viene "", PriceofBook será Undefined y PriceopfBookUSD
    // también será undefined. Por lo que no se pusheará el país a
    // tableSortedData.
    const parser = new DOMParser()
    const doc = parser.parseFromString(data.api, 'text/html')
    const pricesSelectedExists = (
      doc.querySelector('.active-price .price') as HTMLElement | null
    )?.innerText.match('([0-9]+)([\\.,][0-9]+)?')
    if (
      pricesSelectedExists &&
      pricesSelectedExists[0].split(/[.,]/).slice(-1)[0].length <= 2 // El precio tiene dos cifras luego de su última coma o punto
    ) {
      tableData[i].push(pricesSelectedExists[0].replace(/,(?=[^.]*$)/, '.')) // Precio
    } else if (
      pricesSelectedExists &&
      pricesSelectedExists[0].split(/[.,]/).slice(-1)[0].length > 2 // El precio tiene 3 o más cifras luego de su última coma o punto
    ) {
      tableData[i].push(pricesSelectedExists[0].replace(/[.,]/g, '')) // Precio (Para precios que la coma divide miles)
    } else if (doc.querySelector('.pricing-title')) {
      tableData[i].push(
        (doc.querySelector('.pricing-title') as HTMLElement | null)?.innerText // Si el libro es free
      )
    } else {
      tableData[i].push(undefined) // No hay libro en ese país
    }
    // Falta agregar condición, qué hacer si el libro es free. NO se
    // debe multiplicar. igualar Price USD a PriceofBook ambos dirán FREE
    const exRate = tableData[i][3]
    const PriceOfBook = tableData[i][4]
    tableData[i].push(
      exRate !== undefined && PriceOfBook !== undefined
        ? (Number(exRate) * Number(PriceOfBook)).toFixed(2) // Price in USD Price*exChangeRate (two decimals)
        : undefined
    )
    // Se usará la función search() para buscar posición para agregar tableData[i] al array de tableSortedData
    // Los valores de posición de cada array a agregar se calculará en base a una búsqueda lineal https://stackoverflow.com/questions/42946561/how-can-i-push-an-element-into-array-at-a-sorted-index-position
    // Agregar tableData[i] al array de tableSortedData
    // Se agregará cada array de país completo en cada iteración porque se pintará el DOM con el array tableSortedData).
    // Se va allenar con Splice() uno por uno en cada iteración de conseguir precios.
    const priceUSDOfBook = tableData[i][5]
    if (
      exRate !== undefined &&
      PriceOfBook !== undefined &&
      priceUSDOfBook !== undefined
    ) {
      tableSortedData.splice(
        busquedaLineal(tableSortedData, priceUSDOfBook),
        0,
        [
          tableData[i][0],
          tableData[i][1],
          tableData[i][2],
          exRate,
          PriceOfBook,
          priceUSDOfBook,
        ]
      )
    }
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen font-mono justify-center">
    <h1 class="flex justify-center">
      <NuxtLink class="text-red-600 no-underline" to="/"
        >Kobo Price Scraper</NuxtLink
      >
    </h1>

    <NuxtLink
      class="h-full w-fit bg-red-600 text-white rounded-full border-2 border-inherit px-1.5 py-1 no-underline self-center text-center rounded-full"
      to="/search?books="
      >Go look for more books</NuxtLink
    >
    <PricesBookCard :book-card-prop="bookCard"></PricesBookCard>
    <PricesTable
      class="self-center"
      :counter-prop="counter"
      :table-sorted-data-prop="tableSortedData"
    ></PricesTable>
    <PieDePagina />
  </div>
</template>

<style></style>
