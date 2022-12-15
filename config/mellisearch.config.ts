import { MeiliSearch } from "meilisearch"

const MeiliClient: MeiliSearch = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || ""
})

export default MeiliClient