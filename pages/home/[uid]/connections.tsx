import { NextRouter, useRouter } from "next/router"
import { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"

import UserCard from "components/home/UserCard"
import { storage } from "config/firebase"
import { getDownloadURL, ref } from "firebase/storage"
import { getUserById } from "pages/api/users/[uid]"
import { useQuery } from "react-query"
import { withProtection } from "utils/hooks/withProtection"

const DynamicNavBar = dynamic(() => import("components/home/NavBar"))
const DynamicSnackBar = dynamic(() => import("@mui/material/Snackbar"))
const DynamicAlertBar = dynamic(() => import("@mui/material/Alert"))

const Connections: NextPage<{ user: FirebaseFirestore.DocumentData | UserDTO | null, userConnections: any }> = ({
  user,
  userConnections
}) => {

  // data fetch URL's for profile images
  const { data: profileImages } = useQuery(
    `profileImages/${userConnections.map((user: UserDTO) => user.uid).join(",")}`,
    async () => {
      const profilePics = userConnections.map(({ uid }: UserDTO) => 
        getDownloadURL(ref(storage, `profileImages/${uid}`))
          .then(res => res)
          .catch(() => null))
      return await Promise.all(profilePics)
    },
    {
      retry: false
    }
  )

  return (
    <div className="block content-center pb-2 pt-4 rounded-md shadow-xl bg-white max-w-full min-w-fit w-11/12">
      {userConnections.map((connection: UserDTO, idx: number) => 
        <UserCard 
          key={`${connection.firstName}_${connection.lastName}_connection`} 
          profileImageUrl={profileImages?.[idx] || ""} 
          user={connection}  
        /> )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{ user: FirebaseFirestore.DocumentData | UserDTO | null, userConnections: any }> = async (context: any) => {

  const { uid } = context.query

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)
  const userConnections: any = (user?.connections) ? await Promise.all(Object.entries(user.connections).map(([k, ]) => getUserById(k))) : []

  return {
    props: {
      user: user || null,
      uid: user?.uid || null,
      userConnections: userConnections
    }
  }
}

export default withProtection(Connections)