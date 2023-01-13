// eslint-disable no-alert, no-console

// next imports
import type { GetServerSideProps, NextPage } from "next"
import { NextRouter, useRouter } from "next/router"
import dynamic from "next/dynamic"

// custom hook imports
import { useAuth } from "context/AuthContext"

import { getUserById } from "pages/api/users/[uid]"
import { getFullTextSearchUsers } from "pages/api/users"
import { useMutation, useQuery } from "react-query"
import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "config/firebase"
// import UserCard from "components/home/UserCard"
import { Fragment, useEffect, useRef, useState } from "react"
import { Menu } from "@headlessui/react"
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon"
// import UserModal from "components/home/UserModal"
import { withProtection } from "utils/hooks/withProtection"
import { Alert, Snackbar } from "@mui/material"
import NavBar from "components/home/NavBar"

const DynamicNavBar = dynamic(() => import("components/home/NavBar"))
const DynamicSnackBar = dynamic(() => import("@mui/material/Snackbar"))
const DynamicAlertBar = dynamic(() => import("@mui/material/Alert"))
const DynamicUserModal = dynamic(() => import("components/home/UserModal")) 
const DynamicUserCard = dynamic(() => import("components/home/UserCard"))

const Home: NextPage<HomePageProps> = ({ user, uid, alumni }) => {
  const router: NextRouter = useRouter()
  const { logOut }: AuthContextType = useAuth()

  const [snackBarMsg, setSnackBarMsg] = useState<SnackBarError>({ isError: false, isSuccess: false, msg: null })
  const [filters, setFilters] = useState<string>("")
  const [orderBy, setOrderBy] = useState<string>("")
  const queryRef: React.MutableRefObject<string> = useRef<string>("")

  const [openModal, setOpenModal] = useState<boolean[]>(alumni.hits.map(() => false))

  const handleLogout = async (): Promise<void> => await logOut()
  const refreshData = () => router.replace(router.asPath)

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

  const { mutate: connectUser } = useMutation(
    async (connectData: BodyInit): Promise<Response> => fetch("/api/users/connect", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(connectData)
    }), {
      mutationKey: "/api/users/connect",
      onSuccess: () => { 
        setSnackBarMsg({ isError: false, isSuccess: true, msg: "Connection Request Sent" })
        refreshData()
      },
      onError: () => setSnackBarMsg({ isError: true, isSuccess: false, msg: "Cannot connect to user" })
    }
  )
  
  if (!user) {
    return <></>
  }

  return (
    <>
      <Snackbar
        open={snackBarMsg.isError || snackBarMsg.isSuccess}
        autoHideDuration={2000}
        onClose={() => setSnackBarMsg({ isError: false, isSuccess: false, msg: null })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={(snackBarMsg.isError) ? "error" : "success"} onClose={() => setSnackBarMsg({ isError: false, isSuccess: false, msg: null })}>
          {snackBarMsg.msg}
        </Alert>
      </Snackbar>
      <div className="min-h-screen bg-neutral-200">
        <DynamicNavBar
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
            <div className="block content-center pb-2 pt-4 rounded-md shadow-xl bg-white max-w-full min-w-fit w-11/12">
              <div className="flex">
                <Menu as={Fragment}>
                  <Menu.Button className="p-2 mb-4 border-2 border-white rounded-md hover:bg-white hover:text-black transition-colors duration-75">
                    Sort By
                    <ChevronDownIcon className="w-4 h-4 inline" />
                  </Menu.Button>
                  <Menu.Items as="div" className="grid grid-flow-row absolute mt-2 w-30 origin-bottom-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                          value="city"
                          onClick={(e) => setOrderBy((e.target as HTMLInputElement).value)}
                        >
                          City
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item as={Fragment}>
                      {({ active }) => (
                        <button
                          className={`${(active) ? "bg-primaryTwo-600 text-white" : "bg-primaryTwo-50 text-black"} rounded-md pt-2 pb-2 pl-4 pr-4 transition-colors duration-150`}
                          value="firstName"
                          onClick={(e) => setOrderBy((e.target as HTMLInputElement).value)}
                        >
                          Firstname
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item as={Fragment}>
                      {({ active }) => (
                        <button
                          className={`${(active) ? "bg-primaryTwo-600 text-white" : "bg-primaryTwo-50 text-black"} rounded-md pt-2 pb-2 pl-4 pr-4 transition-colors duration-150`}
                          value="lastName"
                          onClick={(e) => setOrderBy((e.target as HTMLInputElement).value)}
                        >
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
                    <DynamicUserCard
                      onClick={() => setOpenModal(modals => {
                        const newModals = [...modals]
                        newModals[idx] = true
                        return newModals
                      })} 
                      key={`${obj.uid}_${idx}`} 
                      profileImageUrl={profileImages?.[idx]} 
                      user={obj} 
                    />
                    <DynamicUserModal
                      key={`${obj.uid}_${idx}_modal`}
                      open={openModal[idx]}
                      user={obj}
                      profileImage={profileImages?.[idx]}
                      handleClose={() => setOpenModal(modals => {
                        const newModals = [...modals]
                        newModals[idx] = false
                        return newModals
                      })} 
                      handleConnect={() => { 
                        const connectObj: any = { currentUser: uid, connectUser: obj.uid || "" }
                        connectUser(connectObj)
                      }}
                      disableConnect={uid === obj.uid || !!user.connections?.[obj.uid || ""]}
                    />
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

export default withProtection(Home)