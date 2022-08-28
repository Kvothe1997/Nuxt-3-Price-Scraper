export default defineEventHandler(async () => {
  const data = await $fetch<string>(
    `https://www.x-rates.com/table/?from=USD&amount=1`
  ).catch(() => '')
  return { api: data }
})
