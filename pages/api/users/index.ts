/* eslint-disable indent */
import { NextApiRequest, NextApiResponse } from "next"

import { firestore } from "config/firebaseAdmin"

import MeiliClient from "config/meilisearch.config"
import { Index, Settings } from "meilisearch"

// service layer function to get Paginated and Filtered users
export async function getPaginatedUsers(start: number, limit: number, orderBy?: string, roleFilter?: UserRoles) {

  const coll: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> = firestore.collection("users")
  let users: any

  if (orderBy)
    users = await coll.orderBy(orderBy).startAt(start).limit(limit).get()
  else
    users = await coll.startAt(start).limit(limit).get()

  users = users.docs.map((doc : any) => ({ uid: doc.id, ...doc.data() }))

  return (!roleFilter) ? 
    users
    :
    users.filter(({ role }: UserDTO) => role === roleFilter)
}

export async function getFullTextSearchUsers({ start, limit, orderBy, roleFilter, filters, q } : UsersServiceParams) {

  const userIndex: Index = MeiliClient.index("users")
  const settings: Settings = await userIndex.getSettings()

  const results = await userIndex.search(q, {
    offset: start,
    limit,
    sort: (orderBy) ? [`${orderBy}:asc`] : [],
    filter: (roleFilter) ? `role = ${roleFilter}${(filters?.length) ? ` AND ${filters}` : "" }` : filters,
    facets: settings.filterableAttributes?.filter((attr: string) => attr !== "role")
  })
  
  return results
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<FirebaseFirestore.DocumentData | string>
) { 

  const isUserRole = (x: string | string[] | undefined): x is UserRoles => x === "student" || x === "alumni" || x === undefined

  const { 
    method, 
    query: { 
      start, 
      limit,
      q, 
      orderBy, 
      roleFilter, 
      filters 
    } 
  } = req

  // check the start and limit queries
  if (typeof start !== "string" || typeof limit !== "string" || isNaN(+start) || isNaN(+limit))
    return res.status(400).send("Invalid pagination queries")

  // check the order by data type
  if (typeof orderBy !== "string" && orderBy !== undefined)
    return res.status(400).send("Invalid orderBy query")

  // check the search query
  if (typeof q !== "string" || q === undefined)
    return res.status(400).send("Invalid full text query")

  // check the roleFilter and ensure UserRole type
  if (!isUserRole(roleFilter))
    return res.status(400).send("Invalid roleFilter query must be: \"alumni\" or \"student\"")

  if (typeof filters !== "string" || filters === undefined) {
    return res.status(400).send("Invalid filters")
  }

  // switch based off HTTP method
  switch (method) {
    case "GET": {

      const result = await getFullTextSearchUsers({ start: +start, limit: +limit, orderBy, roleFilter, filters, q })

      return res.status(200).json(result)
    }
    default: {
      return res.status(403).send(`Invalid method: ${method}`)
    }
  }

}