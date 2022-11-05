import { db } from "config/firebase";
import { useAuth } from "context/AuthContext";
import { doc, DocumentData, DocumentSnapshot, getDoc } from "firebase/firestore";
import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import useSWR from "swr";

import { useProtection } from "utils/useProtection";

export interface UserDTO {
  role: string;
  personalEmail: string;
  baylorEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  state: string;
}

const Home: NextPage | any = () => {
  const { logOut, user } = useAuth();
  const [ isAuthed ] = useProtection();
  const router: NextRouter = useRouter();

  // fetch the user by their user id in firestore
  const { data: userData } = useSWR(`/users/${user?.uid}`, async (): Promise<DocumentData | undefined> => { 
    const document: DocumentSnapshot<DocumentData> = await getDoc(doc(db, "users", user.uid));
    return document.data();
  })

  const handleLogout = async () => {
    await logOut();
    router.replace('/')
  }

  if (!isAuthed) {
    return <></>
  }

  return (
    isAuthed && userData && (
      <>
        <div>
          { Object.entries(userData).map(([k, v]) => <div key={`${k} : ${v}`}>{`${k} : ${v}\n`}</div>) }
        </div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </>
    )
  )

}

export default Home;