import { NextApiRequest, NextApiResponse } from "next"

import { firestore } from "config/firebaseAdmin"

export async function getPaginatedUsers(start: number, limit: number) {
  const users = await firestore.collection("users").orderBy("lastName").startAt(start).limit(limit).get()
  return users.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<FirebaseFirestore.DocumentData | string>
) { 

  const { method, query: { start, limit, q, orderBy } } = req

  // check the start and limit queries
  if (!start || !limit)
    return res.status(400).send("Invalid pagination queries")

  switch (method) {
  case "GET": {
    const result = await getPaginatedUsers(+start, +limit)
    return res.status(200).json(result)
  }
  default: {
    return res.status(403).send(`Invalid method: ${method}`)
  }
      
  }

}