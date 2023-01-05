// eslint-disable no-alert, no-console
import type { GetServerSideProps, NextPage } from "next"

import { useAuth } from "context/AuthContext"
import { useProtection } from "utils/hooks/useProtection"

import { getUserById } from "pages/api/users/[uid]"
import NavBar from "components/home/NavBar"
import { getFullTextSearchUsers } from "pages/api/users"
import { useQuery } from "react-query"
import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "config/firebase"
import UserCard from "components/home/UserCard"
import { NextRouter, useRouter } from "next/router"
import { Fragment, useEffect, useRef, useState } from "react"
import { Menu } from "@headlessui/react"
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon"
import UserModal from "components/home/UserModal"

const Home: NextPage<HomePageProps> = ({ user, uid, alumni }) => {
  const [isAuthed]: readonly[boolean] = useProtection(uid)
  const { logOut }: AuthContextType = useAuth()
  const router: NextRouter = useRouter()

  const [filters, setFilters] = useState<string>("")
  const [orderBy, setOrderBy] = useState<string>("")
  const queryRef: React.MutableRefObject<string> = useRef<string>("")

  const [openModal, setOpenModal] = useState<Array<boolean>>(alumni.hits.map(() => false))

  const handleLogout = async (): Promise<void> => await logOut()

  const handleSearch = (q: string): void => {
    const queryParams: SearchQueryHomePage = {}
  
    if (q) queryParams["q"] = queryRef.current
    if (filters) queryParams["filters"] = filters
    if (orderBy) queryParams["orderBy"] = orderBy

    router.replace({ pathname: `/home/${uid}`, query: { ...queryParams } })
  }

  // refresh search results and querying for searching alumni
  useEffect(() => { handleSearch(queryRef.current) }, [filters, orderBy])

  // data fetch URL's for profile images
  const { data: profileImages } = useQuery(
    `profileImages/${alumni.hits.map((user: UserDTO) => user.uid).join(",")}`,
    async () => {
      const profilePics = alumni.hits.map(({ uid }: UserDTO) => 
        getDownloadURL(ref(storage, `profileImages/${uid}`))
          .then(res => res)
          .catch(() => null))
      return await Promise.all(profilePics)
    },
    {
      retry: false
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
          handleSearch={handleSearch}
          enableSearchBar={true}
          queryRef={queryRef}
        />
        <div className="mt-8 ml-8 max-w-full flex flex-row items-center justify-center">
          <div className="flex-initial w-1/3">
            <div className="block pb-6 pt-2 rounded-md shadow-xl bg-white max-w-7xl min-w-fit w-11/12 mb-8">
              <div className="ml-2">
                <h1 className="text-xl border-b-2 border-neutral-300">
                  Filters
                </h1>
                <div>
                  {Object.entries(alumni.facetDistribution).map(([facetName, facets]: [string, unknown], idx: number) => (
                    <div key={`${facetName}_${idx}_outerdiv`}>
                      <p className="text-lg" key={`${facetName}_${idx}_title`}>
                        {facetName}
                      </p>
                      <div className="flex flex-col" key={`${facetName}_${idx}_div`}>
                        {/* eslint-disable-next-line @typescript-eslint/ban-types */}
                        {Object.entries(facets as Object).map(([facetDataName, count]: [string, number], subIndx: number) => (
                          <label key={`${facetName}_${subIndx}_${facetDataName}_label`}>
                            <input 
                              id={`${facetDataName}_checkbox`}
                              value={facetDataName}
                              defaultChecked={false}
                              type="checkbox"
                              checked={router.asPath.includes(facetDataName)}
                              key={`${facetName}_${subIndx}_${facetDataName}_checkbox`}
                              className="ml-2 mr-1"
                              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(
                                (filt: string) => {
                                  if (!filt.includes(e.target.value)) return `${facetName} = ${e.target.value} ${(filt.length) ? "OR" : ""} ${filt}`
                                  else return filt.split("OR").filter(filterItem => !filterItem.includes(e.target.value)).join("OR")
                                }
                              )}
                            />
                            {`${facetDataName} (${count})`}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="flex-initial w-2/3">
            <div className="block content-center pb-2 pt-8 rounded-md shadow-xl bg-white max-w-full min-w-fit w-11/12">
              <div className="flex">
                <Menu as={Fragment}>
                  <Menu.Button className="p-2 border-2 border-white rounded-md hover:bg-white hover:text-black transition-colors duration-75">
                    Sort By
                    <ChevronDownIcon className="w-4 h-4 inline" />
                  </Menu.Button>
                  <Menu.Items as="div" className="grid grid-flow-row absolute top-14 mt-2 w-30 origin-bottom-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item as={Fragment}>
                      {({ active }) => (
                        <button
                          className={`${(active) ? "bg-primaryTwo-600 text-white" : "bg-primaryTwo-50 text-black"} rounded-md pt-2 pb-2 pl-4 pr-4 transition-colors duration-150`}
                          value=""
                          onClick={() => setOrderBy("")}>
                          None
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item as={Fragment}>
                      {({ active }) => (
                        <button
                          className={`${(active) ? "bg-primaryTwo-600 text-white" : "bg-primaryTwo-50 text-black"} rounded-md pt-2 pb-2 pl-4 pr-4 transition-colors duration-150`}
                          value="firstName"
                          onClick={(e) => setOrderBy((e.target as HTMLInputElement).value)}>
                          Firstname
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item as={Fragment}>
                      {({ active }) => (
                        <button
                          className={`${(active) ? "bg-primaryTwo-600 text-white" : "bg-primaryTwo-50 text-black"} rounded-md pt-2 pb-2 pl-4 pr-4 transition-colors duration-150`}
                          value="lastName"
                          onClick={(e) => setOrderBy((e.target as HTMLInputElement).value)}>
                          Lastname
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
              <div className="flex flex-col justify-center items-center">
                {alumni.hits.map((obj: UserDTO, idx: number) => (
                  <>
                    <UserCard 
                      onClick={() => setOpenModal(modals => {
                        const newModals = [...modals]
                        newModals[idx] = true
                        return newModals
                      })} 
                      key={`${obj.uid}_${idx}`} 
                      profileImageUrl={profileImages?.[idx]} 
                      user={obj} 
                    />
                    <UserModal
                      key={`${obj.uid}_${idx}_modal`}
                      open={openModal[idx]}
                      user={obj}
                      handleClose={() => setOpenModal(modals => {
                        const newModals = [...modals]
                        newModals[idx] = false
                        return newModals
                      })} />
                  </>
                ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context: any) => {

  const { uid, orderBy, q, filters } = context.query

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
      alumni,
      uid
    }
  }
}

export default Home