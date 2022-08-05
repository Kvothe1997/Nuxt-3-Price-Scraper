export default defineEventHandler(async (event) => {
  const query = useQuery(event)
  const book = query.search
  const type = query.type
  const country = query.country
  const data = await $fetch(
    `https://www.kobo.com/${country}/en/${type}/${book}`
  )
  return { api: data }
})
