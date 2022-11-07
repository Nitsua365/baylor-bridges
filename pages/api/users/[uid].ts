import { NextApiRequest, NextApiResponse } from "next";

import { firestore } from "config/firebaseAdmin";

export async function getUserById(uid: string) { 
  const doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = await firestore.collection('users').doc(uid).get();
  return doc.data();
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<FirebaseFirestore.DocumentData | string>
) {

  const { method, query: { uid } } = req;

  if (typeof uid !== "string")
    return res.status(400).send("Invalid uid")

  switch (method) {
    case 'GET':
      const data: FirebaseFirestore.DocumentData | undefined = await getUserById(uid);

      if (!data)
        return res.status(404).send("User Not Found");

      return res.status(200).json(data);
    default:
      return res.status(403).send(`Invalid method: ${method}`)
  }

}