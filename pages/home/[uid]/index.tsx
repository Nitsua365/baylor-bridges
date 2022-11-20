import type { GetServerSideProps, NextPage } from "next"

import { useAuth } from "context/AuthContext"
import { useProtection } from "utils/hooks/useProtection"

import { getUserById } from "pages/api/users/[uid]"
import NavBar from "components/home/NavBar"

const Home: NextPage<HomePageProps> = ({ user, uid }) => {
  const [isAuthed] : readonly[boolean] = useProtection(uid)
  const { logOut }: AuthContextType = useAuth()

  if (!isAuthed || !user) {
    return <></>
  }

  const handleLogout = async () : Promise<void> => await logOut()

  return (
    <>
      <div className="min-h-screen bg-neutral-200">
        <NavBar 
          user={user}
          uid={uid} 
          handleLogout={handleLogout} 
          enableSearchBar={true}
        />
      </div>
    </>
  )

}

export const getServerSideProps : GetServerSideProps<HomePageProps> = async (context : any) => {

  const { uid } = context.params

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

  return {
    props: {
      user: user || null,
      uid
    }
  }
}

export default Home