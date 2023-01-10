import { firestore } from "config/firebaseAdmin"
import { NextApiRequest, NextApiResponse } from "next"

export async function connectService(currentUserId: string, connectUserId: string) {
  const currentUser: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = await firestore.collection("users").doc(currentUserId).get()
  const currentUserData: FirebaseFirestore.DocumentData | undefined = currentUser.data()

  const connectUser: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = await firestore.collection("users").doc(connectUserId)

  if (!currentUserData)
    throw new Error(`User Data not found with user id: ${currentUserId}`)

  currentUserData["connections"][connectUserId] = connectUser

  await firestore.collection("users").doc(currentUserId).update(currentUserData)
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<{ status: string, message: string } | string>
) {

  const { method, body: { currentUser, connectUser } } = req

  if (typeof connectUser !== "string" || typeof currentUser !== "string")
    return res.status(400).send("Invalid \"user\" param")

  switch (method) {
  case "POST": {
    try {

      await connectService(currentUser, connectUser)

      return res.status(200).json({ status: "success", message: `${currentUser} is connected with ${connectUser}` })
    }
    catch (e) {
      return res.status(500).json({ status: "success", message: e?.toString() || "" })
    }
    
  } 
  default: {
    return res.status(403).send(`Invalid method: ${method}`)
  }
    
  }

}