import { NextApiRequest, NextApiResponse } from "next";

import firestore from "config/firebaseAdmin";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";

export async function getUserById(uid: string) { 
  const doc = await firestore.collection('users').doc(uid).get();
  return doc.data();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { uid } } = req;

  if (typeof uid !== "string")
    return res.status(400).send("Invalid uid")

  switch (method) {
    case 'GET':
      const data = await getUserById(uid);
      return res.status(200).json(data);
    default:
      return res.status(403).send(`Invalid method: ${method}`)
  }

}