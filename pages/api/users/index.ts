/* eslint-disable indent */
import { NextApiRequest, NextApiResponse } from "next"

import { firestore } from "config/firebaseAdmin"

export async function getPaginatedUsers(start: number, limit: number, orderBy?: string | undefined, roleFilter?: "alumni" | "students") {

  const coll = firestore.collection("users")
  let users

  if (orderBy)
    users = await coll.orderBy(orderBy).startAt(start).limit(limit).get()
  else
    users = await coll.startAt(start).limit(limit).get()

  return users.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<FirebaseFirestore.DocumentData | string>
) { 

  const { method, query: { start, limit, q, orderBy, roleFilter } } = req

  // check the start and limit queries
  if (!start || !limit)
    return res.status(400).send("Invalid pagination queries")

  if (typeof orderBy !== "string" && orderBy !== undefined)
    return res.status(400).send("Invalid orderBy query")

  // switch based off HTTP method
  switch (method) {
    case "GET": {
      const result = await getPaginatedUsers(+start, +limit, orderBy)
      return res.status(200).json(result)
    }
    default: {
      return res.status(403).send(`Invalid method: ${method}`)
    }
  }

}