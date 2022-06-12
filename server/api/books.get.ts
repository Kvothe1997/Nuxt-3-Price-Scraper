export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  let books = query.search;
  console.log(books);
  console.log("---");
  let data = await $fetch(`https://www.kobo.com/us/en/search?query=${books}`);
  return { api: data };
});
