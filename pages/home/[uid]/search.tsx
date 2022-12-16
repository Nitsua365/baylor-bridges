import NavBar from "components/home/NavBar"
import UserCard from "components/home/UserCard"
import { useAuth } from "context/AuthContext"
import { storage } from "config/firebase"
import { getDownloadURL, ref } from "firebase/storage"
import { GetServerSideProps, NextPage } from "next"
import { getFullTextSearchUsers } from "pages/api/users"
import { getUserById } from "pages/api/users/[uid]"
import { useQuery } from "react-query"
import { useProtection } from "utils/hooks/useProtection"
import { useRouter } from "next/router"

const Search: NextPage<SearchPageProps> = ({ user, uid, alumni }) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid)
  const { logOut }: AuthContextType = useAuth()
  const router = useRouter()

  const handleLogout = async (): Promise<void> => await logOut()
  const handleSearch = (q: string) => router.push({ pathname: "/home/[uid]/search", query: { uid, limit: 25, start: 0, q } })

  // data fetch URL's for profile images
  const { data: profileImages } = useQuery(
    `profileImages/${uid}`,
    async () => {
      const profilePics = alumni.map(({ uid }: UserDTO) => getDownloadURL(ref(storage, `profileImages/${uid}`)).then(res => res).catch(() => null))
      return await Promise.all(profilePics)
    }
  ) 

  if (!isAuthed || !user) {
    return <></>
  }

  return (
    <div className="min-h-screen bg-neutral-200">
      <NavBar
        user={user}
        uid={uid}
        handleLogout={handleLogout}
        enableSearchBar={true}
        handleSearch={handleSearch}
      />
      <div className="mt-8 ml-8 max-w-full flex flex-row items-center justify-center">
        <div className="flex-initial w-1/3">
          <div className="block pb-6 pt-2 rounded-md shadow-xl bg-white max-w-7xl min-w-fit w-11/12 mb-8">
              
          </div>
        </div>
        <div className="flex-initial w-2/3">
          <div className="block content-center pb-2 pt-8 rounded-md shadow-xl bg-white max-w-full min-w-fit w-11/12">
            <div className="flex flex-col justify-center items-center">
              {alumni.map((obj: UserDTO, idx: number) => <UserCard key={`${obj.uid}_${idx}`} profileImageUrl={profileImages?.[idx]} user={obj} /> )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context: any) => {

  const { uid, q, start, limit, orderBy } = context.query

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)
  const alumni = await getFullTextSearchUsers({start: +start, limit: +limit, orderBy: orderBy, roleFilter: "alumni", q})

  return {
    props: {
      user: user || null,
      alumni: alumni.hits || null,
      q: q || null,
      uid
    }
  }
}

export default Search