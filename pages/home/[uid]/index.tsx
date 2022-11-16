import type { NextPage } from "next";

import { useAuth } from "context/AuthContext";
import { useProtection } from "utils/hooks/useProtection";

import { forwardRef, Fragment } from "react";
import { getUserById } from "pages/api/users/[uid]";
import NavBar from "components/home/NavBar";

const Home: NextPage | any = ({ user, uid } : any) => {
  const [isAuthed] : readonly[boolean] = useProtection(uid);
  const { logOut } = useAuth();

  const handleLogout = async () : Promise<void> => await logOut();

  if (!isAuthed) {
    return <></>
  }

  return (
    <>
      <NavBar 
        user={user} 
        uid={uid} 
        handleLogout={handleLogout} 
      />
    </>
  )

}

export async function getServerSideProps(context : any) {

  const { uid } = context.params;

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

  return {
    props: {
      user,
      uid
    }
  }
}

export default Home;