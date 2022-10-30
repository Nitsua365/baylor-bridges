import { db } from "config/firebase";
import { useAuth } from "context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";

import useProtection from "utils/useProtection";

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

const Home: NextPage = () => {
  const { logOut, user } = useAuth();
  const { isAuthenticated : isAuthed } = useProtection();

  const router: NextRouter = useRouter();

  const [userData, setUserData] = useState<UserDTO | undefined>(undefined)

  const handleLogout = async () => {
    await logOut();
    router.replace('/')
  }

  useEffect(() => {
    if (user && isAuthed) {
      getDoc(doc(db, "users", user.uid))
        .then((getUser) => setUserData(getUser.data()))
    }
  }, [user, isAuthed])

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