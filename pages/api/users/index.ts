/* eslint-disable indent */
import { NextApiRequest, NextApiResponse } from "next"

import { firestore } from "config/firebaseAdmin"

export async function getPaginatedUsers(start: number, limit: number, orderBy?: string | undefined, roleFilter?: UserRoles) {

  const coll: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> = firestore.collection("users")
  let users

  if (orderBy)
    users = await coll.orderBy(orderBy).startAt(start).limit(limit).get()
  else
    users = await coll.startAt(start).limit(limit).get()

  users = users.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))

  return (!roleFilter) ? 
    users
    :
    users.filter(({ role } : UserDTO) => role === roleFilter)
} 

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<FirebaseFirestore.DocumentData | string>
) { 

  const isUserRole = (x: string): x is UserRoles => x === "student" || x === "alumni"

  const { method, query: { start, limit, q, orderBy, roleFilter } } = req

  // check the start and limit queries
  if (!start || !limit)
    return res.status(400).send("Invalid pagination queries")

  if (typeof orderBy !== "string" && orderBy !== undefined)
    return res.status(400).send("Invalid orderBy query")

  if (typeof roleFilter !== "string" || !isUserRole(roleFilter))
    return res.status(400).send("Invalid roleFilter query must be: \"alumni\" or \"student\"")

  // switch based off HTTP method
  switch (method) {
    case "GET": {
      const result = await getPaginatedUsers(+start, +limit, orderBy, roleFilter)
      return res.status(200).json(result)
    }
    default: {
      return res.status(403).send(`Invalid method: ${method}`)
    }
  }

}