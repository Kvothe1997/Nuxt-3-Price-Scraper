export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  let book = query.search;
  console.log(book);
  console.log("---");
  let data = await $fetch(`https://www.kobo.com/us/en/search?query=${book}`);
  return { api: data };
});
