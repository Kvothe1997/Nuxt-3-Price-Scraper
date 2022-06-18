export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  let book = query.search;
  let type = query.type;
  console.log(book + " and " + type);
  console.log("---");
  let data = await $fetch(`https://www.kobo.com/us/en/${type}/${book}`);
  return { api: data };
});
