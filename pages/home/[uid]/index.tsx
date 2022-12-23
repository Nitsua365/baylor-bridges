import type { GetServerSideProps, GetStaticProps, NextPage } from "next"

import { useAuth } from "context/AuthContext"
import { useProtection } from "utils/hooks/useProtection"

import { getUserById } from "pages/api/users/[uid]"
import NavBar from "components/home/NavBar"
import { getFullTextSearchUsers, getPaginatedUsers } from "pages/api/users"
import { useQuery } from "react-query"
import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "config/firebase"
import UserCard from "components/home/UserCard"
import { NextRouter, useRouter } from "next/router"
import { useState } from "react"
import { getAttributes } from "pages/api/search/settings"
import { Settings } from "meilisearch"


const Home: NextPage<HomePageProps> = ({ user, uid, alumni }) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid)
  const { logOut }: AuthContextType = useAuth()
  const router: NextRouter = useRouter()

  const [filters, setFilters] = useState("")
  const [orderBy, setOrderBy] = useState("")

  const handleLogout = async (): Promise<void> => await logOut()
  const handleSearch = (q: string): Promise<boolean> => router.push({ pathname: router.asPath, query: { q, filters, orderBy } })

  // data fetch URL's for profile images
  const { data: profileImages } = useQuery(
    `profileImages/${alumni.map((user: UserDTO) => user.uid).join(",")}`,
    async () => {
      const profilePics = alumni.map(({ uid }: UserDTO) => getDownloadURL(ref(storage, `profileImages/${uid}`)).then(res => res).catch(() => null))
      return await Promise.all(profilePics)
    }
  )

  // data fetch for filterable attributes
  const { data: searchSettings, isLoading: isLoadingSettings } = useQuery(
    "/api/search/settings",
    async () => {
      const res: Response = await fetch("/api/search/settings?indexName=users", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      return await res.json()
    }
  )

  if (!isAuthed || !user) {
    return <></>
  }

  return (
    <>
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
              <div className="ml-2">
                <h1 className="text-xl border-b-2 border-neutral-300">
                  Filters
                </h1>
                <div>
                  {!isLoadingSettings && searchSettings.filterableAttributes
                    .filter((filter: string) => filter !== "role")
                    .map((item: "city" | "state", idx: number) => (
                      <div key={`${item}_${idx}_outerdiv`}>
                        <p key={`${item}_${idx}_title`}>
                          {item}
                        </p>
                        <div key={`${item}_${idx}_div`}>
                          {Array.from(new Set(alumni.map((user: UserDTO) => user[item])))
                            .map((name: any) => (
                              <label key={`${item}_${idx}_${name}_label`}>
                                <input id={`${name}_checkbox`} value={name} defaultChecked={false} type="checkbox" key={`${item}_${idx}_${name}_checkbox`} />
                                {name}</label>
                            ))}
                        </div>
                      </div>
                    )
                    )}
                </div>
              </div>
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
    </>
  )

}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context: any) => {

  const { uid } = context.params

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)
  const alumni = await getFullTextSearchUsers({ start: 0, limit: 25, orderBy: "lastName", roleFilter: "alumni", q: "" })

  return {
    props: {
      user: user || null,
      alumni: alumni.hits || null,
      uid
    }
  }
}

// export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context: any) => {

//   const { uid, q, orderBy, filters } = context.query

//   const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)
//   const alumni = await getFullTextSearchUsers({ start: 0, limit: 25, orderBy, roleFilter: "alumni", filters, q })

//   return {
//     props: {
//       user: user || null,
//       alumni: alumni.hits || null,
//       uid
//     }
//   }
// }

export default Home