export default defineEventHandler(async () => {
  const data = await $fetch(`https://www.x-rates.com/table/?from=USD&amount=1`)
  return { api: data }
})
