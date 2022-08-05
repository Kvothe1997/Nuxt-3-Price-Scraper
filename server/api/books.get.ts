export default defineEventHandler(async (event) => {
  const query = useQuery(event)
  const books = query.search
  const data = await $fetch(`https://www.kobo.com/us/en/search?query=${books}`)
  return { api: data }
})
