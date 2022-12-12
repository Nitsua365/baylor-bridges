import NavBar from "components/home/NavBar"
import { useAuth } from "context/AuthContext"
import { GetServerSideProps, NextPage } from "next"
import { getPaginatedUsers } from "pages/api/users"
import { getUserById } from "pages/api/users/[uid]"
import { useProtection } from "utils/hooks/useProtection"

const Search: NextPage<SearchPageProps> = ({ user, uid, alumni, q }) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid)
  const { logOut }: AuthContextType = useAuth()

  const handleLogout = async (): Promise<void> => await logOut()

  return (
    <div className="min-h-screen bg-neutral-200">
      <NavBar
        user={user}
        uid={uid}
        handleLogout={handleLogout}
        enableSearchBar={true}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context: any) => {

  const { uid, q } = context.params

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)

  // TODO: Need to query add search query service function and pass in to context
  // const alumni = await getPaginatedUsers(0, 25, "lastName", "alumni")

  return {
    props: {
      user: user || null,
      alumni: "",
      q: "",
      uid
    }
  }
}
