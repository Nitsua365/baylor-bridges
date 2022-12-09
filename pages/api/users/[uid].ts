/* eslint-disable indent */
import { NextApiRequest, NextApiResponse } from "next"

import { firestore } from "config/firebaseAdmin"

export async function getUserById(uid: string): Promise<FirebaseFirestore.DocumentData | undefined> { 
  const doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = await firestore.collection("users").doc(uid).get()
  return doc.data()
}

export async function updateUserById(uid: string, body: EditUserDTO) {
  await firestore.collection("users").doc(uid).update(body)
  return await getUserById(uid)
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<FirebaseFirestore.DocumentData | string>
) {

  const { method, query: { uid } } = req

  if (typeof uid !== "string")
    return res.status(400).send("Invalid uid")

  switch (method) {
    case "GET": {
      const data: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

      if (!data)
        return res.status(404).send("User Not Found")

      return res.status(200).json(data)
    }
    case "PUT" : {
      const { body } = req

      try {
        const user = await updateUserById(uid, body)
        return res.status(200).send({ user, isSuccessful: true, message: `user: ${uid} updated succesfully` })
      }
      catch (error: any) {
        return res.status(500).send(`Internal Server Error: ${error.toString()}`)
      }

    }
    default: {
      return res.status(403).send(`Invalid method: ${method}`)
    }
  }

}