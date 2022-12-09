import type { GetServerSideProps, NextPage } from "next"

import { useAuth } from "context/AuthContext"
import { useProtection } from "utils/hooks/useProtection"

import { getUserById } from "pages/api/users/[uid]"
import NavBar from "components/home/NavBar"
import { getPaginatedUsers } from "pages/api/users"

const Home: NextPage<HomePageProps> = ({ user, uid, alumni }) => {
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
                {alumni.map((obj: any, idx: number) => 
                  <div key={`${JSON.stringify(obj)}_${idx}`} className="flex-initial pl-2 pb-6 pt-2 rounded-md shadow-xl bg-neutral-300 max-w-full min-w-fit w-11/12 mb-8">
                    <h1 className="font-bold">{obj.firstName}</h1>
                    <h1>{obj.lastName}</h1>
                    <p>{obj.biography}</p>
                  </div>
                )}
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
  const alumni = await getPaginatedUsers(0, 25, "lastName")

  return {
    props: {
      user: user || null,
      alumni,
      uid
    }
  }
}

export default Home