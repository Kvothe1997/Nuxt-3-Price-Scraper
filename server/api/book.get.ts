export default defineEventHandler(async (event) => {
  const query = useQuery(event)
  const book = query.search
  const type = query.type
  const country = query.country
  const data = await $fetch<string>(
    `https://www.kobo.com/${country}/en/${type}/${book}`
  ).catch(() => '')
  return { api: data }
})
