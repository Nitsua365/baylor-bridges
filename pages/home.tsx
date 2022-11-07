import { useAuth } from "context/AuthContext";
import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import useSWR from "swr";

import { useProtection } from "utils/hooks/useProtection";

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

  const { data: userData } = useSWR(
    `/api/users/${user?.uid}`,
    async () => { 
      const res = await fetch(`/api/users/${user?.uid}`, { method: "GET" }) 
      return res.json()
    }
  );

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