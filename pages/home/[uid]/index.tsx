import type { GetServerSideProps, NextPage } from "next"

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
import { useEffect, useState } from "react"


const Home: NextPage<HomePageProps> = ({ user, uid, alumni }) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid)
  const { logOut }: AuthContextType = useAuth()
  const router: NextRouter = useRouter()

  const [filters, setFilters] = useState<string>("")
  const [orderBy, setOrderBy] = useState<string>("")

  const handleLogout = async (): Promise<void> => await logOut()
  const handleSearch = (q: string) => { 
    const queryParams: SearchQueryHomePage = {}
  
    if (q) queryParams["q"] = q
    if (filters) queryParams["filters"] = filters
    if (orderBy) queryParams["orderBy"] = orderBy

    router.replace({ pathname: `/home/${uid}`, query: { ...queryParams } })
  }

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

  useEffect(() => {

    const query: SearchQueryHomePage = {}

    if (filters && filters.length) query["filters"] = filters
    if (orderBy && orderBy.length) query["orderBy"] = orderBy

    router.replace({ pathname: `/home/${uid}`, query })
      
  }, [filters, orderBy])

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
                                <input 
                                  id={`${name}_checkbox`}
                                  value={name}
                                  defaultChecked={false}
                                  type="checkbox"
                                  key={`${item}_${idx}_${name}_checkbox`}
                                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(
                                    (filt: string) => { 
                                      if (!filt.includes(e.target.value)) return `${item} = ${e.target.value} ${(filt.length) ? "OR" : ""} ${filt}`
                                      else return filt.split("OR").filter(filterItem => !filterItem.includes(e.target.value)).join("OR")
                                    })} 
                                />
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

  const { uid, q, filters, orderBy } = context.query

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)
  const alumni = await getFullTextSearchUsers({
    start: 0,
    limit: 25,
    orderBy: orderBy || "lastName",
    roleFilter: "alumni",
    q: q || "",
    filters: filters || ""
  })

  return {
    props: {
      user: user || null,
      alumni: alumni.hits || null,
      uid
    }
  }
}

export default Home