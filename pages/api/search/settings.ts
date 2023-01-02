/* eslint-disable indent */
import { NextApiRequest, NextApiResponse } from "next/types"

import MeiliClient from "config/meilisearch.config"
import { Index, Settings } from "meilisearch"

export async function getSearchAttributes(indexName: string) {
  const userIndex: Index = MeiliClient.index(indexName)
  const result: Settings = await userIndex.getSettings()
  return result
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | Settings>
) {

  const { method, query: { indexName } } = req

  switch (method) {
    case "GET": {

      if (!indexName || typeof indexName !== "string") 
        return res.status(404).send("Invalid index name")

      const result: Settings = await getSearchAttributes(indexName)

      return res.status(200).send(result)
    }
    default: {
      return res.status(403).send(`Invalid method: ${method}`)
    }
  }

}