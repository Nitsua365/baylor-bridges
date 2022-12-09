import type { GetServerSideProps, NextPage } from "next"

import { useAuth } from "context/AuthContext"
import { useProtection } from "utils/hooks/useProtection"

import { getUserById } from "pages/api/users/[uid]"
import NavBar from "components/home/NavBar"

const Home: NextPage<HomePageProps> = ({ user, uid }) => {
  const [isAuthed]: readonly [boolean] = useProtection(uid)
  const { logOut }: AuthContextType = useAuth()

  if (!isAuthed || !user) {
    return <></>
  }

  const handleLogout = async (): Promise<void> => await logOut()

  return (
    <>
      <div className="min-h-screen bg-neutral-200">
        <NavBar
          user={user}
          uid={uid}
          handleLogout={handleLogout}
          enableSearchBar={true}
        />
        <div className="mt-8 ml-8 max-w-full flex flex-row items-center justify-center">
          <div className="flex-initial w-1/3">
            <div className="block pb-6 pt-2 rounded-md shadow-xl bg-white max-w-7xl min-w-fit w-11/12 mb-8">
              
            </div>
          </div>
          <div className="flex-initial w-2/3">
            <div className="block content-center pb-2 pt-2 rounded-md shadow-xl bg-white max-w-full min-w-fit w-11/12">
              <div className="flex flex-col justify-center items-center">
                <div className="flex-initial pb-6 pt-2 rounded-md shadow-xl bg-neutral-300 max-w-full min-w-fit w-11/12 mb-8">

                </div>
                <div className="flex-initial pb-6 pt-2 rounded-md shadow-xl bg-neutral-300 max-w-full min-w-fit w-11/12 mb-8">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context: any) => {

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