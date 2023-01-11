import UserCard from "components/home/UserCard"
import { storage } from "config/firebase"
import { getDownloadURL, ref } from "firebase/storage"
import { GetServerSideProps, NextPage } from "next"
import { getUserById } from "pages/api/users/[uid]"
import { useQuery } from "react-query"

const Connections: NextPage<{ user: UserDTO, userConnections: any }> = ({
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
    <div>
      {userConnections.map((connection: UserDTO, idx: number) => <UserCard key={`${connection.firstName}_${connection.lastName}_connection`} onClick={(): void => {}} profileImageUrl={profileImages?.[idx] || ""} user={connection}  /> )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{ user: UserDTO, userConnections: any }> = async (context: any) => {

  const { uid } = context.query

  const user: FirebaseFirestore.DocumentData | undefined = await getUserById(uid)
  const userConnections = await Promise.all(Object.entries(user?.connections).map(([k, v]) => getUserById(k)))
  
  return {
    props: {
      user: user || null,
      userConnections
    }
  }
}

export default Connections