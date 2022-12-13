import { MeiliSearch } from "meilisearch"

const MeiliClient = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || "",
  apiKey: process.env.MEILISEARCH_API_KEY || ""
})

export default MeiliClient