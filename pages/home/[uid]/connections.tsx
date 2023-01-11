import UserCard from "components/home/UserCard"
import { GetServerSideProps, NextPage } from "next"
import { getUserById } from "pages/api/users/[uid]"

const Connections: NextPage<{ user: UserDTO, userConnections: any }> = ({
  user,
  userConnections
}) => {
  return (
    <div>
      {userConnections.map((connection: UserDTO) => <UserCard key={`${connection.firstName}_${connection.lastName}_connection`} onClick={(): void => {}} profileImageUrl={""} user={connection}  /> )}
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